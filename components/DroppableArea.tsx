import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { moveItem } from "@/redux/slices/fileSystemSlice";

interface DroppableAreaProps {
  id: string | null;
  children: React.ReactNode;
  className?: string;
}

interface DragItem {
  id: string;
  type: "file" | "folder";
}

interface CollectedProps {
  isOver: boolean;
  canDrop: boolean;
}

export default function DroppableArea({
  id,
  children,
  className = "",
}: DroppableAreaProps) {
  const dispatch = useDispatch();
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    { id: string | null },
    CollectedProps
  >(
    () => ({
      accept: "ITEM",
      drop: (item) => {
        if (item.id !== id) {
          dispatch(moveItem({ itemId: item.id, newParentId: id }));
        }
        return { id };
      },
      canDrop: (item) => item.id !== id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [id]
  );

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`${className} ${
        isOver && canDrop ? "bg-blue-100 dark:bg-blue-900/30" : ""
      }`}
    >
      {children}
    </div>
  );
}
