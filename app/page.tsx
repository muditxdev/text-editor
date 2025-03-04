'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EditorArea from '@/components/EditorArea';

export default function Home() {
  // Apply theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const isDark = 
      savedTheme === 'dark' || 
      (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  return (
    <main className="editor-layout">
      <Sidebar />
      <EditorArea />
    </main>
  );
}