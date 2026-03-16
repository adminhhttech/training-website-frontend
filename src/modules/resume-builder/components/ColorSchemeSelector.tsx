import { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorSchemeSelectorProps {
  children?: React.ReactNode;
}

export function ColorSchemeSelector({ children }: ColorSchemeSelectorProps) {
  const { settings, setColorScheme, colorSchemes } = useResume();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className="gap-2 text-header-foreground hover:bg-header/80">
            <Palette className="w-4 h-4" />
            Colours
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Choose a resume colour scheme</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 sm:space-y-3 mt-4">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => {
                setColorScheme(scheme);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg transition-all hover:border-accent",
                settings.colorScheme.id === scheme.id ? "border-accent bg-accent/5" : "border-border"
              )}
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded" style={{ backgroundColor: scheme.primary }} />
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded" style={{ backgroundColor: scheme.secondary }} />
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded" style={{ backgroundColor: scheme.accent }} />
                </div>
                <span className="font-medium text-sm sm:text-base">{scheme.name}</span>
              </div>
              {settings.colorScheme.id === scheme.id && (
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
