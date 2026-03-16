import { useResume } from '../contexts/ResumeContext';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreItem {
  label: string;
  completed: boolean;
  weight: number;
}

export function ResumeScore() {
  const { resumeData } = useResume();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  const scoreItems: ScoreItem[] = [
    { label: 'Full name added', completed: !!personalInfo.fullName.trim(), weight: 10 },
    { label: 'Job title added', completed: !!personalInfo.title.trim(), weight: 8 },
    { label: 'Contact email', completed: !!personalInfo.email.trim(), weight: 10 },
    { label: 'Phone number', completed: !!personalInfo.phone.trim(), weight: 8 },
    { label: 'Location added', completed: !!personalInfo.location.trim(), weight: 5 },
    { label: 'Profile photo', completed: !!personalInfo.photo, weight: 5 },
    { label: 'Professional summary', completed: !!personalInfo.summary.trim() && personalInfo.summary.length >= 50, weight: 12 },
    { label: 'LinkedIn profile', completed: !!personalInfo.linkedin?.trim(), weight: 5 },
    { label: 'At least 1 experience', completed: experience.length >= 1 && !!experience[0]?.company.trim(), weight: 12 },
    { label: 'At least 2 experiences', completed: experience.length >= 2 && !!experience[1]?.company.trim(), weight: 5 },
    { label: 'Education added', completed: education.length >= 1 && !!education[0]?.institution.trim(), weight: 10 },
    { label: 'At least 3 skills', completed: skills.filter(s => s.name.trim()).length >= 3, weight: 5 },
    { label: 'At least 5 skills', completed: skills.filter(s => s.name.trim()).length >= 5, weight: 5 },
  ];

  const totalWeight = scoreItems.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = scoreItems.reduce((sum, item) => item.completed ? sum + item.weight : sum, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-accent';
    return 'text-destructive';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const incompleteTasks = scoreItems.filter(item => !item.completed);

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-foreground">Resume Score</h3>
        <span className={cn("text-2xl font-bold", getScoreColor())}>
          {score}%
        </span>
      </div>
      
      <Progress value={score} className="h-2 mb-2" />
      
      <p className={cn("text-xs font-medium mb-4", getScoreColor())}>
        {getScoreLabel()}
      </p>

      {incompleteTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Suggestions to improve:</p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {incompleteTasks.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Circle className="w-3 h-3 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          {incompleteTasks.length > 5 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{incompleteTasks.length - 5} more suggestions
            </p>
          )}
        </div>
      )}

      {score === 100 && (
        <div className="flex items-center gap-2 text-success text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Your resume is complete!</span>
        </div>
      )}
    </div>
  );
}
