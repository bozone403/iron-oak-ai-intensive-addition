# AI Intensive - Deployment Guide

**Status:** Production-ready with all critical bugs fixed  
**Last Updated:** February 18, 2026

---

## Overview

This deployment guide covers the complete setup for the Iron & Oak AI Intensive registration funnel, including:

- ✅ QR code → Landing page → Automated call → SMS → Payment → Confirmation
- ✅ Twilio voice integration with ElevenLabs Conversational AI
- ✅ Stripe payment webhooks
- ✅ SMS consent management and STOP handling
- ✅ Production-safe atomic SMS transitions
- ✅ Fallback lead lookup for race conditions

---

## Architecture

**Frontend:** React + TypeScript + TailwindCSS (served from `/ai` route)  
**Backend:** Node.js + Express + TypeScript  
**Storage:** JSON files with atomic write safety + file locking  
**Hosting:** Railway (backend) + Hostinger (static frontend via custom domain)  
**Integrations:** Twilio, ElevenLabs, Stripe

---

## Prerequisites

1. **Railway Account** (free tier sufficient)
2. **Hostinger Domain** (`iron-oak.ca`)
3. **Twilio Account** with phone number
4. **ElevenLabs Account** with Conversational AI agent
5. **Stripe Account** with payment link

---

## Step 1: Railway Deployment

### 1.1 Create New Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Connect your GitHub account and select the `iron-oak-ai-intensive` repository
4. Railway will auto-detect Node.js and deploy

### 1.2 Add Volume for Data Persistence

1. In your Railway project, click **+ New** → **Volume**
2. Set mount path: `/app/data`
3. Set size: `1GB`
4. Railway will auto-provide `RAILWAY_VOLUME_MOUNT_PATH=/app/data` env var

### 1.3 Set Environment Variables

Go to **Variables** tab and add:

```bash
NODE_ENV=production
PORT=5000

# Twilio (from your Twilio console)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+14035551234

# ElevenLabs (from your ElevenLabs dashboard)
ELEVENLABS_AGENT_ID=your_agent_id_here
ELEVENLABS_API_KEY=your_api_key_here

# Stripe (from your Stripe dashboard)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxxxxx

# Course Details
COURSE_DATES=Last Thursday-Sunday of every month
COURSE_TIME=7:00 PM - 8:15 PM
COURSE_LOCATION=123 Main St, Airdrie, AB
COURSE_CONTACT_EMAIL=Registration@iron-oak.ca
COURSE_CONTACT_PHONE=403-613-6014
```

### 1.4 Get Railway Domain

After deployment, Railway will provide a domain like:

```
https://iron-oak-ai-intensive-production.up.railway.app
```

**Copy this domain** - you'll need it for DNS configuration.

---

## Step 2: Custom Domain Setup

### 2.1 Add Custom Domain in Railway

1. In Railway project, go to **Settings** → **Domains**
2. Click **+ Custom Domain**
3. Enter: `api.iron-oak.ca`
4. Railway will provide a CNAME target

### 2.2 Configure DNS in Hostinger

1. Log in to Hostinger
2. Go to **Domains** → `iron-oak.ca` → **DNS Records**
3. Click **Add Record**
4. Add CNAME record:

```
Type: CNAME
Name: api
Points to: iron-oak-ai-intensive-production.up.railway.app
TTL: 3600
```

5. Save and wait for DNS propagation (5-30 minutes)

### 2.3 Verify Custom Domain

Test that `https://api.iron-oak.ca` resolves to your Railway app:

```bash
curl https://api.iron-oak.ca/api/ai/submit
```

Expected response: `{"success":false,"error":"Missing required fields or consent not given"}`

---

## Step 3: Twilio Configuration

### 3.1 Configure Voice Webhook

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Phone Numbers** → **Manage** → **Active numbers**
3. Click on your phone number
4. Under **Voice Configuration**:
   - **A CALL COMES IN**: Webhook
   - **URL**: `https://api.iron-oak.ca/api/ai/twilio/voice`
   - **HTTP**: POST
5. Click **Save**

### 3.2 Configure Status Callback

In the same phone number configuration:

1. Scroll to **Call Status Changes**
2. **URL**: `https://api.iron-oak.ca/api/ai/twilio/status`
3. **HTTP**: POST
4. Click **Save**

### 3.3 Configure SMS Webhook

1. Under **Messaging Configuration**:
   - **A MESSAGE COMES IN**: Webhook
   - **URL**: `https://api.iron-oak.ca/api/ai/sms/inbound`
   - **HTTP**: POST
2. Click **Save**

---

## Step 4: ElevenLabs Agent Configuration

### 4.1 Create Agent

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Click **Create Agent**
3. Name: `AI Intensive Titan`

### 4.2 Configure Agent Settings

**Voice Section:**
- TTS Output Format: **μ-law 8000 Hz** (critical for Twilio compatibility)

**Advanced Section:**
- Input Format: **μ-law 8000 Hz**

### 4.3 Set System Prompt

```
You are Titan, an AI assistant for Iron & Oak's AI Intensive course.

Your role:
- Greet {{firstName}} warmly
- Explain the AI Intensive course (4 evenings, {{courseDates}}, {{courseTime}}, {{courseLocation}})
- Answer questions about the course content, schedule, and pricing
- Confirm their interest in registering
- Let them know they'll receive an SMS with a registration link after the call

Course details:
- 4 evening sessions covering AI fundamentals, automation, advanced topics, and implementation
- Hands-on, practical approach
- Small group (max 10 students)
- Bring your laptop

Keep the conversation natural, friendly, and concise. If they're ready to register, confirm and end the call.
```

### 4.4 Add Dynamic Variables

In the agent configuration, add these dynamic variables:

- `firstName`
- `courseDates`
- `courseTime`
- `courseLocation`

### 4.5 Get Agent ID

Copy the **Agent ID** from the agent settings and add it to Railway environment variables.

---

## Step 5: Stripe Configuration

### 5.1 Create Payment Link

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **+ Add product**
3. Create product:
   - Name: `AI Intensive Course`
   - Price: `$XXX CAD` (your course price)
4. Click **Create product**
5. Click **Create payment link**
6. Copy the payment link URL and add to Railway env vars

### 5.2 Configure Webhook

1. Go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://api.iron-oak.ca/api/ai/stripe/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `checkout.session.expired` (optional)
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Railway env vars as `STRIPE_WEBHOOK_SECRET`

### 5.3 Test Webhook

1. In Stripe webhook settings, click **Send test webhook**
2. Select event: `checkout.session.completed`
3. Click **Send test webhook**
4. Check Railway logs for successful processing

---

## Step 6: Frontend Deployment

### 6.1 Build Frontend

The frontend is already integrated into the Railway deployment. When you push to GitHub, Railway will:

1. Run `npm run build` (which builds both frontend and backend)
2. Serve static files from `dist/public`
3. Serve API from `dist/index.js`

### 6.2 Access Landing Page

The AI Intensive landing page is available at:

```
https://iron-oak.ca/ai
```

(Served from Railway via the existing IronOakSite deployment)

---

## Step 7: Testing

### 7.1 End-to-End Test

1. **QR Code Test**:
   - Generate QR code pointing to `https://iron-oak.ca/ai`
   - Scan with phone
   - Should load landing page

2. **Form Submission Test**:
   - Fill in first name, phone, email
   - Check consent checkbox
   - Click "Get a Call Now"
   - Should see success message

3. **Call Test**:
   - Should receive call within 10 seconds
   - ElevenLabs agent should greet you by name
   - Have a conversation about the course
   - Hang up after 20+ seconds

4. **SMS Test**:
   - Should receive SMS with registration link within 30 seconds
   - Link should be Stripe payment link

5. **Payment Test**:
   - Click SMS link
   - Complete Stripe checkout (use test card in test mode)
   - Should receive confirmation SMS with course details

6. **STOP Test**:
   - Reply "STOP" to any SMS
   - Should be opted out (check `/app/data/ai-intensive-leads.json` on Railway)

### 7.2 Check Logs

Monitor Railway logs for any errors:

```bash
# In Railway dashboard, go to Deployments → View logs
```

Look for:
- `Call initiated: <CallSid> for lead <leadId>`
- `TwiML for CallSid <CallSid>: <xml>`
- `Registration SMS sent to <phone>: <MessageSid>`
- `Payment confirmed for lead <leadId>: $XXX`

---

## Step 8: Production Checklist

Before going live:

- [ ] All environment variables set in Railway
- [ ] Railway volume mounted to `/app/data`
- [ ] Custom domain `api.iron-oak.ca` resolves correctly
- [ ] Twilio voice webhook configured
- [ ] Twilio status callback configured
- [ ] Twilio SMS webhook configured
- [ ] ElevenLabs agent configured with μ-law 8000 Hz
- [ ] ElevenLabs agent system prompt set with dynamic variables
- [ ] Stripe payment link created
- [ ] Stripe webhook configured and tested
- [ ] End-to-end test completed successfully
- [ ] QR code generated and tested
- [ ] Consent wording reviewed and approved
- [ ] SMS copy reviewed and approved
- [ ] Course details confirmed (dates, time, location)

---

## Troubleshooting

### Call Not Received

**Check:**
1. Railway logs for call initiation
2. Twilio console → Monitor → Logs → Calls
3. Phone number is in E.164 format (+1XXXXXXXXXX)
4. Twilio voice webhook URL is correct

### SMS Not Received

**Check:**
1. Railway logs for SMS sending
2. Call duration >= 20 seconds
3. `consentGiven = true` in database
4. `optedOut = false` in database
5. Twilio console → Monitor → Logs → Messages

### ElevenLabs Call Fails

**Check:**
1. Agent ID is correct
2. API key is correct
3. Agent audio format is μ-law 8000 Hz (both input and output)
4. Railway logs for TwiML response

### Stripe Webhook Fails

**Check:**
1. Webhook URL is `https://api.iron-oak.ca/api/ai/stripe/webhook`
2. Webhook secret is correct
3. Stripe webhook signature verification passes
4. Railway logs for webhook processing

### Double SMS Sends

**Should not happen** - atomic `trySetSmsSending()` prevents this.

**If it does:**
1. Check Railway logs for concurrent webhook callbacks
2. Verify file lock is working
3. Check `smsStatus` transitions in database

---

## Monitoring

### Railway Logs

Monitor in real-time:

```bash
# In Railway dashboard: Deployments → View logs
```

### Twilio Logs

Monitor calls and SMS:

```
https://console.twilio.com/us1/monitor/logs/calls
https://console.twilio.com/us1/monitor/logs/sms
```

### Stripe Logs

Monitor webhooks:

```
https://dashboard.stripe.com/webhooks
```

### Database

View leads:

```bash
# SSH into Railway (if available) or use Railway CLI
cat /app/data/ai-intensive-leads.json | jq .
```

---

## Scaling

### Current Limits (Free Tier)

- Railway: 500 hours/month, 1GB volume
- Twilio: Pay-as-you-go
- ElevenLabs: Pay-as-you-go
- Stripe: No limits

### When to Upgrade

- **Railway**: If you exceed 500 hours/month (unlikely for V1)
- **Storage**: If JSON file exceeds 10MB, migrate to SQLite
- **Database**: For V2, migrate to PostgreSQL when you need:
  - Complex queries
  - Reporting/analytics
  - Multi-user admin dashboard

---

## Support

**Questions?**

- Email: Registration@iron-oak.ca
- Phone: 403-613-6014

**Technical Issues?**

- Check Railway logs first
- Review this deployment guide
- Test each integration independently

---

## Changelog

**2026-02-18:** Initial production-ready deployment
- All critical bugs fixed
- Atomic SMS transitions implemented
- Fallback lead lookup added
- Voice webhook outbound call fix applied

---

**Deployed by Manus**  
**For Iron & Oak AI Intensive V1**
