import { useEffect, useState } from 'react';
import { GenerationStep } from '../../types/ai-generation';
import { Sparkles, FileText, Briefcase, GraduationCap, Code, FolderOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationOverlayProps {
  isVisible: boolean;
  currentStep: GenerationStep;
}

const GENERATION_STEPS = [
  { id: 'generating-summary', label: 'Crafting Summary', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'generating-experience', label: 'Building Experience', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
  { id: 'generating-education', label: 'Adding Education', icon: GraduationCap, color: 'from-orange-500 to-amber-500' },
  { id: 'generating-skills', label: 'Highlighting Skills', icon: Code, color: 'from-green-500 to-emerald-500' },
  { id: 'generating-projects', label: 'Creating Projects', icon: FolderOpen, color: 'from-indigo-500 to-violet-500' },
  { id: 'complete', label: 'All Done!', icon: CheckCircle2, color: 'from-success to-accent' },
];

export function GenerationOverlay({ isVisible, currentStep }: GenerationOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentStepIndex = GENERATION_STEPS.findIndex(s => s.id === currentStep);
  const targetProgress = currentStep === 'complete' ? 100 : ((currentStepIndex + 1) / GENERATION_STEPS.length) * 100;

  useEffect(() => {
    if (isVisible && currentStep !== 'idle') {
      const timer = setInterval(() => {
        setProgress(prev => {
          const diff = targetProgress - prev;
          if (Math.abs(diff) < 0.5) return targetProgress;
          return prev + diff * 0.1;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isVisible, targetProgress, currentStep]);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setShowConfetti(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (currentStep === 'complete') {
      setShowConfetti(true);
    }
  }, [currentStep]);

  if (!isVisible || currentStep === 'idle') return null;

  const currentStepData = GENERATION_STEPS.find(s => s.id === currentStep) || GENERATION_STEPS[0];
  const CurrentIcon = currentStepData.icon;

  return (
    <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative bg-card border-2 rounded-3xl p-8 shadow-heavy max-w-md w-full animate-scale-in">
        {/* Sparkle decoration */}
        <div className="absolute -top-3 -right-3">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Main icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl opacity-50 bg-gradient-to-r",
              currentStepData.color
            )} />
            <div className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r shadow-lg",
              currentStepData.color
            )}>
              <CurrentIcon className="w-10 h-10 text-white" />
            </div>
            {currentStep !== 'complete' && (
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-heading font-bold text-center mb-2 text-foreground">
          {currentStep === 'complete' ? 'Resume Complete!' : 'Creating Your Resume'}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {currentStep === 'complete' 
            ? 'Your professional resume is ready to edit'
            : 'AI is building your professional profile...'
          }
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r",
                currentStepData.color
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Steps */}
        <div className="space-y-2">
          {GENERATION_STEPS.slice(0, -1).map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = currentStepIndex > index || currentStep === 'complete';
            
            return (
              <div 
                key={step.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all duration-300',
                  isActive && 'bg-muted shadow-sm',
                  isCompleted && !isActive && 'opacity-60'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0',
                  isActive && `bg-gradient-to-r ${step.color} text-white shadow-md`,
                  isCompleted && !isActive && 'bg-success/20 text-success',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}>
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={cn(
                  'text-sm font-medium flex-1',
                  isActive && 'text-foreground',
                  !isActive && 'text-muted-foreground'
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                {isCompleted && !isActive && (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                )}
              </div>
            );
          })}
        </div>

        {/* Complete state */}
        {currentStep === 'complete' && (
          <div className="mt-6 p-4 bg-success/10 rounded-xl border border-success/20 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-success font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              Your resume is ready!
            </div>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Click anywhere to start editing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
