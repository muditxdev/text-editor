'use client';

import { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Get saved theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = 
      theme === 'light' ? 'dark' : 
      theme === 'dark' ? 'system' : 'light';
    
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Current theme: ${theme}. Click to change.`}
    >
      {theme === 'light' && <FiSun size={18} />}
      {theme === 'dark' && <FiMoon size={18} />}
      {theme === 'system' && <FiMonitor size={18} />}
    </button>
  );
}