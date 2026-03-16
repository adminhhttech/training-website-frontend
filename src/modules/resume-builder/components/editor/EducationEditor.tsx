import { useResume } from '../../contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import { EditSection, AddButton } from './EditSection';
import { Education } from '../../types/resume';
import { SortableList } from '../../hooks/useDragAndDrop';

export function EducationEditor() {
  const { resumeData, addEducation, updateEducation, removeEducation, reorderEducation } = useResume();
  const { education } = resumeData;

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    addEducation(newEdu);
  };

  return (
    <EditSection 
      title="Education" 
      icon={<GraduationCap className="w-5 h-5 text-accent" />}
    >
      <div className="space-y-2">
        <SortableList 
          items={education} 
          onReorder={reorderEducation}
          onDelete={removeEducation}
          renderItem={(edu) => (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="University name"
                  className="mt-1 h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Bachelor's, Master's..."
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    placeholder="Computer Science"
                    className="mt-1 h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Start Year</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    placeholder="2018"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">End Year</Label>
                  <Input
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    placeholder="2022"
                    className="mt-1 h-8"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-xs text-muted-foreground">GPA (Optional)</Label>
                  <Input
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                    placeholder="3.8"
                    className="mt-1 h-8"
                  />
                </div>
              </div>
            </div>
          )}
        />
        <AddButton onClick={handleAddEducation} label="Add Education" />
      </div>
    </EditSection>
  );
}
