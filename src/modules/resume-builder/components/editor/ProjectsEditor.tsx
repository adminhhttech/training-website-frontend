import { useResume } from '../../contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FolderOpen } from 'lucide-react';
import { EditSection, AddButton } from './EditSection';
import { Project } from '../../types/resume';
import { SortableList } from '../../hooks/useDragAndDrop';

export function ProjectsEditor() {
  const { resumeData, addProject, updateProject, removeProject, reorderProjects } = useResume();
  const { projects } = resumeData;

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    addProject(newProject);
  };

  const handleTechChange = (projectId: string, value: string) => {
    const technologies = value.split(',').map(t => t.trim()).filter(Boolean);
    updateProject(projectId, { technologies });
  };

  return (
    <EditSection 
      title="Projects" 
      icon={<FolderOpen className="w-5 h-5 text-accent" />}
    >
      <div className="space-y-2">
        <SortableList 
          items={projects} 
          onReorder={reorderProjects}
          onDelete={removeProject}
          renderItem={(project) => (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  placeholder="Project name"
                  className="mt-1 h-8"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder="Brief description of the project..."
                  className="mt-1 min-h-[60px]"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Technologies (comma-separated)</Label>
                <Input
                  value={project.technologies?.join(', ') || ''}
                  onChange={(e) => handleTechChange(project.id, e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  className="mt-1 h-8"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Link (Optional)</Label>
                <Input
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, { link: e.target.value })}
                  placeholder="github.com/username/project"
                  className="mt-1 h-8"
                />
              </div>
            </div>
          )}
        />
        <AddButton onClick={handleAddProject} label="Add Project" />
      </div>
    </EditSection>
  );
}
