import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface FileItem {
  id: string;
  name: string;
  content: string;
  type: "file";
  parentId: string | null;
}

export interface FolderItem {
  id: string;
  name: string;
  type: "folder";
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
  name: "fileSystem",
  initialState,
  reducers: {
    createFolder: (
      state,
      action: PayloadAction<{ name: string; parentId: string | null }>
    ) => {
      const id = uuidv4();
      const newFolder: FolderItem = {
        id,
        name: action.payload.name,
        type: "folder",
        parentId: action.payload.parentId,
        expanded: true,
      };

      state.items[id] = newFolder;

      if (action.payload.parentId === null) {
        state.rootItems.push(id);
      }
    },

    createFile: (
      state,
      action: PayloadAction<{ name: string; parentId: string | null }>
    ) => {
      const id = uuidv4();
      const newFile: FileItem = {
        id,
        name: action.payload.name.endsWith(".txt")
          ? action.payload.name
          : `${action.payload.name}.txt`,
        content: "",
        type: "file",
        parentId: action.payload.parentId,
      };

      state.items[id] = newFile;

      if (action.payload.parentId === null) {
        state.rootItems.push(id);
      }
    },

    updateFileContent: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const file = state.items[action.payload.id] as FileItem;
      if (file && file.type === "file") {
        file.content = action.payload.content;
      }
    },

    toggleFolderExpanded: (state, action: PayloadAction<string>) => {
      const folder = state.items[action.payload] as FolderItem;
      if (folder && folder.type === "folder") {
        folder.expanded = !folder.expanded;
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      const itemToDelete = state.items[action.payload];

      if (!itemToDelete) return;

      if (itemToDelete.type === "folder") {
        const itemsToDelete: string[] = [action.payload];
        let i = 0;

        while (i < itemsToDelete.length) {
          const currentId = itemsToDelete[i];

          Object.keys(state.items).forEach((id) => {
            if (state.items[id].parentId === currentId) {
              itemsToDelete.push(id);
            }
          });

          i++;
        }

        itemsToDelete.forEach((id) => {
          delete state.items[id];
        });
      } else {
        delete state.items[action.payload];
      }

      if (itemToDelete.parentId === null) {
        state.rootItems = state.rootItems.filter((id) => id !== action.payload);
      }
    },

    renameItem: (
      state,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const item = state.items[action.payload.id];
      if (item) {
        if (item.type === "file") {
          item.name = action.payload.newName.endsWith(".txt")
            ? action.payload.newName
            : `${action.payload.newName}.txt`;
        } else {
          item.name = action.payload.newName;
        }
      }
    },

    moveItem: (
      state,
      action: PayloadAction<{ itemId: string; newParentId: string | null }>
    ) => {
      const { itemId, newParentId } = action.payload;
      const item = state.items[itemId];

      if (!item) return;

      if (newParentId !== null && item.type === "folder") {
        let currentParent = newParentId;
        let isDescendant = false;

        while (currentParent !== null) {
          if (currentParent === itemId) {
            isDescendant = true;
            break;
          }

          const parent = state.items[currentParent];
          if (!parent) break;

          currentParent = parent.parentId ?? "";
        }

        if (isDescendant) return;
      }

      if (item.parentId === null && newParentId !== null) {
        state.rootItems = state.rootItems.filter((id) => id !== itemId);
      } else if (item.parentId !== null && newParentId === null) {
        state.rootItems.push(itemId);
      }

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
  moveItem,
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;
