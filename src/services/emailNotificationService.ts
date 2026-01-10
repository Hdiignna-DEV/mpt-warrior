/**
 * Email Notification Service
 * Sends emails for:
 * - Quiz completion notifications
 * - Leaderboard updates (top 3 entries, rank changes)
 * - Achievement unlocks
 * - Weekly ranking summaries
 * 
 * Supports both SendGrid and Resend email providers
 */

export type EmailProvider = 'sendgrid' | 'resend';

export interface NotificationRecipient {
  userId: string;
  email: string;
  userName: string;
}

export interface QuizCompletionNotification {
  type: 'quiz_completion';
  recipient: NotificationRecipient;
  quizTitle: string;
  score: number;
  percentage: number;
  passed: boolean;
}

export interface TopThreeNotification {
  type: 'top_three_entry';
  recipient: NotificationRecipient;
  rank: number;
  score: number;
  previousRank?: number;
}

export interface RankChangeNotification {
  type: 'rank_change';
  recipient: NotificationRecipient;
  newRank: number;
  previousRank: number;
  rankChange: number;
  totalScore: number;
}

export interface WeeklyRankingSummaryNotification {
  type: 'weekly_summary';
  recipient: NotificationRecipient;
  weekPeriod: string;
  currentRank: number;
  totalScore: number;
  weeklyImprovement: number;
  topGainers: Array<{ userName: string; rankChange: number }>;
}

export interface AchievementNotification {
  type: 'achievement_unlock';
  recipient: NotificationRecipient;
  achievementName: string;
  achievementDescription: string;
  earnedPoints: number;
}

export type NotificationPayload =
  | QuizCompletionNotification
  | TopThreeNotification
  | RankChangeNotification
  | WeeklyRankingSummaryNotification
  | AchievementNotification;

/**
 * Email Notification Service
 */
export class EmailNotificationService {
  private provider: EmailProvider;
  private sendGridApiKey?: string;
  private resendApiKey?: string;
  private fromEmail: string;

  constructor(
    provider: EmailProvider = 'sendgrid',
    fromEmail: string = process.env.NOTIFICATION_FROM_EMAIL || 'noreply@mpt-warrior.com'
  ) {
    this.provider = provider;
    this.fromEmail = fromEmail;

    if (provider === 'sendgrid') {
      this.sendGridApiKey = process.env.SENDGRID_API_KEY;
      if (!this.sendGridApiKey) {
        console.warn('SendGrid API key not configured');
      }
    } else if (provider === 'resend') {
      this.resendApiKey = process.env.RESEND_API_KEY;
      if (!this.resendApiKey) {
        console.warn('Resend API key not configured');
      }
    }
  }

  /**
   * Send notification based on payload type
   */
  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      switch (payload.type) {
        case 'quiz_completion':
          return await this.sendQuizCompletionEmail(payload as QuizCompletionNotification);
        case 'top_three_entry':
          return await this.sendTopThreeEmail(payload as TopThreeNotification);
        case 'rank_change':
          return await this.sendRankChangeEmail(payload as RankChangeNotification);
        case 'weekly_summary':
          return await this.sendWeeklySummaryEmail(payload as WeeklyRankingSummaryNotification);
        case 'achievement_unlock':
          return await this.sendAchievementEmail(payload as AchievementNotification);
        default:
          console.error('Unknown notification type');
          return false;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Send quiz completion email
   */
  private async sendQuizCompletionEmail(notification: QuizCompletionNotification): Promise<boolean> {
    const subject = `${notification.passed ? '✅ Quiz Passed' : '❌ Quiz Not Passed'}: ${notification.quizTitle}`;
    const html = this.getQuizCompletionTemplate(notification);
    return await this.sendEmail(notification.recipient.email, subject, html);
  }

  /**
   * Send top 3 entry email
   */
  private async sendTopThreeEmail(notification: TopThreeNotification): Promise<boolean> {
    const medalEmoji = notification.rank === 1 ? '🥇' : notification.rank === 2 ? '🥈' : '🥉';
    const subject = `${medalEmoji} Congratulations! You entered Top 3!`;
    const html = this.getTopThreeTemplate(notification);
    return await this.sendEmail(notification.recipient.email, subject, html);
  }

  /**
   * Send rank change email
   */
  private async sendRankChangeEmail(notification: RankChangeNotification): Promise<boolean> {
    const trending = notification.rankChange > 0 ? '📈' : '📉';
    const subject = `${trending} Your Leaderboard Ranking Changed`;
    const html = this.getRankChangeTemplate(notification);
    return await this.sendEmail(notification.recipient.email, subject, html);
  }

  /**
   * Send weekly summary email
   */
  private async sendWeeklySummaryEmail(notification: WeeklyRankingSummaryNotification): Promise<boolean> {
    const subject = `📊 Weekly Ranking Summary - ${notification.weekPeriod}`;
    const html = this.getWeeklySummaryTemplate(notification);
    return await this.sendEmail(notification.recipient.email, subject, html);
  }

  /**
   * Send achievement unlock email
   */
  private async sendAchievementEmail(notification: AchievementNotification): Promise<boolean> {
    const subject = `🏆 Achievement Unlocked: ${notification.achievementName}`;
    const html = this.getAchievementTemplate(notification);
    return await this.sendEmail(notification.recipient.email, subject, html);
  }

  /**
   * Send email via provider
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (this.provider === 'sendgrid') {
      return await this.sendViaendGrid(to, subject, html);
    } else if (this.provider === 'resend') {
      return await this.sendViaResend(to, subject, html);
    }
    return false;
  }

  /**
   * Send via SendGrid
   */
  private async sendViaendGrid(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!this.sendGridApiKey) {
        console.warn('SendGrid API key not configured');
        return false;
      }

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject,
            },
          ],
          from: { email: this.fromEmail },
          content: [{ type: 'text/html', value: html }],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }

  /**
   * Send via Resend
   */
  private async sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!this.resendApiKey) {
        console.warn('Resend API key not configured');
        return false;
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to,
          subject,
          html,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Resend error:', error);
      return false;
    }
  }

  /**
   * Email template: Quiz Completion
   */
  private getQuizCompletionTemplate(notif: QuizCompletionNotification): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .score-box { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .score-display { font-size: 48px; font-weight: bold; color: ${notif.passed ? '#28a745' : '#dc3545'}; }
            .percentage { font-size: 24px; color: #666; margin-top: 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${notif.passed ? '✅ Great Job!' : '💪 Keep Trying!'}</h2>
              <p>Quiz: ${notif.quizTitle}</p>
            </div>
            <p>Hi ${notif.recipient.userName},</p>
            <p>You just completed the quiz "${notif.quizTitle}"!</p>
            <div class="score-box">
              <div class="score-display">${notif.score}</div>
              <div class="percentage">${notif.percentage}%</div>
              ${notif.passed ? '<p style="color: #28a745; font-weight: bold;">Quiz Passed!</p>' : '<p style="color: #dc3545; font-weight: bold;">Try again to pass</p>'}
            </div>
            <p>${notif.passed ? 'Great work! Keep up the momentum and check your leaderboard ranking.' : 'Don\'t give up! Review the material and try again.'}</p>
            <a href="https://mpt-warrior.com/dashboard" class="button">View Dashboard</a>
            <div class="footer">
              <p>© 2026 MPT Warrior. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Email template: Top 3 Entry
   */
  private getTopThreeTemplate(notif: TopThreeNotification): string {
    const medal = notif.rank === 1 ? '🥇 Gold' : notif.rank === 2 ? '🥈 Silver' : '🥉 Bronze';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .medal-box { font-size: 60px; text-align: center; margin: 20px 0; }
            .rank-info { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
            .rank-number { font-size: 36px; font-weight: bold; color: #f5576c; }
            .score { font-size: 24px; color: #666; margin-top: 10px; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p>You made it to Top 3!</p>
            </div>
            <p>Hi ${notif.recipient.userName},</p>
            <p>Amazing news! You've earned a spot in the Top 3 leaderboard rankings!</p>
            <div class="medal-box">${medal === '🥇 Gold' ? '🥇' : medal === '🥈 Silver' ? '🥈' : '🥉'}</div>
            <div class="rank-info">
              <div class="rank-number">Rank #${notif.rank}</div>
              <div class="score">${notif.score} points</div>
              ${notif.previousRank ? `<p style="color: #28a745; margin-top: 10px;">↑ Improved from #${notif.previousRank}</p>` : ''}
            </div>
            <p>You're doing fantastic! Keep up the great work and maintain your position.</p>
            <a href="https://mpt-warrior.com/leaderboard" class="button">View Leaderboard</a>
            <div class="footer">
              <p>© 2026 MPT Warrior. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Email template: Rank Change
   */
  private getRankChangeTemplate(notif: RankChangeNotification): string {
    const isImprovement = notif.rankChange > 0;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .rank-change { background: ${isImprovement ? '#d4edda' : '#f8d7da'}; color: ${isImprovement ? '#155724' : '#721c24'}; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .change-arrow { font-size: 36px; margin-bottom: 10px; }
            .ranking { font-size: 24px; font-weight: bold; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${isImprovement ? '📈 Rank Improved!' : '📉 Rank Updated'}</h2>
            </div>
            <p>Hi ${notif.recipient.userName},</p>
            <p>Your leaderboard ranking has changed!</p>
            <div class="rank-change">
              <div class="change-arrow">${isImprovement ? '⬆️ Up' : '⬇️ Down'}</div>
              <div class="ranking">#${notif.previousRank} → #${notif.newRank}</div>
              <p style="margin: 10px 0 0 0;">Change: ${isImprovement ? '+' : ''}${notif.rankChange} positions</p>
            </div>
            <p>Your current score: <strong>${notif.totalScore}</strong> points</p>
            <p>${isImprovement ? 'Excellent progress! Keep pushing forward.' : 'Keep working hard to reclaim your position.'}</p>
            <a href="https://mpt-warrior.com/leaderboard" class="button">View Leaderboard</a>
            <div class="footer">
              <p>© 2026 MPT Warrior. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Email template: Weekly Summary
   */
  private getWeeklySummaryTemplate(notif: WeeklyRankingSummaryNotification): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .stats-box { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
            .stat-label { color: #999; font-size: 12px; }
            .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
            .gainers { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .gainer-item { padding: 8px 0; border-bottom: 1px solid #eee; }
            .gainer-item:last-child { border-bottom: none; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📊 Weekly Ranking Summary</h2>
              <p>${notif.weekPeriod}</p>
            </div>
            <p>Hi ${notif.recipient.userName},</p>
            <p>Here's your weekly performance summary:</p>
            <div class="stats-box">
              <div class="stat">
                <div class="stat-label">Your Rank</div>
                <div class="stat-value">#${notif.currentRank}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Total Points</div>
                <div class="stat-value">${notif.totalScore}</div>
              </div>
            </div>
            ${notif.weeklyImprovement !== 0 ? `
            <div class="stat" style="grid-column: 1 / -1;">
              <div class="stat-label">Weekly Improvement</div>
              <div class="stat-value" style="color: ${notif.weeklyImprovement > 0 ? '#28a745' : '#dc3545'}">
                ${notif.weeklyImprovement > 0 ? '+' : ''}${notif.weeklyImprovement} points
              </div>
            </div>
            ` : ''}
            ${notif.topGainers.length > 0 ? `
            <div class="gainers">
              <h3 style="margin-top: 0; color: #333;">🚀 Top Position Gainers</h3>
              ${notif.topGainers.map(g => `<div class="gainer-item"><strong>${g.userName}</strong> - +${g.rankChange} positions</div>`).join('')}
            </div>
            ` : ''}
            <a href="https://mpt-warrior.com/leaderboard" class="button">View Full Leaderboard</a>
            <div class="footer">
              <p>© 2026 MPT Warrior. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Email template: Achievement Unlock
   */
  private getAchievementTemplate(notif: AchievementNotification): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .trophy { font-size: 80px; text-align: center; margin: 20px 0; }
            .achievement-name { font-size: 28px; font-weight: bold; color: #333; text-align: center; margin: 20px 0; }
            .achievement-desc { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; color: #666; }
            .points { background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 Achievement Unlocked!</h1>
            </div>
            <p>Hi ${notif.recipient.userName},</p>
            <div class="trophy">🏆</div>
            <div class="achievement-name">${notif.achievementName}</div>
            <div class="achievement-desc">${notif.achievementDescription}</div>
            <div class="points">+${notif.earnedPoints} Points</div>
            <p>Fantastic work! You've earned a new achievement. Keep going!</p>
            <a href="https://mpt-warrior.com/achievements" class="button">View All Achievements</a>
            <div class="footer">
              <p>© 2026 MPT Warrior. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

// Export singleton for easy usage
export const emailNotificationService = new EmailNotificationService(
  (process.env.NOTIFICATION_PROVIDER as EmailProvider) || 'sendgrid'
);
