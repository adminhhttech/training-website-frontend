// hooks/useAIMockTest.ts

import { useState, useCallback } from 'react';
import { 
  generateModuleTest, 
  generateFinalTest, 
  getExplanation,
  clearTestFromCache,
  GeneratedTestResult 
} from '@/services/AIMockTestService';

interface UseAIMockTestState {
  isLoading: boolean;
  error: string | null;
  currentTest: GeneratedTestResult | null;
}

export function useAIMockTest() {
  const [state, setState] = useState<UseAIMockTestState>({
    isLoading: false,
    error: null,
    currentTest: null
  });

  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExplanation, setLoadingExplanation] = useState<string | null>(null);

  const loadModuleTest = useCallback(async (
    moduleIndex: number, 
    moduleTopic: string,
    forceRefresh: boolean = false
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log(`[useAIMockTest] Loading module test ${moduleIndex}: ${moduleTopic}`);
      const result = await generateModuleTest(moduleIndex, moduleTopic, forceRefresh);
      console.log(`[useAIMockTest] Successfully loaded test with ${result.questions.length} questions`);
      setState({ isLoading: false, error: null, currentTest: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load test';
      console.error(`[useAIMockTest] Error loading test:`, error);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const loadFinalTest = useCallback(async (
    courseTitle: string, 
    moduleTitles: string[],
    forceRefresh: boolean = false
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log(`[useAIMockTest] Loading final certification test`);
      const result = await generateFinalTest(courseTitle, moduleTitles, forceRefresh);
      console.log(`[useAIMockTest] Successfully loaded test with ${result.questions.length} questions`);
      setState({ isLoading: false, error: null, currentTest: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load test';
      console.error(`[useAIMockTest] Error loading test:`, error);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const fetchExplanation = useCallback(async (
    questionId: string,
    question: string,
    userAnswer: string,
    correctAnswer: string
  ) => {
    // Return cached explanation if available
    if (explanations[questionId]) {
      return explanations[questionId];
    }

    setLoadingExplanation(questionId);

    try {
      const explanation = await getExplanation(question, userAnswer, correctAnswer);
      setExplanations(prev => ({ ...prev, [questionId]: explanation }));
      return explanation;
    } finally {
      setLoadingExplanation(null);
    }
  }, [explanations]);

  const retryTest = useCallback(async (
    type: 'module' | 'final',
    moduleIndex?: number,
    moduleTopic?: string,
    courseTitle?: string,
    moduleTitles?: string[]
  ) => {
    // Clear cache for this test
    if (type === 'module' && moduleIndex !== undefined) {
      clearTestFromCache(`module-${moduleIndex}`);
      if (moduleTopic) {
        return loadModuleTest(moduleIndex, moduleTopic);
      }
    } else if (type === 'final') {
      clearTestFromCache('final-certification');
      if (courseTitle && moduleTitles) {
        return loadFinalTest(courseTitle, moduleTitles);
      }
    }
  }, [loadModuleTest, loadFinalTest]);

  const clearTest = useCallback(() => {
    setState({ isLoading: false, error: null, currentTest: null });
    setExplanations({});
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    explanations,
    loadingExplanation,
    loadModuleTest,
    loadFinalTest,
    fetchExplanation,
    retryTest,
    clearTest,
    clearError
  };
}

export default useAIMockTest;
