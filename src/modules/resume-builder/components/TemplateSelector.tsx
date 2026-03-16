import { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESUME_TEMPLATES, TemplateId } from '../types/resume';

const templates: { id: TemplateId; name: string; description: string }[] = RESUME_TEMPLATES;

interface TemplateSelectorProps {
  children?: React.ReactNode;
}

export function TemplateSelector({ children }: TemplateSelectorProps) {
  const { settings, setTemplate } = useResume();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className="gap-2 text-header-foreground hover:bg-header/80">
            <LayoutTemplate className="w-4 h-4" />
            Templates ({templates.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Choose a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setTemplate(template.id);
                setOpen(false);
              }}
              className={cn(
                "relative p-2 sm:p-3 border-2 rounded-lg transition-all hover:border-accent",
                settings.template === template.id ? "border-accent bg-accent/5" : "border-border"
              )}
            >
              {settings.template === template.id && (
                <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              )}
              <div className="aspect-[3/4] bg-muted rounded mb-1.5 sm:mb-2 flex items-center justify-center overflow-hidden">
                <TemplatePreview templateId={template.id} />
              </div>
              <h3 className="font-medium text-[10px] sm:text-xs">{template.name}</h3>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5 line-clamp-2 hidden sm:block">{template.description}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TemplatePreview({ templateId }: { templateId: TemplateId }) {
  if (templateId === 'professional') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="h-6 bg-primary rounded mb-2" />
        <div className="space-y-1">
          <div className="h-2 bg-muted-foreground/20 rounded w-full" />
          <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
          <div className="h-2 bg-muted-foreground/20 rounded w-5/6" />
        </div>
      </div>
    );
  }
  if (templateId === 'modern') {
    return (
      <div className="w-full h-full flex text-xs">
        <div className="w-1/3 bg-primary h-full" />
        <div className="flex-1 p-2">
          <div className="h-4 bg-muted-foreground/20 rounded mb-2 w-3/4" />
          <div className="space-y-1">
            <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
            <div className="h-1.5 bg-muted-foreground/20 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }
  if (templateId === 'creative') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="flex gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg" />
          <div className="flex-1">
            <div className="h-3 bg-primary rounded w-1/2 mb-1" />
            <div className="h-2 bg-accent/50 rounded w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="col-span-2 space-y-1">
            <div className="h-2 bg-muted-foreground/20 rounded" />
            <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-muted-foreground/20 rounded" />
            <div className="h-2 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (templateId === 'executive') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="h-1 bg-accent rounded-full mb-1" />
        <div className="text-center mb-2">
          <div className="h-3 bg-primary rounded w-2/3 mx-auto mb-1" />
          <div className="h-2 bg-muted-foreground/30 rounded w-1/2 mx-auto" />
        </div>
        <div className="h-px bg-accent/30 mb-2" />
        <div className="grid grid-cols-3 gap-1">
          <div className="col-span-2 space-y-1">
            <div className="h-2 bg-muted-foreground/20 rounded" />
            <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-muted-foreground/20 rounded" />
            <div className="h-2 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (templateId === 'compact') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="text-center mb-1.5">
          <div className="h-3 bg-primary rounded w-2/3 mx-auto mb-0.5" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-1/3 mx-auto" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-5/6" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-4/5" />
        </div>
      </div>
    );
  }
  if (templateId === 'classic') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="border-t-2 border-b-2 border-primary py-1 mb-2 text-center">
          <div className="h-3 bg-primary rounded w-3/4 mx-auto" />
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-muted-foreground/20 rounded w-full" />
          <div className="h-2 bg-muted-foreground/20 rounded w-5/6" />
        </div>
      </div>
    );
  }
  if (templateId === 'tech') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="flex items-center gap-1 mb-2">
          <div className="w-1 h-6 bg-accent rounded" />
          <div>
            <div className="h-3 bg-primary rounded w-16 mb-0.5" />
            <div className="h-1.5 bg-muted-foreground/20 rounded w-12" />
          </div>
        </div>
        <div className="border-l-2 border-accent pl-2 space-y-1">
          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-4/5" />
        </div>
      </div>
    );
  }
  if (templateId === 'academic') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="text-center mb-2 pb-1 border-b-2 border-primary">
          <div className="h-3 bg-primary rounded w-2/3 mx-auto mb-0.5" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-1/2 mx-auto" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-4/5" />
        </div>
      </div>
    );
  }
  if (templateId === 'elegant') {
    return (
      <div className="w-full h-full p-2 text-xs">
        <div className="text-center mb-2">
          <div className="h-3 bg-primary rounded w-2/3 mx-auto mb-0.5" />
          <div className="h-0.5 w-8 bg-accent mx-auto rounded" />
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-px flex-1 bg-muted-foreground/20" />
          <div className="h-2 w-8 bg-primary rounded" />
          <div className="h-px flex-1 bg-muted-foreground/20" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-4/5 mx-auto" />
        </div>
      </div>
    );
  }
  // minimalist (default)
  return (
    <div className="w-full h-full p-2 text-xs">
      <div className="flex justify-between mb-2">
        <div className="space-y-1">
          <div className="h-4 bg-primary rounded w-16" />
          <div className="h-2 bg-accent/50 rounded w-12" />
        </div>
        <div className="space-y-0.5 text-right">
          <div className="h-1.5 bg-muted-foreground/20 rounded w-10" />
          <div className="h-1.5 bg-muted-foreground/20 rounded w-8" />
        </div>
      </div>
      <div className="h-px bg-accent mb-2" />
      <div className="space-y-1">
        <div className="h-2 bg-muted-foreground/20 rounded w-full" />
        <div className="h-2 bg-muted-foreground/20 rounded w-5/6" />
        <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
      </div>
    </div>
  );
}
