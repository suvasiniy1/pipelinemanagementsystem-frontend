export interface Theme {
  id: string;
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  sidebarColor: string;
  headerColor: string;
}

export const PREDEFINED_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'default',
    displayName: 'Default Blue',
    primaryColor: '#0098e5',
    secondaryColor: '#007acc',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    sidebarColor: '#f8f9fa',
    headerColor: '#0098e5'
  },
  {
    id: 'dark',
    name: 'dark',
    displayName: 'Dark Theme',
    primaryColor: '#bb86fc',
    secondaryColor: '#3700b3',
    backgroundColor: '#121212',
    textColor: '#ffffff',
    sidebarColor: '#1e1e1e',
    headerColor: '#2d2d2d'
  },
  {
    id: 'green',
    name: 'green',
    displayName: 'Nature Green',
    primaryColor: '#4caf50',
    secondaryColor: '#388e3c',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    sidebarColor: '#f1f8e9',
    headerColor: '#4caf50'
  },
  {
    id: 'purple',
    name: 'purple',
    displayName: 'Royal Purple',
    primaryColor: '#9c27b0',
    secondaryColor: '#7b1fa2',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    sidebarColor: '#f3e5f5',
    headerColor: '#9c27b0'
  },
  {
    id: 'orange',
    name: 'orange',
    displayName: 'Sunset Orange',
    primaryColor: '#ff9800',
    secondaryColor: '#f57c00',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    sidebarColor: '#fff3e0',
    headerColor: '#ff9800'
  },
  {
    id: 'teal',
    name: 'teal',
    displayName: 'Ocean Teal',
    primaryColor: '#009688',
    secondaryColor: '#00796b',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    sidebarColor: '#e0f2f1',
    headerColor: '#009688'
  }
];

export const getThemeById = (id: string): Theme | undefined => {
  return PREDEFINED_THEMES.find(theme => theme.id === id);
};

export const getThemeByName = (name: string): Theme | undefined => {
  return PREDEFINED_THEMES.find(theme => theme.name === name);
};