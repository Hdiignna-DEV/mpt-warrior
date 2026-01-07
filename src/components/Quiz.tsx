/**
 * Quiz Component for MPT Academy
 * Handles quiz display, submission, and scoring
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface QuizQuestion {
  id: string;
  moduleId: string;
  type: 'multiple-choice' | 'essay' | 'true-false';
  question: string;
  options?: string[];
  points: number;
  order: number;
}

interface UserAnswer {
  id: string;
  userId: string;
  moduleId: string;
  questionId: string;
  answer: string;
  score: number | null;
  feedback: string | null;
  gradedBy: string | null;
  gradedAt: string | null;
  submittedAt: string;
}

interface QuizScore {
  moduleId: string;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  gradedQuestions: number;
  totalQuestions: number;
  isPassed: boolean;
}

interface QuizProps {
  moduleId: string;
  onComplete?: () => void;
}

export default function Quiz({ moduleId, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState<QuizScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuiz();
    fetchScore();
  }, [moduleId]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/academy/quiz/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScore = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/academy/quiz/score/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setScore(data.score);
        
        // Build answers map from user's previous answers
        const answersMap: Record<string, string> = {};
        data.answers.forEach((item: any) => {
          if (item.answer) {
            answersMap[item.question.id] = item.answer.answer;
          }
        });
        setAnswers(answersMap);

        // If quiz already completed, show results
        if (data.score.percentage > 0) {
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error('Error fetching score:', error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswer = async (questionId: string) => {
    if (!answers[questionId]) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/academy/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moduleId,
          questionId,
          answer: answers[questionId],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh score after submission
        await fetchScore();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Submit all answers
      for (const question of questions) {
        if (answers[question.id]) {
          await fetch('/api/academy/quiz/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              moduleId,
              questionId: question.id,
              answer: answers[question.id],
            }),
          });
        }
      }

      // Refresh score
      await fetchScore();
      setShowResults(true);
      
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return !!answers[questionId];
  };

  const allQuestionsAnswered = () => {
    return questions.every(q => isQuestionAnswered(q.id));
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        Loading quiz...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
        <p className="text-gray-400 text-center">
          No quiz available for this module yet.
        </p>
      </Card>
    );
  }

  if (showResults && score) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Results</h3>
          <div className={`text-5xl font-bold mb-4 ${score.isPassed ? 'text-green-400' : 'text-red-400'}`}>
            {score.percentage}%
          </div>
          <Badge className={score.isPassed ? 'bg-green-500' : 'bg-red-500'}>
            {score.isPassed ? '✅ PASSED' : '❌ NOT PASSED'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-gray-400 text-sm">Score</div>
            <div className="text-white text-xl font-bold">
              {score.earnedPoints} / {score.totalPoints}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-gray-400 text-sm">Graded</div>
            <div className="text-white text-xl font-bold">
              {score.gradedQuestions} / {score.totalQuestions}
            </div>
          </div>
        </div>

        {score.gradedQuestions < score.totalQuestions && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <p className="text-yellow-400 text-sm">
              ⏳ Some essay questions are pending manual grading by Founder & Head Educator
            </p>
          </div>
        )}

        {!score.isPassed && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">
              Minimum passing score is 70%. Please review the material and try again.
            </p>
          </div>
        )}

        <Button
          onClick={() => setShowResults(false)}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Review Answers
        </Button>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-gray-400 text-sm">
            {questions.filter(q => isQuestionAnswered(q.id)).length} answered
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-purple-600 text-white">
            {question.type === 'multiple-choice' && '🔘 Multiple Choice'}
            {question.type === 'true-false' && '✓✗ True/False'}
            {question.type === 'essay' && '✍️ Essay'}
          </Badge>
          <Badge className="bg-blue-600 text-white">
            {question.points} points
          </Badge>
        </div>

        <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed whitespace-pre-wrap">
          {question.question}
        </h3>

        {/* Multiple Choice / True-False */}
        {(question.type === 'multiple-choice' || question.type === 'true-false') && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[question.id] === index.toString()
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={index}
                  checked={answers[question.id] === index.toString()}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mr-3"
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Essay */}
        {question.type === 'essay' && (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-40 p-4 bg-white/5 border border-white/10 rounded-lg text-white resize-none focus:outline-none focus:border-purple-500"
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex-1 bg-white/10 hover:bg-white/20"
        >
          ← Previous
        </Button>

        {currentQuestion < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={handleSubmitAll}
            disabled={!allQuestionsAnswered() || submitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : '✓ Submit Quiz'}
          </Button>
        )}
      </div>

      {!allQuestionsAnswered() && (
        <p className="text-yellow-400 text-sm text-center">
          ⚠️ Please answer all questions before submitting
        </p>
      )}
    </div>
  );
}
