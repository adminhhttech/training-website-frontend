

// Filename: src/components/TestLoadingState.tsx
import React from 'react';
import { Loader2, RefreshCw, AlertCircle, Brain, ArrowLeft } from 'lucide-react';

interface TestLoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onCancel?: () => void;
  testType: 'module' | 'final' | 'aptitude' | 'softskills';
  moduleIndex?: number;
}

// Get user-friendly error message based on error type
const getErrorMessage = (error: string): { title: string; message: string } => {
  if (error.includes('Invalid JSON') || error.includes('500')) {
    return {
      title: 'AI Generation Issue',
      message: 'The AI had trouble generating questions. This sometimes happens with complex topics. Click retry for a fresh attempt.'
    };
  }
  if (error.includes('network') || error.includes('fetch') || error.includes('Failed to fetch')) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.'
    };
  }
  if (error.includes('empty')) {
    return {
      title: 'No Questions Generated',
      message: 'The AI couldn\'t generate questions for this topic. Click retry to try again.'
    };
  }
  return {
    title: 'Failed to Load Test',
    message: error
  };
};

export const TestLoadingState: React.FC<TestLoadingStateProps> = ({
  isLoading,
  error,
  onRetry,
  onCancel,
  testType,
  moduleIndex
}) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        {/* Back Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}
        
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-[#0080ff]/10 flex items-center justify-center mx-auto">
              <Brain size={40} className="text-[#0080ff]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={80} className="text-[#0080ff]/30 animate-spin" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Test
          </h2>
          <p className="text-gray-600 mb-4">
            {testType === 'module' 
              ? `Preparing Module ${(moduleIndex ?? 0) + 1} assessment questions...`
              : testType === 'final'
              ? 'Creating your final certification exam...'
              : testType === 'aptitude'
              ? 'Loading aptitude practice questions...'
              : 'Loading soft skills scenarios...'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            This may take a few seconds.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-[#0080ff]">
            <div className="w-2 h-2 rounded-full bg-[#0080ff] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#0080ff] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#0080ff] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const { title, message } = getErrorMessage(error);
    
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        {/* Back Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}
        
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0080ff] text-white font-semibold rounded-xl hover:bg-[#0080ff]/90 transition"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TestLoadingState;