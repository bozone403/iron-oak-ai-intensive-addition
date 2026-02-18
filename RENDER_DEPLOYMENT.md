# AI Intensive - Render.com + Hostinger Deployment Guide

**Status:** Production-ready for split deployment  
**Last Updated:** February 18, 2026

---

## Overview

This guide covers deploying the AI Intensive funnel with:

- **Backend:** Render.com (Node.js web service with persistent disk)
- **Frontend:** Hostinger (static files uploaded to public folder)

---

## Architecture

```
User → iron-oak.ca/ai (Hostinger static)
       ↓
       Calls API: iron-oak-ai-backend.onrender.com
       ↓
Twilio/Stripe webhooks → iron-oak-ai-backend.onrender.com
```

---

## Part 1: Deploy Backend to Render.com

### Step 1.1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Get Started**
3. Sign up with GitHub (recommended) or email
4. **Add payment method:** Credit/debit card (not gift cards)
   - Note: Free tier is $0/month, but persistent disk costs ~$0.25/month (~$3/year)

### Step 1.2: Connect GitHub Repository

1. Push your `iron-oak-ai-intensive` code to GitHub:

```bash
cd /path/to/iron-oak-ai-intensive
git init
git add .
git commit -m "AI Intensive V1 - Production Ready"
git remote add origin https://github.com/YOUR_USERNAME/iron-oak-ai-intensive.git
git push -u origin main
```

2. In Render dashboard, click **New +** → **Web Service**
3. Click **Connect GitHub** and authorize Render
4. Select `iron-oak-ai-intensive` repository

### Step 1.3: Configure Web Service

**Basic Settings:**
- **Name:** `iron-oak-ai-backend`
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** (leave blank)
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Plan:**
- Select **Free** (spins down after 15 min inactivity, wakes up on request)

Click **Create Web Service** (don't deploy yet, we need to add env vars)

### Step 1.4: Add Persistent Disk

1. In your web service dashboard, go to **Disks** tab
2. Click **Add Disk**
3. Configure:
   - **Name:** `ai-intensive-data`
   - **Mount Path:** `/app/data`
   - **Size:** 1 GB
4. Click **Create**

**Cost:** ~$0.25/month ($3/year)

### Step 1.5: Set Environment Variables

Go to **Environment** tab and add these variables:

```bash
NODE_ENV=production
PORT=5000

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+14035551234

# ElevenLabs
ELEVENLABS_AGENT_ID=your_agent_id_here
ELEVENLABS_API_KEY=your_api_key_here

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxxxxx

# Course Details
COURSE_DATES=Last Thursday-Sunday of every month
COURSE_TIME=7:00 PM - 8:15 PM
COURSE_LOCATION=Airdrie, AB
COURSE_CONTACT_EMAIL=Registration@iron-oak.ca
COURSE_CONTACT_PHONE=403-613-6014

# Base URL (CRITICAL for Twilio signature verification)
BASE_URL=https://iron-oak-ai-backend.onrender.com
```

**Important:** Replace `iron-oak-ai-backend` with your actual Render service name if different.

### Step 1.6: Deploy

1. Click **Manual Deploy** → **Deploy latest commit**
2. Wait for build to complete (~2-3 minutes)
3. Once deployed, your backend will be available at:
   ```
   https://iron-oak-ai-backend.onrender.com
   ```

### Step 1.7: Test Backend

```bash
curl https://iron-oak-ai-backend.onrender.com/api/ai/submit
```

Expected response:
```json
{"success":false,"error":"Missing required fields or consent not given"}
```

✅ Backend is live!

---

## Part 2: Configure Webhooks

### Step 2.1: Twilio Configuration

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Phone Numbers** → **Manage** → **Active numbers**
3. Click on your phone number

**Voice Configuration:**
- **A CALL COMES IN:** Webhook
- **URL:** `https://iron-oak-ai-backend.onrender.com/api/ai/twilio/voice`
- **HTTP:** POST

**Call Status Changes:**
- **URL:** `https://iron-oak-ai-backend.onrender.com/api/ai/twilio/status`
- **HTTP:** POST

**Messaging Configuration:**
- **A MESSAGE COMES IN:** Webhook
- **URL:** `https://iron-oak-ai-backend.onrender.com/api/ai/sms/inbound`
- **HTTP:** POST

Click **Save**

### Step 2.2: Stripe Configuration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **+ Add endpoint**
4. **Endpoint URL:** `https://iron-oak-ai-backend.onrender.com/api/ai/stripe/webhook`
5. **Events to send:**
   - `checkout.session.completed`
   - `checkout.session.expired` (optional)
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Update `STRIPE_WEBHOOK_SECRET` in Render environment variables

### Step 2.3: ElevenLabs Agent Configuration

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Select your agent (or create new one named "AI Intensive Titan")
3. Configure:

**Voice Section:**
- **TTS Output Format:** μ-law 8000 Hz

**Advanced Section:**
- **Input Format:** μ-law 8000 Hz

**System Prompt:**
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

**Dynamic Variables:**
- Add: `firstName`, `courseDates`, `courseTime`, `courseLocation`

4. Copy the **Agent ID** and update `ELEVENLABS_AGENT_ID` in Render

---

## Part 3: Build and Deploy Frontend to Hostinger

### Step 3.1: Update Frontend API URL

1. Edit `.env.production`:

```bash
VITE_API_URL=https://iron-oak-ai-backend.onrender.com
```

Replace with your actual Render backend URL.

### Step 3.2: Build Frontend

```bash
cd /path/to/iron-oak-ai-intensive
npm run build
```

This creates a `dist/public` folder with static files.

### Step 3.3: Upload to Hostinger

**Method 1: File Manager (Recommended)**

1. Log in to Hostinger
2. Go to **Websites** → Select `iron-oak.ca`
3. Click **File Manager**
4. Navigate to `public_html` folder
5. Create a new folder: `ai`
6. Upload all files from `dist/public` to `public_html/ai/`
   - Upload `index.html`
   - Upload `assets/` folder (contains JS, CSS)
   - Upload any other files in `dist/public`

**Method 2: FTP**

1. Get FTP credentials from Hostinger dashboard
2. Use FileZilla or similar FTP client
3. Connect to your Hostinger FTP
4. Navigate to `public_html`
5. Create `ai` folder
6. Upload `dist/public/*` to `public_html/ai/`

### Step 3.4: Test Frontend

Visit: `https://iron-oak.ca/ai`

You should see the AI Intensive landing page.

### Step 3.5: Test Form Submission

1. Fill in the form with your phone number
2. Check consent checkbox
3. Click "Get a Call Now"
4. You should receive a call within 10 seconds

---

## Part 4: Custom Domain (Optional)

If you want to use `api.iron-oak.ca` instead of `iron-oak-ai-backend.onrender.com`:

### Step 4.1: Add Custom Domain in Render

1. In Render service dashboard, go to **Settings**
2. Scroll to **Custom Domains**
3. Click **+ Add Custom Domain**
4. Enter: `api.iron-oak.ca`
5. Render will provide a CNAME target

### Step 4.2: Configure DNS in Hostinger

1. Log in to Hostinger
2. Go to **Domains** → `iron-oak.ca` → **DNS Records**
3. Click **Add Record**
4. Add CNAME:
   ```
   Type: CNAME
   Name: api
   Points to: iron-oak-ai-backend.onrender.com
   TTL: 3600
   ```
5. Save and wait for DNS propagation (5-30 minutes)

### Step 4.3: Update Environment Variables

Update in Render:

```bash
BASE_URL=https://api.iron-oak.ca
```

Update in `.env.production`:

```bash
VITE_API_URL=https://api.iron-oak.ca
```

Rebuild frontend and re-upload to Hostinger.

Update all Twilio and Stripe webhook URLs to use `https://api.iron-oak.ca`.

---

## Part 5: Testing

### End-to-End Test

1. **QR Code Test:**
   - Generate QR code: `https://iron-oak.ca/ai`
   - Scan with phone
   - Should load landing page

2. **Form Submission:**
   - Fill form with your phone
   - Check consent
   - Submit
   - Should see success message

3. **Call Test:**
   - Should receive call within 10 seconds
   - ElevenLabs agent greets you by name
   - Conversation about course
   - Hang up after 20+ seconds

4. **SMS Test:**
   - Should receive SMS with Stripe payment link
   - Within 30 seconds after call ends

5. **Payment Test:**
   - Click SMS link
   - Complete Stripe checkout
   - Should receive confirmation SMS

6. **STOP Test:**
   - Reply "STOP" to SMS
   - Should be opted out

### Check Logs

**Render Logs:**
- In Render dashboard, go to **Logs** tab
- Monitor real-time logs for errors

**Twilio Logs:**
- [console.twilio.com/us1/monitor/logs/calls](https://console.twilio.com/us1/monitor/logs/calls)
- [console.twilio.com/us1/monitor/logs/sms](https://console.twilio.com/us1/monitor/logs/sms)

**Stripe Logs:**
- [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

---

## Troubleshooting

### Backend Not Waking Up

**Issue:** Render free tier spins down after 15 min inactivity. First request takes ~30 seconds to wake up.

**Solution:**
- This is expected behavior on free tier
- Upgrade to paid plan ($7/month) for always-on service
- Or accept 30-second delay on first call after inactivity

### CORS Errors

**Issue:** Frontend can't call backend API.

**Solution:**
- Check `VITE_API_URL` in `.env.production`
- Rebuild frontend: `npm run build`
- Re-upload to Hostinger
- Verify CORS origins in `ai-intensive-routes.ts` include `https://iron-oak.ca`

### Twilio Signature Verification Fails

**Issue:** Twilio webhooks return 403 Forbidden.

**Solution:**
- Verify `BASE_URL` in Render matches webhook URLs in Twilio console
- If using custom domain, ensure DNS is propagated
- Check Render logs for exact error

### Stripe Webhook Fails

**Issue:** Payment confirmation SMS not sent.

**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Test webhook in Stripe dashboard
- Check Render logs for signature verification errors

### SMS Not Sent

**Issue:** No SMS after call completes.

**Solution:**
- Check call duration >= 20 seconds
- Verify `consentGiven = true` in database
- Check Render logs for SMS sending errors
- Verify Twilio credentials

### Database File Not Found

**Issue:** Render logs show "ENOENT: no such file or directory".

**Solution:**
- Verify persistent disk is mounted at `/app/data`
- Check Render **Disks** tab
- Storage creates files automatically on first write

---

## Monitoring

### Render Dashboard

- **Metrics:** CPU, memory, response time
- **Logs:** Real-time application logs
- **Events:** Deployments, restarts

### Disk Usage

Check in Render **Disks** tab. Each lead is ~500 bytes, so 1GB supports ~2 million leads.

### Uptime

Free tier has no uptime guarantee. For production, consider upgrading to paid plan ($7/month) with 99.9% uptime SLA.

---

## Costs

**Render:**
- Web Service (Free): $0/month
- Persistent Disk (1GB): ~$0.25/month

**Hostinger:**
- Already paid for

**Twilio:**
- Calls: ~$0.013/min
- SMS: ~$0.0075/message

**ElevenLabs:**
- Pay-as-you-go per minute

**Stripe:**
- 2.9% + $0.30 per transaction

**Total Monthly Cost (excluding usage):** ~$0.25/month

---

## Scaling to Paid Plan

When you're ready for production scale:

**Render Professional ($7/month per user):**
- Always-on (no spin down)
- 500 GB bandwidth included
- Faster builds
- Chat support

**Benefits:**
- No 30-second wake-up delay
- Better reliability
- Faster webhook responses

---

## Support

**Questions?**
- Email: Registration@iron-oak.ca
- Phone: 403-613-6014

**Technical Issues?**
- Check Render logs
- Review this deployment guide
- Test each integration independently

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Configure webhooks (Twilio, Stripe, ElevenLabs)
3. ✅ Build and upload frontend to Hostinger
4. ✅ Test end-to-end
5. ✅ Generate QR code
6. ✅ Go live!

---

**Deployment Status:** Ready to deploy  
**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate

**Let's ship this! 🚀**
