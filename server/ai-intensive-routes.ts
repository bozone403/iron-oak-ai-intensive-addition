import express, { type Request, type Response } from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import twilio from 'twilio';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { storage } from './storage';
import { v4 as uuidv4 } from 'uuid';
import * as calendarService from './calendar-service';

// ===================================================================
// CONFIGURATION
// ===================================================================

const BASE_URL = process.env.BASE_URL || 'https://api.iron-oak.ca';

// ===================================================================
// INITIALIZE CLIENTS
// ===================================================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Omit apiVersion to use SDK default
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

function normalizePhone(phone: string): string {
  // Already E.164?
  if (phone.startsWith('+1') && phone.length === 12) {
    const digits = phone.slice(2);
    if (/^\d{10}$/.test(digits)) {
      return phone;
    }
  }
  
  // Strip all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // 10 digits => North American
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // 11 digits starting with 1 => North American
  if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`;
  }
  
  // Invalid
  throw new Error(`Invalid phone number: ${phone}. Must be 10 or 11 digits.`);
}

// ===================================================================
// ROUTE REGISTRATION
// ===================================================================

export function registerAIIntensiveRoutes(app: express.Application) {
  
  // ===================================================================
  // MIDDLEWARE ORDERING (CRITICAL)
  // ===================================================================
  
  // 1. STRIPE WEBHOOK - RAW BODY (MUST BE FIRST, BEFORE ANY OTHER MIDDLEWARE)
  app.post(
    '/api/ai/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
      try {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        
        let event: Stripe.Event;
        
        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
          );
        } catch (err: any) {
          console.error('Stripe webhook signature verification failed:', err);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          
          const customerPhone = session.customer_details?.phone;
          const customerEmail = session.customer_details?.email;
          
          if (!customerPhone) {
            console.error('No phone in Stripe session:', session.id);
            return res.json({ received: true });
          }
          
          let normalizedPhone: string;
          try {
            normalizedPhone = normalizePhone(customerPhone);
          } catch (err) {
            console.error(`Invalid phone from Stripe: ${customerPhone}`, err);
            return res.json({ received: true });
          }
          
          const lead = await storage.getAILeadByPhone(normalizedPhone);
          
          if (!lead) {
            console.error(`Lead not found for phone: ${customerPhone}`);
            return res.json({ received: true });
          }
          
          await storage.updateAILead(lead.id, {
            paymentStatus: 'paid',
            amountPaid: session.amount_total || 0,
            paidAt: new Date().toISOString(),
            email: customerEmail || lead.email,
          });
          
          const confirmationMessage = `Hi ${lead.firstName}, you're registered for AI Intensive! 🎉

📅 ${process.env.COURSE_DATES}
⏰ ${process.env.COURSE_TIME}
📍 ${process.env.COURSE_LOCATION}

Bring your laptop. See you there!

Questions? Reply to this message.`;
          
          try {
            const message = await twilioClient.messages.create({
              from: process.env.TWILIO_PHONE_NUMBER,
              to: lead.phone,
              body: confirmationMessage,
            });
            
            console.log(`Confirmation SMS sent to ${lead.phone}: ${message.sid}`);
          } catch (err) {
            console.error(`Failed to send confirmation SMS to ${lead.phone}:`, err);
          }
          
          // Send admin notification
          const adminPhone = '+14036136014';
          const adminMessage = `💰 NEW PAYMENT RECEIVED

Name: ${lead.firstName}
Phone: ${lead.phone}
Email: ${customerEmail || lead.email || 'N/A'}
Amount: $${((session.amount_total || 0) / 100).toFixed(2)}

Course: ${process.env.COURSE_DATES}`;
          
          try {
            await twilioClient.messages.create({
              from: process.env.TWILIO_PHONE_NUMBER,
              to: adminPhone,
              body: adminMessage,
            });
            console.log(`Admin notification sent for lead ${lead.id}`);
          } catch (err) {
            console.error(`Failed to send admin notification:`, err);
          }
          
          console.log(`Payment confirmed for lead ${lead.id}: $${(session.amount_total || 0) / 100}`);
        }
        
        return res.json({ received: true });
        
      } catch (error) {
        console.error('Error in /api/ai/stripe/webhook:', error);
        return res.status(500).send('Internal server error');
      }
    }
  );
  
  // 2. TWILIO WEBHOOKS - URLENCODED (FIXED: no wildcard)
  app.use('/api/ai/twilio', express.urlencoded({ extended: false }));
  app.use('/api/ai/sms', express.urlencoded({ extended: false }));
  
  // 3. CORS - ONLY FOR FRONTEND-FACING ROUTES
  const corsOptions = {
    origin: ['https://iron-oak.ca', 'https://www.iron-oak.ca'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  };
  
  app.options('/api/ai/submit', cors(corsOptions));
  app.use('/api/ai/submit', cors(corsOptions), express.json());
  
  // CORS for admin routes
  app.options('/api/ai/admin/*', cors(corsOptions));
  app.use('/api/ai/admin', cors(corsOptions));
  
  // ===================================================================
  // AI INTENSIVE ROUTES
  // ===================================================================
  
  // POST /api/ai/submit
  app.post('/api/ai/submit', async (req, res) => {
    try {
      const { firstName, lastName, phone, email, inquiryType, message, consentGiven } = req.body;
      
      if (!firstName || !phone || !inquiryType || consentGiven !== true) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields or consent not given',
        });
      }
      
      let normalizedPhone: string;
      try {
        normalizedPhone = normalizePhone(phone);
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
      
      const existing = await storage.getAILeadByPhone(normalizedPhone);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already registered',
        });
      }
      
      const leadId = uuidv4();
      const fullName = lastName ? `${firstName.trim()} ${lastName.trim()}` : firstName.trim();
      const lead = {
        id: leadId,
        firstName: firstName.trim(),
        phone: normalizedPhone,
        email: email?.trim() || null,
        inquiryType: inquiryType,
        message: message?.trim() || null,
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
        ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
        callStatus: 'pending',
        callSid: null,
        callDuration: null,
        smsStatus: 'pending' as const,
        smsOutcome: null,
        smsSid: null,
        smsSentAt: null,
        paymentStatus: 'pending',
        amountPaid: null,
        paidAt: null,
        optedOut: false,
        optedOutAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await storage.saveAILead(lead);
      
      // Send INTERNAL SMS to owner
      const ownerPhone = '+14036136014';
      const shortMessage = message ? (message.length > 100 ? message.substring(0, 100) + '...' : message) : 'No message';
      const internalSMS = `New Lead – Iron & Oak\nName: ${fullName}\nPhone: ${normalizedPhone}\nEmail: ${email || 'Not provided'}\nType: ${inquiryType}\nMessage: ${shortMessage}\nTime: ${new Date().toLocaleString()}`;
      
      twilioClient.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: ownerPhone,
          body: internalSMS,
        })
        .then(message => {
          console.log(`Internal SMS sent to owner: ${message.sid}`);
        })
        .catch(err => {
          console.error(`Failed to send internal SMS:`, err);
        });
      
      // Send OUTBOUND SMS based on inquiry type
      const bookingLink = process.env.BOOKING_LINK || 'https://calendly.com/iron-oak';
      let smsMessage = '';
      
      switch (inquiryType) {
        case 'systems':
          smsMessage = `Hi ${firstName}, this is Iron & Oak.\n\nNext step is a 15-minute systems call to map your operational flow and identify scope.\n\nBook here:\n${bookingLink}\n\nReply CALL if you prefer manual coordination.\n\n403-613-6014`;
          break;
        case 'consulting':
          smsMessage = `Hi ${firstName}, confirmed.\n\nLet's align objectives and timeline.\n\nBook a short strategy call:\n${bookingLink}\n\nIf timing is urgent, reply PRIORITY.\n\n403-613-6014`;
          break;
        case 'education':
          smsMessage = `Hi ${firstName}, here's the next step.\n\nWe offer solo training or team implementation sessions.\n\nBook here:\n${bookingLink}\n\nReply SOLO or TEAM and we'll tailor it.\n\n403-613-6014`;
          break;
        case 'ai-intensive':
          const paymentLink = 'https://buy.stripe.com/3cI8wPfvVh0tgTb7iSgnK02';
          smsMessage = `Hi ${firstName}.\n\nHere's the registration link:\n\n${paymentLink}\n\nLimited seats.\nReply DONE once registered.\n\n403-613-6014`;
          break;
        default:
          smsMessage = `Hi ${firstName}, thanks for reaching out to Iron & Oak.\n\nWe'll be in touch shortly.\n\n403-613-6014`;
      }
      
      if (smsMessage) {
        twilioClient.messages
          .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: normalizedPhone,
            body: smsMessage,
          })
          .then(message => {
            console.log(`SMS sent to ${normalizedPhone}: ${message.sid}`);
            storage.updateAILead(leadId, { 
              smsStatus: 'sent',
              smsSid: message.sid,
              smsSentAt: new Date().toISOString()
            });
          })
          .catch(err => {
            console.error(`Failed to send SMS to ${normalizedPhone}:`, err);
            storage.updateAILead(leadId, { smsStatus: 'failed' });
          });
      }
      
      // Only schedule callback for AI Intensive inquiries
      if (inquiryType === 'ai-intensive') {
        // Schedule callback in 5-10 minutes (random delay)
        const delayMinutes = 5 + Math.floor(Math.random() * 6); // 5-10 minutes
        const delayMs = delayMinutes * 60 * 1000;
      
      setTimeout(async () => {
        try {
          // Check if they've paid yet
          const updatedLead = await storage.getAILeadByPhone(normalizedPhone);
          if (!updatedLead) {
            console.log(`Skipping callback for ${leadId} - lead was deleted`);
            return;
          }
          
          if (updatedLead.paymentStatus === 'pending') {
            // They haven't paid yet, make the call
            const call = await twilioClient.calls.create({
              from: process.env.TWILIO_PHONE_NUMBER,
              to: normalizedPhone,
              url: `${BASE_URL}/api/ai/twilio/voice`,
              statusCallback: `${BASE_URL}/api/ai/twilio/status`,
              statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
              statusCallbackMethod: 'POST',
            });
            console.log(`Delayed callback initiated: ${call.sid} for lead ${leadId}`);
            
            // Try to update, but don't crash if lead was deleted
            try {
              await storage.updateAILead(leadId, { callSid: call.sid });
            } catch (updateErr) {
              console.log(`Could not update lead ${leadId} - may have been deleted`);
            }
          } else {
            console.log(`Skipping callback for ${leadId} - already paid`);
          }
        } catch (err) {
          console.error(`Failed to initiate delayed callback for lead ${leadId}:`, err);
          // Don't try to update if lead doesn't exist
          try {
            await storage.updateAILead(leadId, { callStatus: 'failed' });
          } catch (updateErr) {
            console.log(`Could not update lead ${leadId} - may have been deleted`);
          }
        }
        }, delayMs);
      }
      
      return res.status(200).json({
        success: true,
        message: "Received. Check your phone for next steps.",
        leadId: leadId,
      });
      
    } catch (error) {
      console.error('Error in /api/ai/submit:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });
  
  // POST /api/ai/twilio/voice (PATCH A: Fixed lead lookup for outbound)
  app.post('/api/ai/twilio/voice', async (req, res) => {
    try {
      const twilioSignature = req.headers['x-twilio-signature'] as string;
      const url = `${BASE_URL}/api/ai/twilio/voice`;
      
      if (!twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN!,
        twilioSignature,
        url,
        req.body
      )) {
        console.error('Invalid Twilio signature');
        return res.status(403).send('Forbidden');
      }
      
      // Determine call direction and identify lead's phone number
      const fromNumber = req.body.From;
      const toNumber = req.body.To;
      const callSid = req.body.CallSid;
      const twilioNumber = process.env.TWILIO_PHONE_NUMBER!;
      
      // For inbound calls: user calls Twilio number, so user is 'From'
      // For outbound calls: Twilio calls user, so user is 'To'
      const isInbound = toNumber === twilioNumber;
      const leadPhone = isInbound ? fromNumber : toNumber;
      const direction = isInbound ? 'inbound' : 'outbound';
      
      console.log(`Voice webhook: ${direction} call from ${fromNumber} to ${toNumber}, lead phone: ${leadPhone}`);
      
      let lead = await storage.getAILeadByPhone(leadPhone);
      
      // Auto-create lead for inbound calls from unknown numbers
      if (!lead && isInbound) {
        console.log(`Creating new lead for inbound caller: ${leadPhone}`);
        const newLeadId = uuidv4();
        const newLead = {
          id: newLeadId,
          firstName: 'Unknown',
          phone: leadPhone,
          email: null,
          consentGiven: false,
          consentTimestamp: new Date().toISOString(),
          ipAddress: null,
          userAgent: null,
          callStatus: 'initiated',
          callSid: callSid,
          callDuration: null,
          smsStatus: 'pending' as const,
          smsOutcome: null,
          smsSid: null,
          smsSentAt: null,
          paymentStatus: 'pending',
          amountPaid: null,
          paidAt: null,
          optedOut: false,
          optedOutAt: null,
          scheduledDate: null,
          scheduledNotes: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await storage.saveAILead(newLead);
        lead = newLead;
      } else if (!lead) {
        // Outbound call but no lead found - this shouldn't happen
        console.error(`Outbound call to ${leadPhone} but no lead found`);
        res.type('text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew">Sorry, we encountered an error. Please try again later.</Say>
  <Hangup/>
</Response>`);
        return;
      } else {
        // Update existing lead with call info
        await storage.updateAILead(lead.id, {
          callSid: callSid,
          callStatus: 'initiated',
        });
      }
      
      // Make direct HTTP call to ElevenLabs API instead of using SDK
      const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/convai/twilio/register-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          agent_id: process.env.ELEVENLABS_AGENT_ID!,
          from_number: fromNumber,
          to_number: toNumber,
          direction: direction,
          conversation_initiation_client_data: {
            dynamic_variables: {
              firstName: lead.firstName,
              callerPhone: leadPhone,
              isInbound: isInbound.toString(),
              needsInfo: (lead.firstName === 'Unknown').toString(),
              courseDates: process.env.COURSE_DATES || '',
              courseTime: process.env.COURSE_TIME || '',
              courseLocation: process.env.COURSE_LOCATION || '',
            },
          },
        }),
      });
      
      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text();
        console.error('ElevenLabs API error:', elevenLabsResponse.status, errorText);
        throw new Error(`ElevenLabs API returned ${elevenLabsResponse.status}`);
      }
      
      const twiml = await elevenLabsResponse.text();
      
      console.log(`TwiML for CallSid ${callSid}:`, twiml);
      
      res.type('text/xml');
      res.send(twiml);
      
    } catch (error) {
      console.error('Error in voice webhook:', error);
      
      res.type('text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew">Sorry, we encountered a technical error. Please try again later.</Say>
  <Hangup/>
</Response>`);
    }
  });
  
  // POST /api/ai/twilio/status (PATCH B & C: Fallback lookup + atomic SMS)
  app.post('/api/ai/twilio/status', async (req, res) => {
    try {
      const twilioSignature = req.headers['x-twilio-signature'] as string;
      const url = `${BASE_URL}/api/ai/twilio/status`;
      
      if (!twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN!,
        twilioSignature,
        url,
        req.body
      )) {
        console.error('Invalid Twilio signature');
        return res.status(403).send('Forbidden');
      }
      
      const callSid = req.body.CallSid;
      const callStatus = req.body.CallStatus;
      const callDuration = parseInt(req.body.CallDuration || '0', 10);
      
      // PATCH B: Fallback lookup by phone if callSid mapping not yet stored
      let lead = await storage.getAILeadByCallSid(callSid);
      
      if (!lead) {
        // For outbound calls, To is the lead's number
        lead = await storage.getAILeadByPhone(req.body.To);
        if (lead) {
          await storage.updateAILead(lead.id, { callSid });
        }
      }
      
      if (!lead) {
        console.error(`Lead not found for CallSid: ${callSid}`);
        return res.sendStatus(200);
      }
      
      await storage.updateAILead(lead.id, {
        callStatus: callStatus,
        callDuration: callDuration,
      });
      
      // ===================================================================
      // HANDLE FINAL FAILURE STATUSES FIRST
      // ===================================================================
      
      if (['failed', 'no-answer', 'busy', 'canceled'].includes(callStatus)) {
        
        if (lead.consentGiven !== true || lead.optedOut === true) {
          return res.sendStatus(200);
        }
        
        // PATCH C: Atomic SMS transition using trySetSmsSending
        const acquired = await storage.trySetSmsSending(lead.id, 'missed_offer');
        
        if (!acquired) {
          console.log(`SMS already processed for lead ${lead.id}, skipping`);
          return res.sendStatus(200);
        }
        
        const smsMessage = `Hi ${lead.firstName}, we tried to call you about the AI Intensive but couldn't reach you.

Here's the registration link if you're still interested:
${process.env.STRIPE_PAYMENT_LINK}

Questions? Reply to this message.

Reply STOP to opt out.`;
        
        try {
          const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: lead.phone,
            body: smsMessage,
          });
          
          await storage.updateAILead(lead.id, {
            smsStatus: 'sent',
            smsSid: message.sid,
            smsSentAt: new Date().toISOString(),
          });
          
          console.log(`Missed call SMS sent to ${lead.phone}: ${message.sid}`);
        } catch (err) {
          console.error(`Failed to send missed call SMS to ${lead.phone}:`, err);
          await storage.updateAILead(lead.id, { smsStatus: 'failed' });
        }
        
        return res.sendStatus(200);
      }
      
      // ===================================================================
      // HANDLE COMPLETED STATUS
      // ===================================================================
      
      if (callStatus === 'completed') {
        
        if (lead.consentGiven !== true || lead.optedOut === true) {
          return res.sendStatus(200);
        }
        
        // Check duration threshold
        if (callDuration < 20) {
          console.log(`Call too short (${callDuration}s) for lead ${lead.id}, no SMS`);
          return res.sendStatus(200);
        }
        
        // PATCH C: Atomic SMS transition using trySetSmsSending
        const acquired = await storage.trySetSmsSending(lead.id, 'completed_offer');
        
        if (!acquired) {
          console.log(`SMS already processed for lead ${lead.id}, skipping`);
          return res.sendStatus(200);
        }
        
        const smsMessage = `Hi ${lead.firstName}! Thanks for your interest in the AI Intensive.

Here's your registration link:
${process.env.STRIPE_PAYMENT_LINK}

Only 10 seats available. Questions? Reply to this message.

Reply STOP to opt out.`;
        
        try {
          const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: lead.phone,
            body: smsMessage,
          });
          
          await storage.updateAILead(lead.id, {
            smsStatus: 'sent',
            smsSid: message.sid,
            smsSentAt: new Date().toISOString(),
          });
          
          console.log(`Registration SMS sent to ${lead.phone}: ${message.sid}`);
        } catch (err) {
          console.error(`Failed to send registration SMS to ${lead.phone}:`, err);
          await storage.updateAILead(lead.id, { smsStatus: 'failed' });
        }
        
        return res.sendStatus(200);
      }
      
      // Ignore intermediate statuses (initiated, ringing, in-progress, queued)
      return res.sendStatus(200);
      
    } catch (error) {
      console.error('Error in /api/ai/twilio/status:', error);
      return res.sendStatus(500);
    }
  });
  
  // POST /api/ai/sms/inbound
  app.post('/api/ai/sms/inbound', async (req, res) => {
    try {
      const twilioSignature = req.headers['x-twilio-signature'] as string;
      const url = `${BASE_URL}/api/ai/sms/inbound`;
      
      if (!twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN!,
        twilioSignature,
        url,
        req.body
      )) {
        console.error('Invalid Twilio signature');
        return res.status(403).send('Forbidden');
      }
      
      const from = req.body.From;
      const body = (req.body.Body || '').trim().toUpperCase();
      
      const lead = await storage.getAILeadByPhone(from);
      
      if (!lead) {
        console.log(`Inbound SMS from unknown number: ${from}`);
        return res.sendStatus(200);
      }
      
      if (body === 'STOP' || body === 'STOPALL' || body === 'UNSUBSCRIBE' || body === 'CANCEL' || body === 'END' || body === 'QUIT') {
        await storage.updateAILead(lead.id, {
          optedOut: true,
          optedOutAt: new Date().toISOString(),
        });
        
        console.log(`Lead ${lead.id} opted out via SMS`);
      }
      
      if (body === 'START' || body === 'YES' || body === 'UNSTOP') {
        await storage.updateAILead(lead.id, {
          optedOut: false,
          optedOutAt: null,
        });
        
        console.log(`Lead ${lead.id} opted back in via SMS`);
      }
      
      console.log(`Inbound SMS from ${from}: ${body}`);
      
      return res.sendStatus(200);
      
    } catch (error) {
      console.error('Error in /api/ai/sms/inbound:', error);
      return res.sendStatus(500);
    }
  });
  
  // ===================================================================
  // ADMIN ENDPOINTS
  // ===================================================================
  
  // GET /api/ai/leads
  app.get('/api/ai/leads', async (req, res) => {
    try {
      const leads = await storage.getAllAILeads();
      return res.json({
        success: true,
        leads: leads,
      });
    } catch (error) {
      console.error('Error in /api/ai/leads:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch leads',
      });
    }
  });
  
  // GET /api/ai/leads/download
  app.get('/api/ai/leads/download', async (req, res) => {
    try {
      const leads = await storage.getAllAILeads();
      
      // Generate CSV
      const headers = [
        'ID',
        'First Name',
        'Phone',
        'Email',
        'Consent Given',
        'Consent Timestamp',
        'Call Status',
        'Call SID',
        'Call Duration',
        'SMS Status',
        'SMS Outcome',
        'SMS SID',
        'SMS Sent At',
        'Payment Status',
        'Amount Paid',
        'Paid At',
        'Opted Out',
        'Opted Out At',
        'Created At',
        'Updated At',
      ];
      
      const rows = leads.map(lead => [
        lead.id,
        lead.firstName,
        lead.phone,
        lead.email || '',
        lead.consentGiven ? 'Yes' : 'No',
        lead.consentTimestamp,
        lead.callStatus,
        lead.callSid || '',
        lead.callDuration || '',
        lead.smsStatus,
        lead.smsOutcome || '',
        lead.smsSid || '',
        lead.smsSentAt || '',
        lead.paymentStatus,
        lead.amountPaid ? (lead.amountPaid / 100).toFixed(2) : '',
        lead.paidAt || '',
        lead.optedOut ? 'Yes' : 'No',
        lead.optedOutAt || '',
        lead.createdAt,
        lead.updatedAt,
      ]);
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ai-intensive-leads-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csv);
      
    } catch (error) {
      console.error('Error in /api/ai/leads/download:', error);
      return res.status(500).send('Failed to generate CSV');
    }
  });

  // GET /api/ai/admin/leads - Get all leads for admin dashboard
  app.get('/api/ai/admin/leads', async (req, res) => {  
    try {
      const leads = await storage.getAllAILeads();
      return res.json(leads);
    } catch (error) {
      console.error('Error in GET /api/ai/admin/leads:', error);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  // DELETE /api/ai/admin/leads/:id - Delete a lead
  app.delete('/api/ai/admin/leads/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAILead(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Error in DELETE /api/ai/admin/leads/:id:', error);
      return res.status(500).json({ error: 'Failed to delete lead' });
    }
  });

  // PATCH /api/ai/admin/leads/:id - Update a lead
  app.patch('/api/ai/admin/leads/:id', express.json(), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const lead = await storage.getAILeadById(id);
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      await storage.updateAILead(id, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Error in PATCH /api/ai/admin/leads/:id:', error);
      return res.status(500).json({ error: 'Failed to update lead' });
    }
  });

  // ===================================================================
  // CALENDAR API ENDPOINTS (for Jordan AI tools)
  // ===================================================================
  
  // POST /api/ai/tools/check-availability
  app.post('/api/ai/tools/check-availability', express.json(), async (req, res) => {
    try {
      const { inquiryType } = req.body;
      
      if (!inquiryType) {
        return res.status(400).json({
          success: false,
          error: 'inquiryType is required',
        });
      }
      
      // AI Intensive doesn't need booking
      if (inquiryType === 'ai-intensive') {
        return res.status(400).json({
          success: false,
          error: 'AI Intensive does not require booking',
        });
      }
      
      const slots = await calendarService.getAvailableSlots(inquiryType, 7);
      
      return res.status(200).json({
        success: true,
        availableSlots: slots,
      });
    } catch (error: any) {
      console.error('Error checking availability:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to check availability',
      });
    }
  });
  
  // POST /api/ai/tools/book-appointment
  app.post('/api/ai/tools/book-appointment', express.json(), async (req, res) => {
    try {
      const { inquiryType, startTime, clientName, clientEmail, clientPhone, message } = req.body;
      
      if (!inquiryType || !startTime || !clientName || !clientEmail || !clientPhone) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: inquiryType, startTime, clientName, clientEmail, clientPhone',
        });
      }
      
      // Normalize phone
      let normalizedPhone: string;
      try {
        normalizedPhone = normalizePhone(clientPhone);
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          error: `Invalid phone number: ${err.message}`,
        });
      }
      
      // Book appointment
      const result = await calendarService.bookAppointment({
        inquiryType,
        startTime,
        clientName,
        clientEmail,
        clientPhone: normalizedPhone,
        message,
      });
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      // Send confirmation SMS to client
      const startDate = new Date(startTime);
      const inquiryTypeDisplay = {
        'systems': 'Systems Implementation Call',
        'consulting': 'Strategic Consulting',
        'education': 'Education / Training Intro',
      }[inquiryType] || inquiryType;
      
      const dayName = startDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/Denver' });
      const dateStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'America/Denver' });
      const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver' });
      
      const clientSMS = `Confirmed. You're booked for ${inquiryTypeDisplay} on ${dayName}, ${dateStr} at ${timeStr} MT.\n\nIf you need to reschedule, reply CHANGE.\n\n403-613-6014\nIron-Oak.ca`;
      
      twilioClient.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: normalizedPhone,
          body: clientSMS,
        })
        .then(msg => {
          console.log(`Booking confirmation SMS sent to ${normalizedPhone}: ${msg.sid}`);
        })
        .catch(err => {
          console.error(`Failed to send confirmation SMS:`, err);
        });
      
      // Send internal SMS to owner
      const ownerPhone = '+14036136014';
      const internalSMS = `BOOKED \u2013 Iron & Oak\nName: ${clientName}\nType: ${inquiryTypeDisplay}\nDate: ${dateStr}\nTime: ${timeStr} MT\nPhone: ${normalizedPhone}\nEmail: ${clientEmail}`;
      
      twilioClient.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: ownerPhone,
          body: internalSMS,
        })
        .then(msg => {
          console.log(`Internal booking notification sent: ${msg.sid}`);
        })
        .catch(err => {
          console.error(`Failed to send internal booking notification:`, err);
        });
      
      // Update or create lead in database
      let lead = await storage.getAILeadByPhone(normalizedPhone);
      if (lead) {
        await storage.updateAILead(lead.id, {
          firstName: clientName,
          email: clientEmail,
          inquiryType: inquiryType,
          message: message || null,
          scheduledDate: startTime,
          scheduledNotes: `Booked via Jordan AI - Event ID: ${result.eventId}`,
        });
      } else {
        const leadId = uuidv4();
        await storage.saveAILead({
          id: leadId,
          firstName: clientName,
          phone: normalizedPhone,
          email: clientEmail,
          inquiryType: inquiryType,
          message: message || null,
          consentGiven: true,
          consentTimestamp: new Date().toISOString(),
          ipAddress: null,
          userAgent: null,
          callStatus: 'completed',
          callSid: null,
          callDuration: null,
          smsStatus: 'sent',
          smsOutcome: null,
          smsSid: null,
          smsSentAt: new Date().toISOString(),
          paymentStatus: 'pending',
          amountPaid: null,
          paidAt: null,
          optedOut: false,
          optedOutAt: null,
          scheduledDate: startTime,
          scheduledNotes: `Booked via Jordan AI - Event ID: ${result.eventId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      return res.status(200).json({
        success: true,
        eventId: result.eventId,
        eventLink: result.eventLink,
        confirmationSent: true,
      });
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to book appointment',
      });
    }
  });
  
  // POST /api/ai/tools/send-sms - Tool for Jordan AI to send SMS during calls
  app.post('/api/ai/tools/send-sms', express.json(), async (req, res) => {
    try {
      const { phone, firstName } = req.body;
      
      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          error: 'Phone number is required' 
        });
      }
      
      let normalizedPhone: string;
      try {
        normalizedPhone = normalizePhone(phone);
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          error: `Invalid phone number: ${err.message}`,
        });
      }
      
      const name = firstName || 'there';
      const paymentLink = 'https://buy.stripe.com/3cI8wPfvVh0tgTb7iSgnK02';
      const smsMessage = `Hi ${name}! Here's the info for Iron & Oak's AI Intensive:

💳 Register & Pay: ${paymentLink}

📅 Course: ${process.env.COURSE_DATES}
⏰ Time: ${process.env.COURSE_TIME}
📍 Location: ${process.env.COURSE_LOCATION}
💰 Price: $280 CAD (all 4 sessions)

Questions? Call/text: (403) 613-6014`;
      
      const message = await twilioClient.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: normalizedPhone,
        body: smsMessage,
      });
      
      console.log(`Jordan AI sent SMS to ${normalizedPhone}: ${message.sid}`);
      
      // Try to find/create lead
      let lead = await storage.getAILeadByPhone(normalizedPhone);
      if (!lead) {
        // Create new lead from AI interaction
        const leadId = uuidv4();
        lead = {
          id: leadId,
          firstName: name,
          phone: normalizedPhone,
          email: null,
          consentGiven: true, // Implied by requesting info
          consentTimestamp: new Date().toISOString(),
          ipAddress: null,
          userAgent: 'Jordan AI',
          callStatus: 'completed',
          callSid: null,
          callDuration: null,
          smsStatus: 'sent',
          smsOutcome: 'delivered',
          smsSid: message.sid,
          smsSentAt: new Date().toISOString(),
          paymentStatus: 'pending',
          amountPaid: null,
          paidAt: null,
          optedOut: false,
          optedOutAt: null,
          scheduledDate: null,
          scheduledNotes: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await storage.saveAILead(lead);
      } else {
        // Update existing lead
        await storage.updateAILead(lead.id, {
          smsStatus: 'sent',
          smsSid: message.sid,
          smsSentAt: new Date().toISOString(),
        });
      }
      
      return res.json({ 
        success: true,
        message: 'SMS sent successfully',
        sid: message.sid
      });
      
    } catch (error) {
      console.error('Error in /api/ai/tools/send-sms:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send SMS' 
      });
    }
  });
}
