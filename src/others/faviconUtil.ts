export const updateFavicon = (primaryColor: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${primaryColor}"/>
      <text x="50" y="50" font-size="60" text-anchor="middle" dominant-baseline="central" fill="white" font-family="Arial, sans-serif" font-weight="bold">CL</text>
    </svg>
  `;
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
};
