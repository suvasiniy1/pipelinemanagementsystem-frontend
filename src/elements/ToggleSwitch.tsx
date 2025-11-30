import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  id
}) => {
  const { currentTheme } = useTheme();

  const sizeConfig = {
    small: { width: 44, height: 24, knobSize: 18, padding: 3 },
    medium: { width: 52, height: 28, knobSize: 22, padding: 3 },
    large: { width: 60, height: 32, knobSize: 26, padding: 3 }
  };

  const config = sizeConfig[size];
  const knobOffset = checked ? config.width - config.knobSize - config.padding : config.padding;

  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: `${config.width}px`,
    height: `${config.height}px`,
    backgroundColor: checked ? currentTheme.primaryColor : '#ccc',
    borderRadius: `${config.height / 2}px`,
    border: `1px solid ${checked ? currentTheme.primaryColor : '#bbb'}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1,
    boxShadow: disabled ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
  };

  const knobStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${config.padding}px`,
    left: `${knobOffset}px`,
    width: `${config.knobSize}px`,
    height: `${config.knobSize}px`,
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div style={{...containerStyle, marginTop: '8px'}} onClick={handleClick}>
      <div
        style={toggleStyle}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyPress={handleKeyPress}
        id={id}
      >
        <div style={knobStyle} />
      </div>
      {label && (
        <label 
          htmlFor={id}
          style={{ 
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            userSelect: 'none'
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;