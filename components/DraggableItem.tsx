import React from 'react';
import { useDrag } from 'react-dnd';
import { FileSystemItem } from '@/redux/slices/fileSystemSlice';

interface DraggableItemProps {
  item: FileSystemItem;
  children: React.ReactNode;
}

export default function DraggableItem({ item, children }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: item.id, type: item.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
}