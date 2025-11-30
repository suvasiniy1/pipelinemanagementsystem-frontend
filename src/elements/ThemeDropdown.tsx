import React from 'react';
import { PREDEFINED_THEMES } from '../others/themes';

interface ThemeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ value, onChange, disabled = false }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="form-control"
      style={{ padding: '8px 12px' }}
    >
      <option value="">Select Theme</option>
      {PREDEFINED_THEMES.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.displayName}
        </option>
      ))}
    </select>
  );
};

const ThemeDropdownWithColors: React.FC<ThemeDropdownProps> = ({ value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedTheme = PREDEFINED_THEMES.find(t => t.id === value);

  return (
    <div className="theme-dropdown-container" style={{ position: 'relative' }}>
      <div
        className="theme-dropdown-selected"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          minHeight: '38px'
        }}
      >
        {selectedTheme ? (
          <>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: selectedTheme.primaryColor,
                marginRight: '8px',
                border: '1px solid #ddd'
              }}
            />
            <span>{selectedTheme.displayName}</span>
          </>
        ) : (
          <span style={{ color: '#999' }}>Select Theme</span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '12px' }}>▼</span>
      </div>

      {isOpen && !disabled && (
        <div
          className="theme-dropdown-options"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {PREDEFINED_THEMES.map((theme) => (
            <div
              key={theme.id}
              className="theme-dropdown-option"
              onClick={() => {
                onChange(theme.id);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: value === theme.id ? '#f0f0f0' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (value !== theme.id) {
                  e.currentTarget.style.backgroundColor = '#f8f8f8';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== theme.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: theme.primaryColor,
                  marginRight: '8px',
                  border: '1px solid #ddd'
                }}
              />
              <span>{theme.displayName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdownWithColors;