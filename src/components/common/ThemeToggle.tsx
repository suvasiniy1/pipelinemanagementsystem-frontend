import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newThemeId = currentTheme.id === 'default' ? 'dark' : 'default';
    setTheme(newThemeId);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${currentTheme.id === 'default' ? 'dark' : 'light'} mode`}
    >
      {currentTheme.id === 'default' ? '🌙' : '☀️'}
    </button>
  );
};