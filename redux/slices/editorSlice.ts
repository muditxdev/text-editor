import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  openFiles: string[];
  activeFileId: string | null;
}

const initialState: EditorState = {
  openFiles: [],
  activeFileId: null,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    openFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      
      // If file is not already open, add it to openFiles
      if (!state.openFiles.includes(fileId)) {
        state.openFiles.push(fileId);
      }
      
      // Set as active file
      state.activeFileId = fileId;
    },
    
    closeFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      
      // Remove from openFiles
      state.openFiles = state.openFiles.filter(id => id !== fileId);
      
      // If the active file is being closed, set a new active file
      if (state.activeFileId === fileId) {
        state.activeFileId = state.openFiles.length > 0 ? state.openFiles[state.openFiles.length - 1] : null;
      }
    },
    
    setActiveFile: (state, action: PayloadAction<string>) => {
      state.activeFileId = action.payload;
    },
  },
});

export const { openFile, closeFile, setActiveFile } = editorSlice.actions;

export default editorSlice.reducer;