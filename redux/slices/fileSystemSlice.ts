import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface FileItem {
  id: string;
  name: string;
  content: string;
  type: 'file';
  parentId: string | null;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  parentId: string | null;
  expanded: boolean;
}

export type FileSystemItem = FileItem | FolderItem;

interface FileSystemState {
  items: Record<string, FileSystemItem>;
  rootItems: string[];
}

const initialState: FileSystemState = {
  items: {},
  rootItems: [],
};

export const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    createFolder: (state, action: PayloadAction<{ name: string; parentId: string | null }>) => {
      const id = uuidv4();
      const newFolder: FolderItem = {
        id,
        name: action.payload.name,
        type: 'folder',
        parentId: action.payload.parentId,
        expanded: true,
      };
      
      state.items[id] = newFolder;
      
      if (action.payload.parentId === null) {
        state.rootItems.push(id);
      }
    },
    
    createFile: (state, action: PayloadAction<{ name: string; parentId: string | null }>) => {
      const id = uuidv4();
      const newFile: FileItem = {
        id,
        name: action.payload.name.endsWith('.txt') ? action.payload.name : `${action.payload.name}.txt`,
        content: '',
        type: 'file',
        parentId: action.payload.parentId,
      };
      
      state.items[id] = newFile;
      
      if (action.payload.parentId === null) {
        state.rootItems.push(id);
      }
    },
    
    updateFileContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const file = state.items[action.payload.id] as FileItem;
      if (file && file.type === 'file') {
        file.content = action.payload.content;
      }
    },
    
    toggleFolderExpanded: (state, action: PayloadAction<string>) => {
      const folder = state.items[action.payload] as FolderItem;
      if (folder && folder.type === 'folder') {
        folder.expanded = !folder.expanded;
      }
    },
    
    deleteItem: (state, action: PayloadAction<string>) => {
      const itemToDelete = state.items[action.payload];
      
      if (!itemToDelete) return;
      
      // If it's a folder, delete all children recursively
      if (itemToDelete.type === 'folder') {
        const itemsToDelete: string[] = [action.payload];
        let i = 0;
        
        // Find all descendants
        while (i < itemsToDelete.length) {
          const currentId = itemsToDelete[i];
          
          // Find all direct children
          Object.keys(state.items).forEach(id => {
            if (state.items[id].parentId === currentId) {
              itemsToDelete.push(id);
            }
          });
          
          i++;
        }
        
        // Delete all found items
        itemsToDelete.forEach(id => {
          delete state.items[id];
        });
      } else {
        // Just delete the file
        delete state.items[action.payload];
      }
      
      // Remove from rootItems if it's there
      if (itemToDelete.parentId === null) {
        state.rootItems = state.rootItems.filter(id => id !== action.payload);
      }
    },
    
    renameItem: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const item = state.items[action.payload.id];
      if (item) {
        if (item.type === 'file') {
          item.name = action.payload.newName.endsWith('.txt') 
            ? action.payload.newName 
            : `${action.payload.newName}.txt`;
        } else {
          item.name = action.payload.newName;
        }
      }
    },
    
    moveItem: (state, action: PayloadAction<{ itemId: string; newParentId: string | null }>) => {
      const { itemId, newParentId } = action.payload;
      const item = state.items[itemId];
      
      if (!item) return;
      
      // Check if the target is a descendant of the item (to prevent circular references)
      if (newParentId !== null && item.type === 'folder') {
        let currentParent = newParentId;
        let isDescendant = false;
        
        while (currentParent !== null) {
          if (currentParent === itemId) {
            isDescendant = true;
            break;
          }
          
          const parent = state.items[currentParent];
          if (!parent) break;
          
          currentParent = parent.parentId;
        }
        
        if (isDescendant) return; // Prevent circular reference
      }
      
      // Update rootItems if necessary
      if (item.parentId === null && newParentId !== null) {
        // Item is moving from root to a folder
        state.rootItems = state.rootItems.filter(id => id !== itemId);
      } else if (item.parentId !== null && newParentId === null) {
        // Item is moving from a folder to root
        state.rootItems.push(itemId);
      }
      
      // Update the item's parentId
      item.parentId = newParentId;
    },
  },
});

export const { 
  createFolder, 
  createFile, 
  updateFileContent, 
  toggleFolderExpanded,
  deleteItem,
  renameItem,
  moveItem
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;