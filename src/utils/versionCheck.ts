export const checkForUpdates = async () => {
  try {
    const response = await fetch('/version.json?t=' + Date.now());
    const serverVersion = await response.json();
    
    const localVersion = localStorage.getItem('app_version');
    
    if (localVersion && localVersion !== serverVersion.version) {
      // New version detected, clear cache and reload
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      localStorage.setItem('app_version', serverVersion.version);
      window.location.reload();
    } else if (!localVersion) {
      localStorage.setItem('app_version', serverVersion.version);
    }
  } catch (error) {
    console.warn('Version check failed:', error);
  }
};