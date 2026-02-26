import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// ===================================================================
// GOOGLE CALENDAR CONFIGURATION
// ===================================================================

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Initialize Google Calendar client with service account
function getCalendarClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return google.calendar({ version: 'v3', auth });
}

// ===================================================================
// APPOINTMENT TYPE CONFIGURATIONS
// ===================================================================

interface AppointmentConfig {
  duration: number; // minutes
  availableDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  startHour: number; // 24-hour format
  endHour: number; // 24-hour format
  timezone: string;
}

const APPOINTMENT_CONFIGS: Record<string, AppointmentConfig> = {
  'systems': {
    duration: 15,
    availableDays: [1, 2, 3, 4, 5], // Mon-Fri
    startHour: 9,
    endHour: 16, // 4:00 PM
    timezone: 'America/Denver', // Mountain Time
  },
  'consulting': {
    duration: 30,
    availableDays: [1, 2, 3, 4], // Mon-Thu
    startHour: 10,
    endHour: 15, // 3:00 PM
    timezone: 'America/Denver',
  },
  'education': {
    duration: 15,
    availableDays: [2, 3, 4], // Tue-Thu
    startHour: 11,
    endHour: 16, // 4:00 PM
    timezone: 'America/Denver',
  },
};

// ===================================================================
// AVAILABILITY CHECKING
// ===================================================================

export async function getAvailableSlots(
  inquiryType: string,
  lookAheadDays: number = 7
): Promise<{ start: string; end: string; display: string }[]> {
  const config = APPOINTMENT_CONFIGS[inquiryType];
  if (!config) {
    throw new Error(`Invalid inquiry type: ${inquiryType}`);
  }

  const calendar = getCalendarClient();
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + lookAheadDays);

  // Get existing events
  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: now.toISOString(),
    timeMax: endDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const existingEvents = response.data.items || [];

  // Generate potential slots
  const slots: { start: Date; end: Date }[] = [];
  const currentDate = new Date(now);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    if (config.availableDays.includes(dayOfWeek)) {
      // Generate slots for this day
      for (let hour = config.startHour; hour < config.endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, minute, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + config.duration);

          // Skip past slots
          if (slotStart <= now) continue;

          // Check if slot end time exceeds end hour
          if (slotEnd.getHours() > config.endHour || 
              (slotEnd.getHours() === config.endHour && slotEnd.getMinutes() > 0)) {
            continue;
          }

          // Check for conflicts
          const hasConflict = existingEvents.some((event) => {
            const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
            const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

            return (
              (slotStart >= eventStart && slotStart < eventEnd) ||
              (slotEnd > eventStart && slotEnd <= eventEnd) ||
              (slotStart <= eventStart && slotEnd >= eventEnd)
            );
          });

          if (!hasConflict) {
            slots.push({ start: slotStart, end: slotEnd });
          }
        }
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Return first 10 available slots with formatted display
  return slots.slice(0, 10).map((slot) => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString(),
    display: formatSlotDisplay(slot.start, config.timezone),
  }));
}

function formatSlotDisplay(date: Date, timezone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  };

  return date.toLocaleString('en-US', options);
}

// ===================================================================
// BOOKING
// ===================================================================

export async function bookAppointment(params: {
  inquiryType: string;
  startTime: string; // ISO string
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message?: string;
}): Promise<{
  success: boolean;
  eventId?: string;
  eventLink?: string;
  error?: string;
}> {
  try {
    const config = APPOINTMENT_CONFIGS[params.inquiryType];
    if (!config) {
      return { success: false, error: `Invalid inquiry type: ${params.inquiryType}` };
    }

    const calendar = getCalendarClient();
    const startTime = new Date(params.startTime);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + config.duration);

    // Double-check availability before booking
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
    });

    const conflicts = response.data.items || [];
    if (conflicts.length > 0) {
      return { success: false, error: 'Time slot no longer available' };
    }

    // Create event
    const inquiryTypeDisplay = {
      'systems': 'Systems Implementation Call',
      'consulting': 'Strategic Consulting',
      'education': 'Education / Training Intro',
    }[params.inquiryType] || params.inquiryType;

    const event = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        summary: `${inquiryTypeDisplay} - ${params.clientName}`,
        description: `Client: ${params.clientName}\nPhone: ${params.clientPhone}\nEmail: ${params.clientEmail}\nType: ${inquiryTypeDisplay}\n\nMessage: ${params.message || 'No message provided'}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: config.timezone,
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: config.timezone,
        },
        attendees: [
          { email: params.clientEmail, displayName: params.clientName },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      },
      sendUpdates: 'all', // Send email confirmation to attendees
    });

    return {
      success: true,
      eventId: event.data.id || undefined,
      eventLink: event.data.htmlLink || undefined,
    };
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return { success: false, error: error.message || 'Failed to book appointment' };
  }
}

// ===================================================================
// CANCELLATION / RESCHEDULING
// ===================================================================

export async function cancelAppointment(eventId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const calendar = getCalendarClient();
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      sendUpdates: 'all',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error canceling appointment:', error);
    return { success: false, error: error.message || 'Failed to cancel appointment' };
  }
}

export async function rescheduleAppointment(
  eventId: string,
  newStartTime: string
): Promise<{
  success: boolean;
  eventId?: string;
  error?: string;
}> {
  try {
    const calendar = getCalendarClient();
    
    // Get existing event
    const existingEvent = await calendar.events.get({
      calendarId: CALENDAR_ID,
      eventId: eventId,
    });

    const duration = existingEvent.data.end?.dateTime && existingEvent.data.start?.dateTime
      ? (new Date(existingEvent.data.end.dateTime).getTime() - 
         new Date(existingEvent.data.start.dateTime).getTime()) / 60000
      : 30;

    const startTime = new Date(newStartTime);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    // Update event
    const updatedEvent = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      requestBody: {
        ...existingEvent.data,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: existingEvent.data.start?.timeZone || 'America/Denver',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: existingEvent.data.end?.timeZone || 'America/Denver',
        },
      },
      sendUpdates: 'all',
    });

    return {
      success: true,
      eventId: updatedEvent.data.id || undefined,
    };
  } catch (error: any) {
    console.error('Error rescheduling appointment:', error);
    return { success: false, error: error.message || 'Failed to reschedule appointment' };
  }
}
