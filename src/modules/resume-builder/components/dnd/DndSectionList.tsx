import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from "../../lib/utils";
import { SectionKey } from "../../types/resume";


interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SortableSection({ id, children, disabled }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group border-b border-border last:border-b-0",
        isDragging && "opacity-50 bg-muted/50"
      )}
    >
      {!disabled && (
        <button
          {...attributes}
          {...listeners}
          className="absolute left-2 top-4 p-1 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-all z-10 touch-none"
          type="button"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  );
}

interface SectionItem {
  id: SectionKey | 'personalInfo';
  component: React.ReactNode;
}

interface SectionListProps {
  sections: SectionItem[];
  onReorder: (sectionIds: (SectionKey | 'personalInfo')[]) => void;
}

export function DndSectionList({ sections, onReorder }: SectionListProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(sections, oldIndex, newIndex).map((s) => s.id);
      onReorder(newOrder);
    }
  };

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={sections.map((s) => s.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div>
          {sections.map((section) => (
            <SortableSection 
              key={section.id} 
              id={section.id}
              disabled={section.id === 'personalInfo'}
            >
              {section.component}
            </SortableSection>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeSection ? (
          <div className="bg-card border border-border shadow-xl rounded-lg opacity-95">
            {activeSection.component}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
