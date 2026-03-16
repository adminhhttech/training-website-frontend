// services/AIMockTestService.ts

import { api, AIQuestion, APIError } from './api';
import { TestQuestion, TestConfig } from '@/components/FullScreenTest';

// Cache with timestamp for expiry
interface CachedTest {
  config: TestConfig;
  questions: TestQuestion[];
  timestamp: number;
}

const testCache: Map<string, CachedTest> = new Map();

// Cache expiry: 30 minutes
const CACHE_EXPIRY_MS = 30 * 60 * 1000;

// Check if cached test is still valid
function isCacheValid(cached: CachedTest): boolean {
  return Date.now() - cached.timestamp < CACHE_EXPIRY_MS;
}

export interface GeneratedTestResult {
  config: TestConfig;
  questions: TestQuestion[];
}

// Custom error class for user-facing errors
export class TestGenerationError extends Error {
  constructor(
    message: string,
    public userMessage: string,
    public shouldRetry: boolean = true,
    public originalError?: any
  ) {
    super(message);
    this.name = 'TestGenerationError';
  }
}

/**
 * Transform AI-generated question to app format
 */
function transformQuestion(aiQuestion: AIQuestion, index: number): TestQuestion {
  const correctAnswerIndex = aiQuestion.options.findIndex(
    opt => opt === aiQuestion.correct_answer
  );

  return {
    id: `ai-q-${aiQuestion.id}-${index}`,
    type: 'mcq',
    question: aiQuestion.question,
    options: aiQuestion.options,
    correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
    explanation: '', // Will be fetched on demand via AI
    timeEstimate: 45
  };
}

/**
 * Handle API errors and convert to user-friendly messages
 */
function handleTestGenerationError(error: any, context: string): never {
  console.error(`[AIMockTest] Error in ${context}:`, error);
  
  if (error instanceof APIError) {
    // Backend returned an error
    throw new TestGenerationError(
      `API Error: ${error.message}`,
      error.message,
      error.status !== 400, // Don't retry on bad requests
      error
    );
  }
  
  if (error instanceof TestGenerationError) {
    // Already a user-facing error
    throw error;
  }
  
  // Unknown error
  throw new TestGenerationError(
    `Unknown error in ${context}: ${error.message}`,
    'An unexpected error occurred while generating the test. Please try again.',
    true,
    error
  );
}

/**
 * Generate a module test using the AI API
 * No fallback to sample data - throws error if API fails
 */
export async function generateModuleTest(
  moduleIndex: number,
  moduleTopic: string,
  forceRefresh: boolean = false
): Promise<GeneratedTestResult> {
  const cacheKey = `module-${moduleIndex}`;
  
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = testCache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      console.log(`[AIMockTest] Using cached test for module ${moduleIndex} (expires in ${Math.round((CACHE_EXPIRY_MS - (Date.now() - cached.timestamp)) / 60000)} min)`);
      return { config: cached.config, questions: cached.questions };
    } else if (cached) {
      console.log(`[AIMockTest] Cache expired for module ${moduleIndex}, regenerating...`);
      testCache.delete(cacheKey);
    }
  }

  console.log(`[AIMockTest] Calling AI API for module test: ${moduleTopic}`);
  
  try {
    // Call AI API - no fallback
    const aiTest = await api.generateMockTest(moduleTopic, 10);
    
    console.log(`[AIMockTest] API Response:`, aiTest);
    
    if (!aiTest || !aiTest.questions || aiTest.questions.length === 0) {
      throw new TestGenerationError(
        'Empty test data received',
        'The AI service returned no questions. Please try again or contact support if the issue persists.',
        true
      );
    }
    
    const config: TestConfig = {
      id: `module-${moduleIndex + 1}-test`,
      title: `Module ${moduleIndex + 1}: ${moduleTopic.split(' - ')[0]}`,
      type: 'module',
      questionCount: aiTest.questions.length,
      timeLimit: 30,
      passingScore: 70,
      instructions: [
        'Read each question carefully before answering',
        'You can flag questions to review later',
        'The test will auto-submit when time expires',
        'Ensure you have a stable internet connection'
      ]
    };

    const questions = aiTest.questions.map((q, i) => transformQuestion(q, i));
    
    console.log(`[AIMockTest] Generated ${questions.length} questions for module ${moduleIndex}`);
    
    // Store with timestamp
    testCache.set(cacheKey, { config, questions, timestamp: Date.now() });
    
    return { config, questions };
  } catch (error) {
    // Clear any stale cache on error
    testCache.delete(cacheKey);
    handleTestGenerationError(error, 'generateModuleTest');
  }
}

/**
 * Generate the final certification test using the AI API
 * No fallback to sample data - throws error if API fails
 */
export async function generateFinalTest(
  courseTitle: string,
  moduleTitles: string[],
  forceRefresh: boolean = false
): Promise<GeneratedTestResult> {
  const cacheKey = 'final-certification';
  
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = testCache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      console.log(`[AIMockTest] Using cached final certification test (expires in ${Math.round((CACHE_EXPIRY_MS - (Date.now() - cached.timestamp)) / 60000)} min)`);
      return { config: cached.config, questions: cached.questions };
    } else if (cached) {
      console.log(`[AIMockTest] Cache expired for final certification, regenerating...`);
      testCache.delete(cacheKey);
    }
  }

  const topic = `${courseTitle} comprehensive exam covering: ${moduleTitles.join('; ')}`;
  
  console.log(`[AIMockTest] Calling AI API for final test: ${topic}`);
  
  try {
    // Call AI API - no fallback
    const aiTest = await api.generateMockTest(topic, 20);
    
    console.log(`[AIMockTest] API Response:`, aiTest);
    
    if (!aiTest || !aiTest.questions || aiTest.questions.length === 0) {
      throw new TestGenerationError(
        'Empty test data received',
        'The AI service returned no questions for the final certification. Please try again or contact support if the issue persists.',
        true
      );
    }
    
    const config: TestConfig = {
      id: 'final-certification',
      title: `Final Certification: ${courseTitle}`,
      type: 'final',
      questionCount: aiTest.questions.length,
      timeLimit: 60,
      passingScore: 75,
      instructions: [
        'Comprehensive exam covering all course modules',
        'Mix of theory, coding, and scenario-based questions',
        'Passing score required for course certificate',
        'Recommended to complete all modules before attempting'
      ]
    };

    const questions = aiTest.questions.map((q, i) => transformQuestion(q, i));
    
    console.log(`[AIMockTest] Generated ${questions.length} questions for final certification`);
    
    // Store with timestamp
    testCache.set(cacheKey, { config, questions, timestamp: Date.now() });
    
    return { config, questions };
  } catch (error) {
    // Clear any stale cache on error
    testCache.delete(cacheKey);
    handleTestGenerationError(error, 'generateFinalTest');
  }
}

/**
 * Get explanation for a wrong answer using AI
 */
export async function getExplanation(
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<string> {
  try {
    const response = await api.explainWrongAnswer(question, userAnswer, correctAnswer);
    return response.explanation.explanation;
  } catch (error) {
    console.error('Failed to get explanation:', error);
    
    // Provide a helpful fallback message based on error type
    if (error instanceof APIError) {
      if (error.status === 500) {
        return `Unable to generate explanation at this time due to a server issue. The correct answer is "${correctAnswer}". Review this topic in the course materials for a deeper understanding.`;
      }
    }
    
    return `The correct answer is "${correctAnswer}". Review this topic in the course materials for a deeper understanding.`;
  }
}

/**
 * Clear test cache (useful for regenerating tests)
 */
export function clearTestCache(): void {
  testCache.clear();
}

/**
 * Clear specific test from cache
 */
export function clearTestFromCache(testKey: string): void {
  testCache.delete(testKey);
}

export default {
  generateModuleTest,
  generateFinalTest,
  getExplanation,
  clearTestCache,
  clearTestFromCache
};