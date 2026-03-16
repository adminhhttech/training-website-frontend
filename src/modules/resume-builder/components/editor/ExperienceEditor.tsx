import { useResume } from '../../contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase } from 'lucide-react';
import { EditSection, AddButton } from './EditSection';
import { Experience } from '../../types/resume';
import { SortableList } from '../../hooks/useDragAndDrop';

export function ExperienceEditor() {
  const { resumeData, addExperience, updateExperience, removeExperience, reorderExperience } = useResume();
  const { experience } = resumeData;

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    addExperience(newExp);
  };

  const handleDescriptionChange = (expId: string, index: number, value: string) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp) return;
    const newDesc = [...exp.description];
    newDesc[index] = value;
    updateExperience(expId, { description: newDesc });
  };

  const handleAddDescription = (expId: string) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp) return;
    updateExperience(expId, { description: [...exp.description, ''] });
  };

  const handleRemoveDescription = (expId: string, index: number) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp || exp.description.length <= 1) return;
    const newDesc = exp.description.filter((_, i) => i !== index);
    updateExperience(expId, { description: newDesc });
  };

  return (
    <EditSection 
      title="Experience" 
      icon={<Briefcase className="w-5 h-5 text-accent" />}
    >
      <div className="space-y-2">
        <SortableList 
          items={experience} 
          onReorder={reorderExperience}
          onDelete={removeExperience}
          renderItem={(exp) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="Company name"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    placeholder="Job title"
                    className="mt-1 h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Location</Label>
                <Input
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  placeholder="City, Country"
                  className="mt-1 h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    placeholder="Jan 2020"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    placeholder="Present"
                    disabled={exp.current}
                    className="mt-1 h-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => 
                    updateExperience(exp.id, { 
                      current: !!checked, 
                      endDate: checked ? 'Present' : '' 
                    })
                  }
                />
                <Label htmlFor={`current-${exp.id}`} className="text-xs text-muted-foreground">
                  Currently working here
                </Label>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Description / Achievements</Label>
                <div className="space-y-2 mt-1">
                  {exp.description.map((desc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={desc}
                        onChange={(e) => handleDescriptionChange(exp.id, index, e.target.value)}
                        placeholder="Describe your achievement..."
                        className="h-8"
                      />
                      {exp.description.length > 1 && (
                        <button
                          onClick={() => handleRemoveDescription(exp.id, index)}
                          className="text-xs text-destructive hover:underline"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddDescription(exp.id)}
                    className="text-xs text-accent hover:underline"
                  >
                    + Add bullet point
                  </button>
                </div>
              </div>
            </div>
          )}
        />
        <AddButton onClick={handleAddExperience} label="Add Experience" />
      </div>
    </EditSection>
  );
}
