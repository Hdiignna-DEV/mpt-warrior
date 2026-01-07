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

/**
 * Send essay graded notification email
 */
export async function sendEssayGradedEmail(
  to: string,
  userName: string,
  moduleTitle: string,
  score: number,
  maxScore: number,
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn('⚠️ GMAIL_APP_PASSWORD not configured - email not sent');
      return { 
        success: false, 
        error: 'GMAIL_APP_PASSWORD not configured' 
      };
    }

    console.log(`📧 Sending essay graded email to: ${to}`);

    const percentage = Math.round((score / maxScore) * 100);
    const isPassed = percentage >= 70;
    const statusEmoji = isPassed ? '✅' : '⚠️';
    const statusText = isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT';
    const statusColor = isPassed ? '#10b981' : '#f59e0b';

    const mailOptions = {
      from: SENDER_EMAIL,
      to: to,
      subject: `${statusEmoji} Your Essay Has Been Graded - ${moduleTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .button { display: inline-block; background: #6366f1; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .score-card { background: #f9fafb; border: 2px solid ${statusColor}; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
    .score-number { font-size: 48px; font-weight: bold; color: ${statusColor}; margin: 10px 0; }
    .feedback-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .emoji { font-size: 48px; margin-bottom: 10px; }
  </style>
</head>
<body style="background-color: #f3f4f6; padding: 20px;">
  <div class="container">
    <div class="header">
      <div class="emoji">📝</div>
      <h1>Essay Graded</h1>
    </div>
    <div class="content">
      <h2 style="color: #111827;">Hi ${userName},</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Essay Anda untuk <strong>${moduleTitle}</strong> telah dinilai oleh instructor.
      </p>
      
      <div class="score-card">
        <p style="color: #6b7280; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Score</p>
        <div class="score-number">${score}/${maxScore}</div>
        <p style="color: ${statusColor}; font-weight: bold; margin: 5px 0; font-size: 18px;">${statusText} (${percentage}%)</p>
      </div>

      ${feedback ? `
      <div class="feedback-box">
        <h3 style="margin-top: 0; color: #1e40af;">📋 Instructor Feedback:</h3>
        <p style="color: #1e3a8a; line-height: 1.6; white-space: pre-wrap;">${feedback}</p>
      </div>
      ` : ''}

      ${isPassed ? `
      <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #065f46;">
          <strong>🎉 Congratulations!</strong> Anda berhasil melewati essay ini. Lanjutkan pembelajaran Anda!
        </p>
      </div>
      ` : `
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #92400e;">
          <strong>💪 Keep Learning!</strong> Review feedback instructor dan coba lagi untuk meningkatkan pemahaman Anda.
        </p>
      </div>
      `}

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://mpt-community.vercel.app/academy" class="button">
          📚 View Your Results
        </a>
      </div>

      <p style="color: #374151; margin-top: 30px;">
        Keep up the great work! 🎯<br>
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
    
    console.log('✅ Essay graded email sent successfully to:', to);
    console.log('Message ID:', info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending essay graded email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send module completion email
 */
export async function sendModuleCompletionEmail(
  to: string,
  userName: string,
  moduleTitle: string,
  moduleNumber: number,
  quizScore: number,
  nextModuleTitle?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn('⚠️ GMAIL_APP_PASSWORD not configured - email not sent');
      return { 
        success: false, 
        error: 'GMAIL_APP_PASSWORD not configured' 
      };
    }

    console.log(`📧 Sending module completion email to: ${to}`);

    const mailOptions = {
      from: SENDER_EMAIL,
      to: to,
      subject: `🎓 Module Completed: ${moduleTitle}`,
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
    .achievement-card { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
    .trophy { font-size: 72px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; margin: 10px 0; }
    .progress-fill { background: linear-gradient(90deg, #f59e0b, #ea580c); height: 100%; border-radius: 4px; }
  </style>
</head>
<body style="background-color: #f3f4f6; padding: 20px;">
  <div class="container">
    <div class="header">
      <h1>🎉 Congratulations!</h1>
    </div>
    <div class="content">
      <div class="achievement-card">
        <div class="trophy">🏆</div>
        <h2 style="color: #92400e; margin: 10px 0;">Module ${moduleNumber} Completed!</h2>
        <p style="color: #78350f; font-size: 18px; font-weight: bold; margin: 5px 0;">${moduleTitle}</p>
        <p style="color: #a16207; margin: 10px 0;">Quiz Score: ${quizScore}%</p>
      </div>

      <h2 style="color: #111827;">Hi ${userName},</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Selamat! Anda telah berhasil menyelesaikan <strong>${moduleTitle}</strong> dengan score <strong>${quizScore}%</strong>. 
        Ini adalah pencapaian luar biasa dalam perjalanan trading Anda! 🎯
      </p>

      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #f59e0b; margin-top: 0;">📊 Your Progress</h3>
        <p style="color: #6b7280; margin: 5px 0;">Module ${moduleNumber} of 6 completed</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(moduleNumber / 6) * 100}%"></div>
        </div>
        <p style="color: #9ca3af; font-size: 14px; margin: 5px 0;">${Math.round((moduleNumber / 6) * 100)}% Complete</p>
      </div>

      ${nextModuleTitle ? `
      <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #1e40af;">🚀 What's Next?</h3>
        <p style="margin: 0; color: #1e3a8a;">
          <strong>${nextModuleTitle}</strong> is now unlocked and ready for you!
        </p>
      </div>
      ` : `
      <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #065f46;">🎖️ All Modules Completed!</h3>
        <p style="margin: 0; color: #047857;">
          Amazing! Anda telah menyelesaikan seluruh Warrior Academy. Saatnya apply ilmu dan jadi Plan Warrior sejati! 💪
        </p>
      </div>
      `}

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://mpt-community.vercel.app/academy" class="button">
          ${nextModuleTitle ? '📚 Continue Learning' : '🎓 View Certificate'}
        </a>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #92400e;">
          <strong>💡 Pro Tip:</strong> Review materi yang sudah dipelajari dan mulai apply di trading journal Anda untuk hasil maksimal!
        </p>
      </div>

      <p style="color: #374151; margin-top: 30px;">
        Keep crushing it, Warrior! 🔥<br>
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
    
    console.log('✅ Module completion email sent successfully to:', to);
    console.log('Message ID:', info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending module completion email:', error);
    return { success: false, error: error.message };
  }
}
