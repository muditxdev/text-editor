'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FileSystemItem } from '@/redux/slices/fileSystemSlice';

interface FileTreeProps {
  onFileSelect: (id: string) => void;
}

export default function FileTree({ onFileSelect }: FileTreeProps) {
  const { items, rootItems } = useSelector((state: RootState) => state.fileSystem);
  
  const renderItems = (parentId: string | null) => {
    const childItems = Object.values(items).filter(item => item.parentId === parentId);
    
    return childItems.map(item => {
      if (item.type === 'folder') {
        return (
          <div key={item.id}>
            <div className="folder-item">{item.name}</div>
            <div className="folder-children">
              {renderItems(item.id)}
            </div>
          </div>
        );
      } else {
        return (
          <div 
            key={item.id} 
            className="file-item"
            onClick={() => onFileSelect(item.id)}
          >
            {item.name}
          </div>
        );
      }
    });
  };
  
  return (
    <div className="file-tree">
      {renderItems(null)}
    </div>
  );
}