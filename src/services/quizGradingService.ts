/**
 * Quiz Grading Service
 * AI-powered essay and open-ended question grading using Gemini or Groq
 * 
 * Scoring Rubric:
 * - 90-100: High-quality answer (comprehensive, accurate, well-structured)
 * - 70-89: Good answer (mostly correct, adequate explanation)
 * - 50-69: Needs improvement (partial understanding, gaps)
 * - 0-49: Poor answer (incorrect, incomplete, off-topic)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';

export interface QuizGradingRequest {
  questionId: string;
  question: string;
  studentAnswer: string;
  expectedAnswer?: string;
  rubric?: string;
  maxPoints: number;
  provider: 'gemini' | 'groq';
}

export interface QuizGradingResult {
  questionId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  aiProvider: string;
  gradedAt: Date;
}

class QuizGradingService {
  private geminiClient: GoogleGenerativeAI | null = null;
  private groqClient: Groq | null = null;

  constructor() {
    // Initialize Gemini if API key available
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      this.geminiClient = new GoogleGenerativeAI(
        process.env.GOOGLE_GENERATIVE_AI_API_KEY
      );
    }

    // Initialize Groq if API key available
    if (process.env.GROQ_API_KEY) {
      this.groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    }
  }

  /**
   * Create grading prompt for AI
   */
  private createGradingPrompt(request: QuizGradingRequest): string {
    return `You are an expert educator grading a student's answer. Grade this answer fairly and provide constructive feedback.

QUESTION:
${request.question}

STUDENT'S ANSWER:
${request.studentAnswer}

${request.expectedAnswer ? `EXPECTED ANSWER/RUBRIC:\n${request.expectedAnswer}\n` : ''}

${request.rubric ? `GRADING RUBRIC:\n${request.rubric}\n` : ''}

SCORING GUIDELINES:
- 90-100: Excellent (comprehensive, accurate, well-explained, demonstrates mastery)
- 70-89: Good (mostly correct, good understanding, minor gaps)
- 50-69: Satisfactory (partial understanding, some errors, basic grasp)
- 0-49: Needs Work (incorrect, incomplete, significant gaps)

Provide your response in this exact JSON format:
{
  "score": <number 0-${request.maxPoints}>,
  "percentage": <number 0-100>,
  "feedback": "<comprehensive feedback for the student>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>"],
  "reasoning": "<brief explanation of scoring decision>"
}

Respond ONLY with the JSON object, no markdown formatting.`;
  }

  /**
   * Grade using Gemini AI
   */
  private async gradeWithGemini(
    request: QuizGradingRequest
  ): Promise<QuizGradingResult> {
    if (!this.geminiClient) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = this.createGradingPrompt(request);

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      const grading = JSON.parse(jsonMatch[0]);

      return {
        questionId: request.questionId,
        score: Math.min(grading.score, request.maxPoints),
        maxScore: request.maxPoints,
        percentage: grading.percentage,
        feedback: grading.feedback,
        strengths: grading.strengths || [],
        improvements: grading.improvements || [],
        aiProvider: 'gemini-pro',
        gradedAt: new Date(),
      };
    } catch (error) {
      console.error('Gemini grading error:', error);
      throw error;
    }
  }

  /**
   * Grade using Groq AI
   */
  private async gradeWithGroq(
    request: QuizGradingRequest
  ): Promise<QuizGradingResult> {
    if (!this.groqClient) {
      throw new Error('Groq client not initialized');
    }

    const prompt = this.createGradingPrompt(request);

    try {
      const completion = await this.groqClient.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      const responseText = completion.choices[0]?.message?.content || '';

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Groq');
      }

      const grading = JSON.parse(jsonMatch[0]);

      return {
        questionId: request.questionId,
        score: Math.min(grading.score, request.maxPoints),
        maxScore: request.maxPoints,
        percentage: grading.percentage,
        feedback: grading.feedback,
        strengths: grading.strengths || [],
        improvements: grading.improvements || [],
        aiProvider: 'groq-mixtral',
        gradedAt: new Date(),
      };
    } catch (error) {
      console.error('Groq grading error:', error);
      throw error;
    }
  }

  /**
   * Grade answer with selected provider
   */
  async grade(request: QuizGradingRequest): Promise<QuizGradingResult> {
    if (request.provider === 'gemini') {
      return this.gradeWithGemini(request);
    } else if (request.provider === 'groq') {
      return this.gradeWithGroq(request);
    } else {
      throw new Error(`Unsupported provider: ${request.provider}`);
    }
  }

  /**
   * Batch grade multiple answers
   */
  async batchGrade(
    requests: QuizGradingRequest[]
  ): Promise<QuizGradingResult[]> {
    return Promise.all(requests.map((req) => this.grade(req)));
  }
}

// Export singleton instance
export const quizGradingService = new QuizGradingService();
