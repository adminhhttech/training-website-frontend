import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EditSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function EditSection({ title, icon, children, defaultOpen = false }: EditSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    
    if (willOpen && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <div ref={sectionRef} className="border-b border-border last:border-b-0">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <ChevronRight
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

interface EditItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

export function EditItem({ children, onDelete, className }: EditItemProps) {
  return (
    <div className={cn("relative p-3 bg-muted/30 rounded-lg mb-2 group", className)}>
      <div className="flex gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab flex-shrink-0 mt-1" />
        <div className="flex-1">{children}</div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export function AddButton({ onClick, label }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-muted-foreground/20 rounded-lg text-muted-foreground hover:border-accent hover:text-accent transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
