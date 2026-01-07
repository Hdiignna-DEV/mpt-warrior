# 📧 Email Notification System Setup

## Overview

MPT Warrior uses **Gmail SMTP** to send automated email notifications to users for:
- ✅ User account approval
- 📝 Essay grading results
- 🎓 Module completion celebrations

---

## 🔧 Setup Instructions

### 1. **Enable 2-Step Verification on Gmail**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **2-Step Verification**
3. Follow the prompts to enable it

### 2. **Generate App Password**

1. Go to [Google Account](https://myaccount.google.com/)
2. Click **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **App passwords**
5. Select:
   - **App:** Mail
   - **Device:** Other (Custom name) → Type "MPT Warrior"
6. Click **Generate**
7. **Copy the 16-digit password** (spaces will be removed automatically)

### 3. **Add to Environment Variables**

#### Local Development (.env.local):
```env
GMAIL_USER=info.mptcommunity@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Your 16-digit app password
```

#### Vercel Production:
1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add:
   - `GMAIL_USER` = `info.mptcommunity@gmail.com`
   - `GMAIL_APP_PASSWORD` = `your_16_digit_password`
4. Select **Production, Preview, Development**
5. Click **Save**
6. **Redeploy** the project

---

## 📨 Email Templates

### 1. **Welcome Email** (User Approval)
- **Trigger:** Admin approves pending user
- **Sent to:** Newly approved user
- **Content:** Welcome message, feature overview, login link

### 2. **Essay Graded Email**
- **Trigger:** SUPER_ADMIN grades essay question
- **Sent to:** Student who submitted essay
- **Content:** Score, feedback, pass/fail status, next steps

### 3. **Module Completion Email**
- **Trigger:** User passes quiz (70%+)
- **Sent to:** User who completed module
- **Content:** Congratulations, progress bar, next module unlock info

---

## 🧪 Testing Emails

### Test Approval Email:
```bash
# Register a test account, then approve it from Admin HQ
# Check email inbox for welcome message
```

### Test Essay Graded Email:
```bash
# 1. Complete a module and submit quiz with essay question
# 2. Login as SUPER_ADMIN
# 3. Go to Admin HQ → Quiz Grading
# 4. Grade the essay
# 5. Check email for grading notification
```

### Test Module Completion Email:
```bash
# 1. Complete all lessons in Module 1
# 2. Take quiz and score 70%+
# 3. Check email for completion celebration
```

---

## 🔍 Troubleshooting

### Email Not Sending?

#### 1. **Check Environment Variables**
```bash
# Verify in Vercel Dashboard or .env.local
echo $GMAIL_USER
echo $GMAIL_APP_PASSWORD
```

#### 2. **Check App Password**
- Must be **16 digits** (no spaces)
- NOT your regular Gmail password
- Generated from Google Account > Security > App passwords

#### 3. **Check Gmail Settings**
- 2-Step Verification must be **enabled**
- "Less secure app access" is **NOT needed** (App Password is secure)

#### 4. **Check Logs**
```bash
# Vercel Dashboard → Your Project → Logs
# Look for:
✅ Email sent successfully
❌ Error sending email
⚠️ GMAIL_APP_PASSWORD not configured
```

### Common Errors:

#### Error: "Invalid login"
- **Solution:** Regenerate App Password and update environment variable

#### Error: "GMAIL_APP_PASSWORD not configured"
- **Solution:** Add environment variable and redeploy

#### Error: "Email sent but not received"
- **Solution:** Check spam folder, verify recipient email address

---

## 🎨 Customizing Email Templates

Email templates are in: `src/lib/email/resend-client.ts`

### Modify Template:
```typescript
// src/lib/email/resend-client.ts

export async function sendModuleCompletionEmail(...) {
  const mailOptions = {
    from: SENDER_EMAIL,
    to: to,
    subject: `🎓 Module Completed: ${moduleTitle}`,
    html: `
      <!-- Your custom HTML here -->
    `,
  };
  // ...
}
```

### Email Design Guidelines:
- Use **inline CSS** (external stylesheets not supported)
- Keep width **max 600px** for mobile compatibility
- Use **web-safe fonts** (Arial, Helvetica, Georgia)
- Test on multiple email clients (Gmail, Outlook, Apple Mail)

---

## 📊 Email Delivery Tracking

### Current Status:
- ✅ Sending via Gmail SMTP (reliable, free)
- ⏳ No tracking/analytics yet (Phase 2)
- ⏳ No bounce handling yet (Phase 2)

### Future Enhancements:
- Add **Resend** or **SendGrid** for better deliverability
- Track **open rates** and **click rates**
- Handle **bounces** and **unsubscribes**
- Add **email templates** with visual builder

---

## 🔐 Security Best Practices

### ✅ DO:
- Use **App Password**, not regular password
- Store passwords in **environment variables**, never commit to Git
- Enable **2-Step Verification** on Gmail account
- Use **dedicated email** for app (not personal email)

### ❌ DON'T:
- Hardcode passwords in code
- Share App Password publicly
- Commit `.env.local` to Git
- Use personal Gmail for production

---

## 📞 Support

If emails still not working after following this guide:
1. Check [Gmail SMTP Setup Guide](EMAIL_SETUP.md)
2. Verify [Environment Variables](SETUP_GUIDE.md#environment-variables)
3. Contact admin: hadigunadeden@gmail.com

---

**Last Updated:** January 7, 2026  
**Version:** 1.0.0
