# AI Intensive - Quick Start Deployment Checklist

**Goal:** Get your AI Intensive funnel live in 45 minutes

---

## Prerequisites Checklist

- [ ] Render.com account created
- [ ] GitHub repository created
- [ ] Twilio account with phone number
- [ ] ElevenLabs agent created and configured (μ-law 8000 Hz)
- [ ] Stripe payment link created
- [ ] Hostinger access to `iron-oak.ca`

---

## Part 1: Backend Deployment (15 min)

### 1. Push Code to GitHub

```bash
cd /path/to/iron-oak-ai-intensive
git init
git add .
git commit -m "AI Intensive V1"
git remote add origin https://github.com/YOUR_USERNAME/iron-oak-ai-intensive.git
git push -u origin main
```

- [ ] Code pushed to GitHub

### 2. Deploy to Render

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect GitHub repo: `iron-oak-ai-intensive`
3. Configure:
   - Name: `iron-oak-ai-backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Plan: **Free**
4. Add Disk:
   - Name: `ai-intensive-data`
   - Mount: `/app/data`
   - Size: 1 GB
5. Add Environment Variables (see `.env.example`)
6. Deploy

- [ ] Backend deployed to Render
- [ ] Backend URL: `https://iron-oak-ai-backend.onrender.com`

### 3. Test Backend

```bash
curl https://iron-oak-ai-backend.onrender.com/api/ai/submit
```

Expected: `{"success":false,"error":"Missing required fields..."}`

- [ ] Backend responding correctly

---

## Part 2: Configure Webhooks (10 min)

### Twilio

1. Go to [console.twilio.com](https://console.twilio.com)
2. Phone Numbers → Your number
3. Set webhooks:
   - Voice: `https://iron-oak-ai-backend.onrender.com/api/ai/twilio/voice`
   - Status: `https://iron-oak-ai-backend.onrender.com/api/ai/twilio/status`
   - SMS: `https://iron-oak-ai-backend.onrender.com/api/ai/sms/inbound`

- [ ] Twilio webhooks configured

### Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Developers → Webhooks → Add endpoint
3. URL: `https://iron-oak-ai-backend.onrender.com/api/ai/stripe/webhook`
4. Events: `checkout.session.completed`
5. Copy webhook secret → Update Render env var

- [ ] Stripe webhook configured

### ElevenLabs

1. Go to [elevenlabs.io](https://elevenlabs.io/app/conversational-ai)
2. Select agent
3. Verify:
   - Audio format: μ-law 8000 Hz (input and output)
   - System prompt set with dynamic variables
4. Copy Agent ID → Update Render env var

- [ ] ElevenLabs agent configured

---

## Part 3: Frontend Deployment (10 min)

### 1. Update API URL

Edit `.env.production`:

```bash
VITE_API_URL=https://iron-oak-ai-backend.onrender.com
```

- [ ] API URL updated

### 2. Build Frontend

```bash
npm run build
```

- [ ] Frontend built (check `dist/public/` folder)

### 3. Upload to Hostinger

1. Log in to Hostinger
2. Websites → `iron-oak.ca` → File Manager
3. Navigate to `public_html`
4. Create folder: `ai`
5. Upload all files from `dist/public/` to `public_html/ai/`

- [ ] Frontend uploaded to Hostinger

### 4. Test Frontend

Visit: `https://iron-oak.ca/ai`

- [ ] Landing page loads correctly

---

## Part 4: End-to-End Test (10 min)

### Test Flow

1. Visit `https://iron-oak.ca/ai`
2. Fill form with YOUR phone number
3. Check consent checkbox
4. Click "Get a Call Now"
5. Wait for call (10-30 seconds if backend was asleep)
6. Talk to ElevenLabs agent for 20+ seconds
7. Hang up
8. Wait for SMS with payment link (30 seconds)
9. Click link and complete payment (use test mode)
10. Wait for confirmation SMS

### Checklist

- [ ] Form submission works
- [ ] Call received from Twilio
- [ ] ElevenLabs agent greets by name
- [ ] SMS received with payment link
- [ ] Payment link works
- [ ] Confirmation SMS received after payment

---

## Part 5: Generate QR Code

### Option 1: Online Generator

1. Go to [qr-code-generator.com](https://www.qr-code-generator.com/)
2. Enter URL: `https://iron-oak.ca/ai`
3. Download QR code
4. Print and display

### Option 2: Command Line

```bash
npm install -g qrcode
qrcode https://iron-oak.ca/ai -o ai-intensive-qr.png
```

- [ ] QR code generated
- [ ] QR code tested (scans to correct URL)

---

## Troubleshooting

### Backend Takes 30 Seconds to Respond

**Cause:** Render free tier spins down after 15 min inactivity.

**Solution:** First request wakes it up (30 sec delay). Subsequent requests are instant. Upgrade to paid plan ($7/month) for always-on.

### CORS Error in Browser Console

**Cause:** Frontend can't call backend API.

**Solution:**
1. Check `.env.production` has correct `VITE_API_URL`
2. Rebuild: `npm run build`
3. Re-upload to Hostinger

### Twilio Webhook Returns 403

**Cause:** Signature verification failed.

**Solution:**
1. Check `BASE_URL` in Render env vars matches webhook URLs
2. Ensure it's `https://iron-oak-ai-backend.onrender.com` (no trailing slash)

### No SMS Received

**Cause:** Call too short or consent not given.

**Solution:**
1. Stay on call for 20+ seconds
2. Check Render logs for SMS sending
3. Verify Twilio credentials in Render env vars

---

## Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Twilio webhooks configured
- [ ] Stripe webhook configured
- [ ] ElevenLabs agent tested
- [ ] QR code generated and tested
- [ ] Render logs monitored (no errors)
- [ ] Consent wording approved
- [ ] SMS copy approved
- [ ] Course details confirmed
- [ ] Payment amount confirmed

---

## You're Live! 🎉

**What to monitor:**

1. **Render Logs:** Check for errors
2. **Twilio Console:** Monitor calls and SMS
3. **Stripe Dashboard:** Monitor payments
4. **Database:** Check `/app/data/ai-intensive-leads.json` in Render

**Support:**
- Email: Registration@iron-oak.ca
- Phone: 403-613-6014

---

**Deployment Time:** 45 minutes  
**Monthly Cost:** ~$0.25 (Render disk) + usage (Twilio, ElevenLabs, Stripe)

**You did it! 🚀**
