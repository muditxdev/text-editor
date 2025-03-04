# Next.js Text Editor

A lightweight text editor built with Next.js, similar to VS Code but limited to handling .txt files.

## Features

- **Folder Management**
  - Create new folders
  - Collapse/expand folders

- **File Management**
  - Create new .txt files
  - View and edit .txt files
  - Multiple files displayed as tabs

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Redux Toolkit (for state management)
- Redux Persist (to persist the editor state)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Click the folder or file icons in the sidebar to create new folders or files
- Click on a file to open it in the editor
- Use the tabs to switch between open files
- Click the X on a tab to close the file
- Use the expand/collapse icons to manage folder visibility
- All changes are automatically saved to local storage

## Project Structure

- `/components` - React components for the UI
- `/redux` - Redux store, slices, and actions
- `/app` - Next.js app directory with pages and layouts

## License

MIT