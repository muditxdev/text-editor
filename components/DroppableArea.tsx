import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { moveItem } from '@/redux/slices/fileSystemSlice';

interface DroppableAreaProps {
  id: string | null; // null for root area
  children: React.ReactNode;
  className?: string;
}

export default function DroppableArea({ id, children, className = '' }: DroppableAreaProps) {
  const dispatch = useDispatch();
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: { id: string, type: 'file' | 'folder' }) => {
      if (item.id !== id) { // Prevent dropping onto itself
        dispatch(moveItem({ itemId: item.id, newParentId: id }));
      }
      return { id };
    },
    canDrop: (item: { id: string }) => item.id !== id, // Can't drop onto itself
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [id]);

  return (
    <div 
      ref={drop} 
      className={`${className} ${isOver && canDrop ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
    >
      {children}
    </div>
  );
}