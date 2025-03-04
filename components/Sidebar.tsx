'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  createFolder, 
  createFile, 
  toggleFolderExpanded,
  deleteItem,
  renameItem,
  FileSystemItem,
  FolderItem,
  FileItem
} from '@/redux/slices/fileSystemSlice';
import { openFile } from '@/redux/slices/editorSlice';
import { FiFolder, FiFolderPlus, FiFile, FiFilePlus, FiChevronDown, FiChevronRight, FiTrash, FiEdit } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from './DraggableItem';
import DroppableArea from './DroppableArea';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { items, rootItems } = useSelector((state: RootState) => state.fileSystem);
  const { activeFileId } = useSelector((state: RootState) => state.editor);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder' | null>(null);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    if (newItemType === 'folder') {
      dispatch(createFolder({ name: newItemName, parentId: newItemParentId }));
    } else if (newItemType === 'file') {
      dispatch(createFile({ name: newItemName, parentId: newItemParentId }));
    }
    
    setNewItemName('');
    setNewItemType(null);
    setNewItemParentId(null);
  };

  const handleRenameItem = () => {
    if (renamingItemId && newName.trim()) {
      dispatch(renameItem({ id: renamingItemId, newName }));
      setRenamingItemId(null);
      setNewName('');
    }
  };

  const handleDeleteItem = (id: string) => {
    dispatch(deleteItem(id));
  };

  const handleFileClick = (id: string) => {
    dispatch(openFile(id));
  };

  const handleFolderClick = (id: string) => {
    dispatch(toggleFolderExpanded(id));
  };

  const renderItem = (id: string, level = 0) => {
    const item = items[id];
    if (!item) return null;

    if (item.type === 'folder') {
      const folder = item as FolderItem;
      const childItems = Object.values(items).filter(i => i.parentId === id);
      
      return (
        <DraggableItem key={id} item={folder}>
          <DroppableArea id={id} className="folder-item group" >
            <span onClick={() => handleFolderClick(id)} className="flex items-center">
              {folder.expanded ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
              <FiFolder className="mr-1 text-yellow-500" />
              {renamingItemId === id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRenameItem}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameItem()}
                  autoFocus
                  className="bg-transparent border-b border-gray-500 outline-none"
                />
              ) : (
                <span className="font-medium">{folder.name}</span>
              )}
            </span>
            <div className="ml-auto flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNewItemType('file');
                  setNewItemParentId(id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="New File"
              >
                <FiFilePlus size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNewItemType('folder');
                  setNewItemParentId(id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="New Folder"
              >
                <FiFolderPlus size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setRenamingItemId(id);
                  setNewName(folder.name);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Rename"
              >
                <FiEdit size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Delete"
              >
                <FiTrash size={14} />
              </button>
            </div>
          </DroppableArea>
          
          {folder.expanded && (
            <div className="folder-children">
              {childItems.map(child => renderItem(child.id, level + 1))}
            </div>
          )}
        </DraggableItem>
      );
    } else {
      const file = item as FileItem;
      return (
        <DraggableItem key={id} item={file}>
          <div 
            className={`file-item group ${activeFileId === id ? 'active' : ''}`}
            style={{ paddingLeft: `${(level + 1) * 16}px` }}
          >
            <div className="flex items-center flex-1" onClick={() => handleFileClick(id)}>
              <FiFile className="mr-1 text-blue-400" />
              {renamingItemId === id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRenameItem}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameItem()}
                  autoFocus
                  className="bg-transparent border-b border-gray-500 outline-none"
                />
              ) : (
                <span>{file.name}</span>
              )}
            </div>
            <div className="ml-auto flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setRenamingItemId(id);
                  setNewName(file.name);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Rename"
              >
                <FiEdit size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Delete"
              >
                <FiTrash size={14} />
              </button>
            </div>
          </div>
        </DraggableItem>
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="text-lg font-semibold">Explorer</h2>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => {
                setNewItemType('file');
                setNewItemParentId(null);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="New File"
            >
              <FiFilePlus size={18} />
            </button>
            <button 
              onClick={() => {
                setNewItemType('folder');
                setNewItemParentId(null);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="New Folder"
            >
              <FiFolderPlus size={18} />
            </button>
          </div>
        </div>
        
        {newItemType && (
          <div className="m-2 p-3 border border-gray-600 dark:bg-gray-800 rounded-md shadow-sm">
            <div className="flex items-center mb-2">
              <span className="mr-2">New {newItemType}:</span>
              {newItemParentId && (
                <span className="text-sm text-gray-500">
                  in {(items[newItemParentId] as FolderItem).name}
                </span>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter ${newItemType} name`}
                className="flex-1 w-8 p-1 border bg-transparent border-gray-600 dark:border-gray-600 rounded-l dark:bg-gray-700"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
              />
              <button
                onClick={handleCreateItem}
                className="px-2 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        )}
        
        <DroppableArea id={null} className="sidebar-content p-2">
          {rootItems.length > 0 ? (
            rootItems.map(id => renderItem(id))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No files or folders yet</p>
              <p className="text-sm mt-2">Create a new file or folder to get started</p>
            </div>
          )}
        </DroppableArea>
      </div>
    </DndProvider>
  );
}