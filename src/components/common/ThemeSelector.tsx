import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button 
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
      >
        <FontAwesomeIcon icon={faPalette} />
        <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          {availableThemes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-option ${currentTheme.id === theme.id ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div 
                className="theme-color-preview" 
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
              <span>{theme.displayName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};