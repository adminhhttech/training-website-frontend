
// src\components\FullScreenTest.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Clock, CheckCircle, AlertCircle, ChevronRight,
  ChevronLeft, Award, HelpCircle, BarChart3, Flag, Loader2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { api } from '@/services/api';

export interface TestQuestion {
  id: string;
  type: 'mcq' | 'coding' | 'theory';
  question: string;
  options?: string[];
  correctAnswerIndex: number;
  explanation?: string;
  codeSnippet?: string;
  timeEstimate?: number; // in seconds
}

export interface TestConfig {
  id: string;
  title: string;
  type: "module" | "final" | "aptitude" | "softskills";
  questionCount: number;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  instructions?: string[];
}

interface FullScreenTestProps {
  config: TestConfig;
  questions: TestQuestion[];
  onClose: () => void;
  onComplete: (results: {
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    timeSpent: number;
    answers: Array<{
      questionId: string;
      selectedIndex: number;
      isCorrect: boolean;
      timeSpent: number;
    }>;
  }) => void;
}

const FullScreenTest: React.FC<FullScreenTestProps> = ({
  config,
  questions,
  onClose,
  onComplete
}) => {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(config.timeLimit * 60); // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answerTimes, setAnswerTimes] = useState<number[]>(Array(questions.length).fill(0));
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  // Explanation toggle state - only available for module tests
  const [showExplanations, setShowExplanations] = useState(false);
  const [realTimeExplanations, setRealTimeExplanations] = useState(false); // Real-time during test (module only)
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Set<number>>(new Set());
  
  // Check if this is a module test (explanations allowed during test)
  const isModuleTest = config.type === 'module';

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted || showInstructions) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, showInstructions]);

  // Track question start time
  useEffect(() => {
    if (!showInstructions && !isSubmitted) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, showInstructions, isSubmitted]);

 useEffect(() => {
  // Only track when test is actually running
  if (showInstructions || isSubmitted) return;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setTabSwitchCount(prev => {
        const next = prev + 1;

        if (next >= 3) {
          alert('Test submitted automatically due to multiple tab switches.');
          handleAutoSubmit();
        }

        return next;
      });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [showInstructions, isSubmitted]);



  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle answer selection with real-time explanation for module tests
  const handleAnswerSelect = async (optionIndex: number) => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    
    const newAnswerTimes = [...answerTimes];
    newAnswerTimes[currentQuestionIndex] = timeSpent;
    setAnswerTimes(newAnswerTimes);
    
    // Real-time explanation for wrong answers (module tests only)
    if (isModuleTest && realTimeExplanations && optionIndex !== currentQuestion.correctAnswerIndex) {
      fetchRealTimeExplanation(currentQuestionIndex, optionIndex);
    }
  };
  
  // Fetch real-time explanation for wrong answers during module tests
  const fetchRealTimeExplanation = async (questionIndex: number, selectedIndex: number) => {
    if (explanations[questionIndex] || loadingExplanations.has(questionIndex)) return;
    
    const question = questions[questionIndex];
    const userAnswerText = question.options?.[selectedIndex] || '';
    const correctAnswerText = question.options?.[question.correctAnswerIndex] || '';
    
    setLoadingExplanations(prev => new Set(prev).add(questionIndex));
    try {
      const response = await api.explainWrongAnswer(question.question, userAnswerText, correctAnswerText);
      setExplanations(prev => ({ ...prev, [questionIndex]: response.explanation.explanation }));
    } catch (error) {
      console.error('Failed to fetch real-time explanation:', error);
      // Provide helpful fallback instead of error message
      setExplanations(prev => ({ 
        ...prev, 
        [questionIndex]: `The correct answer is "${correctAnswerText}". Review the course materials on this topic for a deeper understanding.` 
      }));
    } finally {
      setLoadingExplanations(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionIndex);
        return newSet;
      });
    }
  };

  // Toggle flag for review
  const toggleFlagQuestion = (index: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(index)) {
      newFlagged.delete(index);
    } else {
      newFlagged.add(index);
    }
    setFlaggedQuestions(newFlagged);
  };

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Submit handlers
  const handleAutoSubmit = () => {
    const results = calculateResults();
    setIsSubmitted(true);
    onComplete(results);
  };

  const handleSubmit = () => {
    const unanswered = answers.filter(a => a === -1).length;
    if (unanswered > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }
    
    const results = calculateResults();
    setIsSubmitted(true);
    onComplete(results);
  };

  const calculateResults = () => {
    let correctCount = 0;
    const detailedAnswers = answers.map((answer, index) => ({
      questionId: questions[index].id,
      selectedIndex: answer,
      isCorrect: answer === questions[index].correctAnswerIndex,
      timeSpent: answerTimes[index]
    }));

    detailedAnswers.forEach(answer => {
      if (answer.isCorrect) correctCount++;
    });

    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= config.passingScore;
    const timeSpent = (config.timeLimit * 60) - timeLeft;

    return {
      score,
      passed,
      correctCount,
      totalQuestions,
      timeSpent,
      answers: detailedAnswers
    };
  };

  // Get question status
  const getQuestionStatus = (index: number) => {
    if (answers[index] === -1) return 'unanswered';
    if (isSubmitted) {
      return answers[index] === questions[index].correctAnswerIndex ? 'correct' : 'incorrect';
    }
    return 'answered';
  };

  // Instructions screen
  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#0080ff] z-50 flex items-center justify-center p-4 select-none">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              {tabSwitchCount > 0 && (
  <div className="text-sm font-medium text-red-600">
    Tab switches: {tabSwitchCount}/3
  </div>
)}

              <div className="w-20 h-20 rounded-full bg-[#0080ff]/10 flex items-center justify-center mx-auto mb-4">
                <Award size={40} className="text-[#0080ff]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
              <p className="text-gray-600">Full-Screen Assessment</p>
            </div>

            {/* Test Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#0080ff]">{config.questionCount}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#0080ff]">{config.timeLimit}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#0080ff]">{config.passingScore}%</div>
                <div className="text-sm text-gray-600">To Pass</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#0080ff]">{config.type === 'module' ? 'Module' : 'Final'}</div>
                <div className="text-sm text-gray-600">Test Type</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle size={20} className="text-[#0080ff]" />
                Instructions
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0080ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0080ff] text-sm font-bold">1</span>
                  </div>
                  <span>Read each question carefully before answering</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0080ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0080ff] text-sm font-bold">2</span>
                  </div>
                  <span>You can flag questions to review later using the flag icon</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0080ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0080ff] text-sm font-bold">3</span>
                  </div>
                  <span>The timer will automatically submit the test when time runs out</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0080ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0080ff] text-sm font-bold">4</span>
                  </div>
                  <span>You can navigate between questions using the question palette</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0080ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0080ff] text-sm font-bold">5</span>
                  </div>
                  <span>Ensure you have a stable internet connection before starting</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 py-3 bg-[#0080ff] text-white font-semibold rounded-xl hover:bg-[#006be6] transition-colors"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen (Handler Submit UI)
  if (isSubmitted) {
    const results = calculateResults();
    
    return (
      <div className="fixed inset-0 bg-[#0080ff] z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                results.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {results.passed ? (
                  <Award size={28} className="text-green-600" />
                ) : (
                  <AlertCircle size={28} className="text-red-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Completed</h1>
                <p className="text-gray-600">Review your performance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Results Summary */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Card */}
              <div className="lg:col-span-2">
                <div className="bg-[#0080ff]/10 border-2 border-[#0080ff]/20 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Score</h2>
                    <div className="relative inline-block">
                      <div className={`text-6xl font-bold ${
                        results.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {results.score.toFixed(1)}%
                      </div>
                      <div className={`text-lg font-semibold mt-2 ${
                        results.passed ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {results.passed ? 'PASSED 🎉' : 'TRY AGAIN'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Passing Score: {config.passingScore}%</span>
                        <span>{results.score.toFixed(1)}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            results.passed ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(results.score, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Correct Answers</span>
                        <span>{results.correctCount}/{results.totalQuestions}</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0080ff] rounded-full transition-all duration-1000"
                          style={{ width: `${(results.correctCount / results.totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Statistics</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Time Spent</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.floor(results.timeSpent / 60)}:{String(results.timeSpent % 60).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {((results.correctCount / results.totalQuestions) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Flagged Questions</div>
                    <div className="text-2xl font-bold text-gray-900">{flaggedQuestions.size}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">Question Review</h3>
                  <button
                    onClick={() => setShowExplanations(!showExplanations)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0080ff] transition-colors"
                  >
                    {showExplanations ? <ToggleRight size={20} className="text-[#0080ff]" /> : <ToggleLeft size={20} />}
                    AI Explanations
                  </button>
                </div>
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="flex items-center gap-2 text-[#0080ff] hover:text-[#0052b3] transition-colors"
                >
                  <BarChart3 size={20} />
                  {showReview ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {showReview && (
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correctAnswerIndex;
                    const isFlagged = flaggedQuestions.has(index);
                    const explanation = explanations[index];
                    const isLoadingExplanation = loadingExplanations.has(index);
                    
                    // Fetch explanation for wrong answers when toggle is on
                    const fetchExplanation = async () => {
                      if (explanation || isLoadingExplanation || isCorrect) return;
                      
                      setLoadingExplanations(prev => new Set(prev).add(index));
                      try {
                        const userAnswerText = question.options?.[userAnswer] || '';
                        const correctAnswerText = question.options?.[question.correctAnswerIndex] || '';
                        const response = await api.explainWrongAnswer(question.question, userAnswerText, correctAnswerText);
                        setExplanations(prev => ({ ...prev, [index]: response.explanation.explanation }));
                      } catch (error) {
                        console.error('Failed to fetch explanation:', error);
                        // Provide helpful fallback instead of generic error
                        const correctAnswerText = question.options?.[question.correctAnswerIndex] || '';
                        setExplanations(prev => ({ 
                          ...prev, 
                          [index]: `The correct answer is "${correctAnswerText}". Review this topic in the course materials for a deeper understanding.` 
                        }));
                      } finally {
                        setLoadingExplanations(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(index);
                          return newSet;
                        });
                      }
                    };
                    
                    // Trigger fetch when showExplanations is enabled for wrong answers
                    if (showExplanations && !isCorrect && !explanation && !isLoadingExplanation && userAnswer !== -1) {
                      fetchExplanation();
                    }
                    
                    return (
                      <div
                        key={question.id}
                        className={`border rounded-xl p-4 transition-colors ${
                          isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-900">
                              Question {index + 1}
                            </span>
                            {isFlagged && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                <Flag size={10} />
                                Flagged
                              </span>
                            )}
                          </div>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        
                        <p className="text-gray-800 mb-3">{question.question}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options?.map((option, optIndex) => {
                            const isSelected = userAnswer === optIndex;
                            const isCorrectOption = optIndex === question.correctAnswerIndex;
                            
                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isSelected && !isCorrect
                                    ? 'border-red-300 bg-red-100'
                                    : isCorrectOption
                                    ? 'border-green-300 bg-green-100'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#0080ff] bg-[#0080ff] text-white'
                                      : isCorrectOption
                                      ? 'border-green-500 bg-green-500 text-white'
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && !isCorrect && '✗'}
                                    {isCorrectOption && '✓'}
                                  </div>
                                  <span className="text-gray-800">{option}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* AI Explanation for wrong answers */}
                        {!isCorrect && showExplanations && (
                          <div className="mt-4 p-3 bg-[#0080ff]/5 border border-[#0080ff]/20 rounded-lg">
                            <div className="flex items-center gap-2 text-[#0080ff] font-medium mb-1">
                              <HelpCircle size={16} />
                              AI Explanation
                            </div>
                            {isLoadingExplanation ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Loader2 size={14} className="animate-spin" />
                                Loading explanation...
                              </div>
                            ) : (
                              <p className="text-sm text-gray-700">{explanation || 'No explanation available.'}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#0080ff] text-white font-semibold rounded-xl hover:bg-[#006be6] transition-colors"
                >
                  Return to Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main test interface
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close test"
          >
            <X size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {tabSwitchCount > 0 && (
  <div className="text-sm font-semibold text-red-600">
    Tab switches: {tabSwitchCount}/3
  </div>
)}

          {/* Real-time Explanation Toggle - Module tests only */}
          {isModuleTest && (
            <button
              onClick={() => setRealTimeExplanations(!realTimeExplanations)}
              className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-[#0080ff] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#0080ff]/5"
            >
              {realTimeExplanations ? <ToggleRight size={20} className="text-[#0080ff]" /> : <ToggleLeft size={20} />}
              <span className="font-medium">Real-time Hints</span>
            </button>
          )}
          
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#0080ff]" />
            <div className="text-lg font-mono font-bold">
              <span className={timeLeft <= 300 ? 'text-red-600 animate-pulse' : 'text-gray-900'}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          {/* Progress */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0080ff] rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Question Palette */}
        <div className="w-16 lg:w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 hidden lg:block">
              Questions
            </h3>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const status = getQuestionStatus(index);
                const isFlagged = flaggedQuestions.has(index);
                
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`relative w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      index === currentQuestionIndex
                        ? 'ring-2 ring-[#0080ff] bg-[#0080ff] text-white'
                        : status === 'unanswered'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : status === 'answered'
                        ? 'bg-[#0080ff]/10 text-[#0080ff] hover:bg-[#0080ff]/20'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1">
                        <Flag size={12} className="text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Stats */}
            <div className="mt-6 hidden lg:block">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Answered</span>
                  <span className="font-semibold text-[#0080ff]">
                    {answers.filter(a => a !== -1).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Flagged</span>
                  <span className="font-semibold text-yellow-600">
                    {flaggedQuestions.size}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time/Question</span>
                  <span className="font-semibold text-gray-900">
                    {answerTimes[currentQuestionIndex] || 0}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto select-none">
          <div className="max-w-3xl mx-auto p-6 lg:p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6 select-none">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-[#0080ff]/10 text-[#0080ff] rounded-full text-sm font-semibold">
                  Question {currentQuestionIndex + 1}
                </div>
                <button
                  onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestionIndex)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label={flaggedQuestions.has(currentQuestionIndex) ? 'Unflag question' : 'Flag question'}
                >
                  <Flag size={18} className={flaggedQuestions.has(currentQuestionIndex) ? 'fill-current' : ''} />
                </button>
              </div>
              
              {currentQuestion.timeEstimate && (
                <div className="text-sm text-gray-500">
                  Suggested time: {currentQuestion.timeEstimate}s
                </div>
              )}
            </div>

            {/* Question */}
            <div className="mb-8 select-none">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.codeSnippet && (
                <div className="mt-6 bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-gray-200 font-mono text-sm">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4 select-none">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    answers[currentQuestionIndex] === index
                      ? 'border-[#0080ff] bg-[#0080ff]/5'
                      : 'border-gray-200 hover:border-[#0080ff]/50 hover:bg-[#0080ff]/2'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestionIndex] === index
                        ? 'border-[#0080ff] bg-[#0080ff]'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestionIndex] === index && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-gray-800 text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Real-time Explanation Display - Module tests only */}
            {isModuleTest && realTimeExplanations && answers[currentQuestionIndex] !== -1 && 
             answers[currentQuestionIndex] !== currentQuestion.correctAnswerIndex && (
              <div className="mt-6 p-4 bg-[#0080ff]/5 border border-[#0080ff]/20 rounded-xl">
                <div className="flex items-center gap-2 text-[#0080ff] font-medium mb-2">
                  <HelpCircle size={18} />
                  AI Explanation
                </div>
                {loadingExplanations.has(currentQuestionIndex) ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 size={14} className="animate-spin" />
                    Loading explanation...
                  </div>
                ) : explanations[currentQuestionIndex] ? (
                  <p className="text-sm text-gray-700 leading-relaxed">{explanations[currentQuestionIndex]}</p>
                ) : (
                  <p className="text-sm text-gray-500">Explanation not available.</p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const confirmExit = window.confirm('Are you sure you want to leave the test? Your progress will be saved.');
                      if (confirmExit) onClose();
                    }}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Save & Exit
                  </button>
                  
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={goToNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 bg-[#0080ff] text-white font-medium rounded-xl hover:bg-[#006be6] transition-colors"
                    >
                      Next Question
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-8 py-3 bg-[#0080ff] text-white font-semibold rounded-xl hover:bg-[#006be6] transition-colors"
                    >
                      <Award size={20} />
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenTest;