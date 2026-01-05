/**
 * Email Client
 * Supports Gmail SMTP and Resend
 */

import nodemailer from 'nodemailer';

// Gmail SMTP Configuration
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'info.mptcommunity@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD, // App Password, bukan password biasa
  },
});

export const SENDER_EMAIL = 'MPT Community <info.mptcommunity@gmail.com>';

/**
 * Send approval notification email
 */
export async function sendApprovalEmail(
  to: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn('⚠️ GMAIL_APP_PASSWORD not configured - email not sent');
      return { 
        success: false, 
        error: 'GMAIL_APP_PASSWORD not configured. Please add Gmail App Password to Vercel environment variables.' 
      };
    }

    console.log(`📧 Sending approval email to: ${to}`);

    // Send email via Gmail SMTP
    const mailOptions = {
      from: SENDER_EMAIL,
      to: to,
      subject: '🎉 Your MPT Warrior Account Has Been Approved!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .button { display: inline-block; background: #f59e0b; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .emoji { font-size: 48px; margin-bottom: 10px; }
  </style>
</head>
<body style="background-color: #f3f4f6; padding: 20px;">
  <div class="container">
    <div class="header">
      <div class="emoji">🎖️</div>
      <h1>Welcome to MPT Warrior!</h1>
    </div>
    <div class="content">
      <h2 style="color: #111827;">Hi ${userName},</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Selamat! Akun Anda telah <strong>disetujui</strong> oleh Admin MPT Community. 
        Anda sekarang memiliki akses penuh ke semua fitur platform.
      </p>
      
      <h3 style="color: #f59e0b;">✨ Apa yang bisa Anda lakukan sekarang?</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li>📊 <strong>Dashboard</strong>: Pantau performa trading real-time</li>
        <li>📝 <strong>Trading Journal</strong>: Catat semua transaksi Anda</li>
        <li>🧠 <strong>AI Mentor</strong>: Dapatkan analisis trading dengan AI</li>
        <li>📈 <strong>Analytics</strong>: Lihat statistik mendalam</li>
        <li>🎯 <strong>The MPT Way</strong>: Akses strategi eksklusif</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://mpt-community.vercel.app/login" class="button">
          🚀 Login Sekarang
        </a>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;">
          <strong>💡 Tips:</strong> Mulai dengan mencatat 5-10 trade pertama di Journal, 
          lalu gunakan AI Analyze untuk mendapat insight!
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px;">
        Jika ada pertanyaan, hubungi admin atau komunitas di grup WhatsApp.
      </p>

      <p style="color: #374151; margin-top: 30px;">
        Happy Trading! 🎯<br>
        <strong>Team MPT Warrior</strong>
      </p>
    </div>
    <div class="footer">
      <p>© 2026 MPT Community. All rights reserved.</p>
      <p style="color: #9ca3af;">
        "Focus on the Plan, Not the Panic."
      </p>
    </div>
  </div>
</body>
</html>
      `,
    };

    const info = await gmailTransporter.sendMail(mailOptions);
    
    console.log('✅ Approval email sent successfully to:', to);
    console.log('Message ID:', info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending approval email:', error);
    return { success: false, error: error.message };
  }
}
