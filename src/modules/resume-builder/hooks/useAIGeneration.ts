import { useState, useCallback } from 'react';
import { AIGenerationInput, GenerationStep } from '../types/ai-generation';
import { ResumeData } from '../types/resume';
import { generateResumeWithAI } from '../services/mockAIService';

interface UseAIGenerationOptions {
  onSectionGenerated?: (section: string, data: Partial<ResumeData>) => void;
  onComplete?: (data: ResumeData) => void;
}

export function useAIGeneration(options: UseAIGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<GenerationStep>('idle');
  const [error, setError] = useState<string | null>(null);

  const stepMap: Record<string, GenerationStep> = {
    summary: 'generating-summary',
    experience: 'generating-experience',
    education: 'generating-education',
    skills: 'generating-skills',
    projects: 'generating-projects',
    certificates: 'generating-projects', // Group with projects
  };

  const generate = useCallback(async (input: AIGenerationInput) => {
    setIsGenerating(true);
    setError(null);
    setCurrentStep('generating-summary');

    try {
      const result = await generateResumeWithAI(input, (section, data) => {
        // Update the current step based on section
        const step = stepMap[section];
        if (step) {
          setCurrentStep(step);
        }
        
        // Call the callback to update the resume in real-time
        options.onSectionGenerated?.(section, data);
      });

      setCurrentStep('complete');
      
      // Brief delay to show complete state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      options.onComplete?.(result);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      throw err;
    } finally {
      setIsGenerating(false);
      // Reset step after a delay
      setTimeout(() => setCurrentStep('idle'), 500);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setCurrentStep('idle');
    setError(null);
  }, []);

  return {
    generate,
    reset,
    isGenerating,
    currentStep,
    error,
  };
}
