import { Loader2, Sparkles, FileText, Briefcase, GraduationCap, Code, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface GeneratingBlurOverlayProps {
  isVisible: boolean;
  currentSection?: string;
}

const GENERATION_STEPS = [
  { id: 'summary', label: 'Crafting Summary', icon: FileText },
  { id: 'experience', label: 'Building Experience', icon: Briefcase },
  { id: 'education', label: 'Adding Education', icon: GraduationCap },
  { id: 'skills', label: 'Highlighting Skills', icon: Code },
  { id: 'projects', label: 'Creating Projects', icon: Sparkles },
];

export function GeneratingBlurOverlay({ isVisible, currentSection }: GeneratingBlurOverlayProps) {
  const [dots, setDots] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Animate dots
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Auto-advance steps for visual feedback
  useEffect(() => {
    if (!isVisible) {
      setCurrentStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % GENERATION_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStep = GENERATION_STEPS[currentStepIndex];
  const CurrentIcon = currentStep.icon;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Frosted glass blur overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-spin-slow" />
      </div>
      
      {/* Main content card */}
      <div className="relative z-10 bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        {/* Sparkle decoration */}
        <div className="absolute -top-4 -right-4">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg shadow-accent/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 w-24 h-24 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-primary rounded-full animate-spin" />
            
            {/* Inner icon */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                <CurrentIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-heading font-bold text-center mb-2 text-foreground">
          Building Your Resume{dots}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-8">
          AI is crafting your professional profile
        </p>

        {/* Progress steps */}
        <div className="space-y-2">
          {GENERATION_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all duration-300',
                  isActive && 'bg-primary/10 shadow-sm border border-primary/20',
                  isCompleted && 'opacity-60'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0',
                  isActive && 'bg-primary text-white shadow-md',
                  isCompleted && 'bg-success/20 text-success',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}>
                  {isCompleted ? (
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
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-xs text-center text-muted-foreground">
            💡 <span className="font-medium">Tip:</span> This usually takes 10-20 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
