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
      subject: `${statusEmoji} Essay Grading Result - ${moduleTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        
        <!-- Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.98); border-radius: 16px 16px 0 0; overflow: hidden;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div style="font-size: 64px; margin-bottom: 10px;">📝</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Essay Graded!</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${moduleTitle}</p>
            </td>
          </tr>
        </table>

        <!-- Content Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 16px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Hi ${userName},</h2>
              <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Your essay has been reviewed by our <strong>Founder & Head Educator</strong>. Here's your result:
              </p>

              <!-- Score Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: ${isPassed ? 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' : 'linear-gradient(135deg, #fdeb71 0%, #f8d800 100%)'}; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <div style="font-size: 14px; color: rgba(0,0,0,0.6); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 12px;">YOUR SCORE</div>
                    <div style="font-size: 56px; font-weight: 800; color: ${statusColor}; margin: 10px 0; line-height: 1;">${score}<span style="font-size: 32px; opacity: 0.7;">/${maxScore}</span></div>
                    <div style="display: inline-block; background: rgba(0,0,0,0.1); padding: 8px 20px; border-radius: 20px; margin-top: 12px;">
                      <span style="color: rgba(0,0,0,0.8); font-weight: 700; font-size: 16px;">${statusEmoji} ${statusText}</span>
                    </div>
                    <div style="color: rgba(0,0,0,0.7); font-size: 18px; font-weight: 600; margin-top: 8px;">${percentage}%</div>
                  </td>
                </tr>
              </table>

              ${feedback ? `
              <!-- Feedback Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f7fafc; border-left: 4px solid #667eea; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 12px 0; color: #2d3748; font-size: 18px; font-weight: 600;">
                      💬 Instructor Feedback
                    </h3>
                    <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${feedback}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Status Message -->
              ${isPassed ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0; color: #22543d; font-size: 15px; line-height: 1.6;">
                      <strong style="font-size: 18px;">🎉 Outstanding Work!</strong><br>
                      You've successfully passed this essay question. Your understanding is excellent – keep this momentum going!
                    </p>
                  </td>
                </tr>
              </table>
              ` : `
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fff3cd 0%, #fff8dc 100%); border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0; color: #744210; font-size: 15px; line-height: 1.6;">
                      <strong style="font-size: 18px;">💪 Room for Growth!</strong><br>
                      Review the feedback carefully and strengthen your understanding. Every warrior learns from feedback – this is your path to mastery!
                    </p>
                  </td>
                </tr>
              </table>
              `}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://mpt-community.vercel.app/academy" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;">
                      📚 Continue Learning
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 30px 0 0 0; color: #4a5568; font-size: 15px; line-height: 1.6; text-align: center;">
                Keep pushing forward, Warrior! 🎯<br>
                <strong style="color: #2d3748;">Team MPT Community</strong>
              </p>

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.95); border-radius: 0 0 16px 16px;">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #718096; font-size: 13px;">© 2026 MPT Community. All rights reserved.</p>
              <p style="margin: 0; color: #a0aec0; font-size: 14px; font-style: italic; font-weight: 500;">
                "Focus on the Plan, Not the Panic."
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

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
      subject: `🎓 Module ${moduleNumber} Completed - You're on Fire!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); min-height: 100vh; padding: 40px 20px;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        
        <!-- Header with Trophy -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.98); border-radius: 16px 16px 0 0; overflow: hidden;">
          <tr>
            <td style="padding: 50px 30px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); position: relative;">
              <div style="font-size: 80px; margin-bottom: 15px; animation: bounce 1s infinite;">🏆</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                CONGRATULATIONS!
              </h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 600;">
                Module ${moduleNumber} Completed
              </p>
            </td>
          </tr>
        </table>

        <!-- Content Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Achievement Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <div style="background: rgba(245,158,11,0.2); display: inline-block; padding: 12px 24px; border-radius: 25px; margin-bottom: 16px;">
                      <span style="color: #92400e; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">🎯 Achievement Unlocked</span>
                    </div>
                    <h2 style="margin: 12px 0; color: #78350f; font-size: 24px; font-weight: 700;">${moduleTitle}</h2>
                    <div style="background: rgba(255,255,255,0.7); display: inline-block; padding: 10px 24px; border-radius: 20px; margin-top: 12px;">
                      <span style="color: #92400e; font-weight: 700; font-size: 20px;">Quiz Score: ${quizScore}%</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <h2 style="margin: 0 0 16px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Amazing Work, ${userName}!</h2>
              <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                You've successfully completed <strong>${moduleTitle}</strong> with an impressive score of <strong>${quizScore}%</strong>! 
                This is a significant milestone in your journey to becoming a disciplined Plan Warrior. 🎯
              </p>

              <!-- Progress Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; color: #0c4a6e; font-size: 18px; font-weight: 600;">
                      📊 Your Learning Progress
                    </h3>
                    <div style="background: #e0e7ff; height: 12px; border-radius: 6px; overflow: hidden; margin: 12px 0;">
                      <div style="background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%); height: 100%; width: ${(moduleNumber / 6) * 100}%; border-radius: 6px; box-shadow: 0 2px 4px rgba(245,158,11,0.3);"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                      <span style="color: #64748b; font-size: 14px; font-weight: 600;">Module ${moduleNumber} of 6</span>
                      <span style="color: #f59e0b; font-size: 14px; font-weight: 700;">${Math.round((moduleNumber / 6) * 100)}% Complete</span>
                    </div>
                  </td>
                </tr>
              </table>

              ${nextModuleTitle ? `
              <!-- Next Module Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="background: rgba(59,130,246,0.2); display: inline-block; padding: 6px 16px; border-radius: 15px; margin-bottom: 12px;">
                      <span style="color: #1e40af; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">🚀 Unlocked</span>
                    </div>
                    <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 18px; font-weight: 700;">
                      Next Up: ${nextModuleTitle}
                    </h3>
                    <p style="margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6;">
                      Your next challenge awaits! Continue your journey and unlock more powerful trading strategies.
                    </p>
                  </td>
                </tr>
              </table>
              ` : `
              <!-- Completion Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🎊</div>
                    <h3 style="margin: 0 0 8px 0; color: #14532d; font-size: 20px; font-weight: 700;">
                      All Available Modules Completed!
                    </h3>
                    <p style="margin: 0; color: #15803d; font-size: 15px; line-height: 1.6;">
                      You've mastered all the current content. New advanced modules coming soon!
                    </p>
                  </td>
                </tr>
              </table>
              `}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://mpt-community.vercel.app/academy" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #ffffff; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 10px 15px -3px rgba(245,158,11,0.3); transition: transform 0.2s;">
                      ${nextModuleTitle ? '🎓 Start Next Module' : '📚 View All Achievements'}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Motivational Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 8px; margin-top: 30px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.7;">
                      <em>"Every module completed is a step closer to trading mastery.<br>Keep building your discipline, keep following the plan."</em>
                    </p>
                    <p style="margin: 16px 0 0 0; color: #2d3748; font-weight: 700; font-size: 16px;">
                      🎯 Team MPT Community
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.95); border-radius: 0 0 16px 16px;">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #718096; font-size: 13px;">© 2026 MPT Community. All rights reserved.</p>
              <p style="margin: 0; color: #a0aec0; font-size: 14px; font-style: italic; font-weight: 500;">
                "Focus on the Plan, Not the Panic."
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

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
