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
  MeasuringStrategy,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onDelete?: () => void;
  isOver?: boolean;
  insertPosition?: 'before' | 'after' | null;
}

export function SortableItem({ id, children, onDelete, isOver, insertPosition }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
    active,
  } = useSortable({ id });

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
        "relative p-3 bg-muted/30 rounded-lg group transition-all duration-200",
        isDragging && "opacity-30 scale-[0.98] shadow-xl ring-2 ring-primary/30",
        isOver && insertPosition === 'before' && "before:content-[''] before:absolute before:left-0 before:right-0 before:-top-1 before:h-1 before:bg-primary before:rounded-full before:animate-pulse",
        isOver && insertPosition === 'after' && "after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-primary after:rounded-full after:animate-pulse"
      )}
    >
      <div className="flex gap-2">
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "flex-shrink-0 p-1.5 cursor-grab active:cursor-grabbing rounded-md transition-all duration-200",
            "text-muted-foreground/50 hover:text-primary hover:bg-primary/10",
            "touch-none select-none",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          type="button"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">{children}</div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded-md text-destructive focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/50"
            type="button"
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  onDelete?: (id: string) => void;
  className?: string;
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  onDelete,
  className,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [insertPosition, setInsertPosition] = React.useState<'before' | 'after' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // More responsive - start drag after 5px
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setOverId(null);
      setInsertPosition(null);
      return;
    }

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);
    
    setOverId(over.id as string);
    setInsertPosition(activeIndex < overIndex ? 'after' : 'before');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setInsertPosition(null);
    document.body.style.cursor = '';

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
    setInsertPosition(null);
    document.body.style.cursor = '';
  };

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={cn("space-y-2", className)}>
          {items.map((item, index) => (
            <SortableItem 
              key={item.id} 
              id={item.id}
              onDelete={onDelete ? () => onDelete(item.id) : undefined}
              isOver={overId === item.id}
              insertPosition={overId === item.id ? insertPosition : null}
            >
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeItem ? (
          <div className="bg-card border-2 border-primary shadow-2xl rounded-lg p-3 rotate-1 scale-105 transition-transform">
            <div className="flex items-center gap-2">
              <div className="p-1.5 text-primary">
                <Move className="w-4 h-4" />
              </div>
              <div className="flex-1 opacity-90">
                {renderItem(activeItem, items.findIndex((i) => i.id === activeItem.id))}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
