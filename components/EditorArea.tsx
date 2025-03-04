'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { closeFile, setActiveFile } from '@/redux/slices/editorSlice';
import { updateFileContent } from '@/redux/slices/fileSystemSlice';
import { FiX, FiFile } from 'react-icons/fi';

export default function EditorArea() {
  const dispatch = useDispatch();
  const { openFiles, activeFileId } = useSelector((state: RootState) => state.editor);
  const { items } = useSelector((state: RootState) => state.fileSystem);
  
  const handleTabClick = (fileId: string) => {
    dispatch(setActiveFile(fileId));
  };
  
  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeFile(fileId));
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeFileId) {
      dispatch(updateFileContent({
        id: activeFileId,
        content: e.target.value
      }));
    }
  };
  
  const activeFile = activeFileId ? items[activeFileId] : null;
  
  return (
    <div className="main-content">
      <div className="tabs-container">
        {openFiles.map(fileId => {
          const file = items[fileId];
          if (!file || file.type !== 'file') return null;
          
          return (
            <div 
              key={fileId}
              className={`tab ${activeFileId === fileId ? 'active' : ''} group`}
              onClick={() => handleTabClick(fileId)}
            >
              <FiFile className="text-blue-400" />
              <span>{file.name}</span>
              <button 
                className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
                onClick={(e) => handleCloseTab(fileId, e)}
              >
                <FiX size={14} />
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="editor-container">
        {activeFile && activeFile.type === 'file' ? (
          <textarea
            className="text-editor"
            value={activeFile.content}
            onChange={handleContentChange}
            placeholder="Start typing..."
            spellCheck="false"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiFile size={48} className="mb-4 text-gray-400" />
            <p className="text-xl font-medium mb-2">No file is currently open</p>
            <p className="text-sm">Create or select a file from the sidebar to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
}