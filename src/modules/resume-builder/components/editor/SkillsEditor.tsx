import { useResume } from '../../contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Wrench } from 'lucide-react';
import { EditSection, AddButton } from './EditSection';
import { Skill } from '../../types/resume';
import { SortableList } from '../../hooks/useDragAndDrop';

export function SkillsEditor() {
  const { resumeData, addSkill, updateSkill, removeSkill, reorderSkills } = useResume();
  const { skills } = resumeData;

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 80,
      category: '',
    };
    addSkill(newSkill);
  };

  return (
    <EditSection 
      title="Skills" 
      icon={<Wrench className="w-5 h-5 text-accent" />}
    >
      <div className="space-y-2">
        <SortableList 
          items={skills} 
          onReorder={reorderSkills}
          onDelete={removeSkill}
          renderItem={(skill) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="React, Python..."
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <Input
                    value={skill.category || ''}
                    onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                    placeholder="Frontend, Backend..."
                    className="mt-1 h-8"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">Proficiency Level</Label>
                  <span className="text-xs text-accent font-medium">{skill.level}%</span>
                </div>
                <Slider
                  value={[skill.level]}
                  onValueChange={([value]) => updateSkill(skill.id, { level: value })}
                  min={10}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        />
        <AddButton onClick={handleAddSkill} label="Add Skill" />
      </div>
    </EditSection>
  );
}
