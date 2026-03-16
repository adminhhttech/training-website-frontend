import { useResume } from '../contexts/ResumeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SectionKey } from '../types/resume';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderOpen, 
  Award, 
  Globe, 
  Medal,
  Eye
} from 'lucide-react';

const sections: { key: SectionKey; label: string; icon: typeof User }[] = [
  { key: 'summary', label: 'Summary', icon: User },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'skills', label: 'Skills', icon: Wrench },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'awards', label: 'Awards', icon: Medal },
];

export function SectionVisibility() {
  const { settings, toggleSectionVisibility } = useResume();
  const visibleSections = settings.visibleSections || {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certificates: true,
    awards: true,
  };

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-4 h-4 text-accent" />
        <h3 className="font-medium text-sm text-foreground">Section Visibility</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Toggle sections to fit your resume on one page
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
        {sections.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
              <Label htmlFor={`section-${key}`} className="text-[11px] sm:text-xs font-normal cursor-pointer">
                {label}
              </Label>
            </div>
            <Switch
              id={`section-${key}`}
              checked={visibleSections[key]}
              onCheckedChange={() => toggleSectionVisibility(key)}
              className="scale-[0.65] sm:scale-75"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
