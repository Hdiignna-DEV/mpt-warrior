/**
 * Quiz Grading Example Component
 * Shows how to use the AI quiz grading system with Arka reactions
 */

'use client';

import { useState } from 'react';
import { useQuizGrader, useQuizScoreReaction } from '@/hooks/useQuizGrader';
import { Send, Loader } from 'lucide-react';

interface EssayQuestion {
  id: string;
  question: string;
  maxPoints: number;
  rubric?: string;
  expectedAnswer?: string;
}

const SAMPLE_QUESTIONS: EssayQuestion[] = [
  {
    id: 'q1',
    question: 'Explain the concept of diversification in trading and why it\'s important.',
    maxPoints: 100,
    rubric: 'Answer should mention: spreading risk, reducing volatility, protecting against market downturns, multiple asset classes/sectors.',
    expectedAnswer: 'Diversification is spreading investments across different asset classes, sectors, and securities to reduce risk and volatility. It protects against concentrated losses and helps achieve more stable returns.',
  },
  {
    id: 'q2',
    question: 'What is a moving average and how is it used in technical analysis?',
    maxPoints: 100,
    rubric: 'Should explain: trend identification, support/resistance, price smoothing, different types (SMA, EMA).',
    expectedAnswer: 'A moving average is a technical indicator that smooths price data by calculating the average price over a specific period. It helps identify trends, support/resistance levels, and trading signals.',
  },
];

export function QuizGradingExample() {
  const [selectedQuestion, setSelectedQuestion] = useState<EssayQuestion>(
    SAMPLE_QUESTIONS[0]
  );
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'groq'>(
    'gemini'
  );

  const { gradeAnswer, isGrading, result, error, reset } = useQuizGrader({
    provider: selectedProvider,
    autoReactToScore: true,
  });

  const { getScoreBadgeLabel, getScoreColor } = useQuizScoreReaction();

  const handleSubmitForGrading = async () => {
    if (!studentAnswer.trim()) {
      alert('Please write an answer before grading');
      return;
    }

    try {
      await gradeAnswer({
        questionId: selectedQuestion.id,
        question: selectedQuestion.question,
        studentAnswer,
        expectedAnswer: selectedQuestion.expectedAnswer,
        rubric: selectedQuestion.rubric,
        maxPoints: selectedQuestion.maxPoints,
      });
    } catch (err) {
      console.error('Grading failed:', err);
    }
  };

  const handleNextQuestion = () => {
    const currentIdx = SAMPLE_QUESTIONS.findIndex(
      (q) => q.id === selectedQuestion.id
    );
    const nextIdx = (currentIdx + 1) % SAMPLE_QUESTIONS.length;
    setSelectedQuestion(SAMPLE_QUESTIONS[nextIdx]);
    setStudentAnswer('');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI-Powered Quiz Grading Demo
          </h1>
          <p className="text-slate-400">
            Write your essay answer and get instant AI feedback with Arka reactions
          </p>
        </div>

        {/* Provider Selection */}
        <div className="mb-6 flex gap-4">
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="radio"
              checked={selectedProvider === 'gemini'}
              onChange={() => {
                setSelectedProvider('gemini');
                reset();
              }}
              className="w-4 h-4"
            />
            Gemini (More capable)
          </label>
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="radio"
              checked={selectedProvider === 'groq'}
              onChange={() => {
                setSelectedProvider('groq');
                reset();
              }}
              className="w-4 h-4"
            />
            Groq (Faster)
          </label>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          {/* Question Number */}
          <div className="mb-4">
            <div className="inline-block px-3 py-1 bg-blue-600/30 rounded text-blue-300 text-sm font-medium">
              Question {SAMPLE_QUESTIONS.findIndex((q) => q.id === selectedQuestion.id) + 1} of{' '}
              {SAMPLE_QUESTIONS.length}
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-white mb-6">
            {selectedQuestion.question}
          </h2>

          {/* Rubric */}
          {selectedQuestion.rubric && (
            <div className="mb-6 p-4 bg-slate-700/30 rounded border border-slate-600">
              <p className="text-sm font-medium text-slate-300 mb-2">Rubric:</p>
              <p className="text-sm text-slate-400">{selectedQuestion.rubric}</p>
            </div>
          )}

          {/* Answer Input */}
          <textarea
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="Write your answer here... (minimum 50 characters for meaningful grading)"
            disabled={isGrading}
            className="w-full h-32 px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />

          {/* Grade Button */}
          <button
            onClick={handleSubmitForGrading}
            disabled={isGrading || !studentAnswer.trim()}
            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium"
          >
            {isGrading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Grading... (may take 10-20 seconds)
              </>
            ) : (
              <>
                <Send size={18} />
                Submit for AI Grading
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 font-medium">Error:</p>
            <p className="text-red-200 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}
                  >
                    {result.percentage}%
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-300">
                    {result.score}/{result.maxScore}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Points</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-300">
                    {getScoreBadgeLabel(result.percentage)}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Rating</p>
                </div>
              </div>

              {/* AI Provider */}
              <p className="text-xs text-slate-500">
                Graded by: {result.aiProvider}
              </p>
            </div>

            {/* Feedback */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                AI Feedback
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {result.feedback}
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">
                  ✅ Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-300 flex gap-2"
                    >
                      <span className="text-green-400">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">
                  📈 Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((improvement, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-300 flex gap-2"
                    >
                      <span className="text-yellow-400">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStudentAnswer('');
                  reset();
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
              {SAMPLE_QUESTIONS.length > 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!result && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-slate-400 text-sm">
            <p className="font-medium text-slate-300 mb-2">💡 Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Write detailed answers that address all aspects of the question</li>
              <li>Include specific examples or explanations</li>
              <li>Check the rubric for what the AI will be looking for</li>
              <li>API keys must be configured for Gemini or Groq</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
