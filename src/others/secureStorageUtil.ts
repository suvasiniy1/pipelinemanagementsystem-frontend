// Enhanced obfuscation utility for localStorage
class SecureStorageUtil {
  private static getSessionKey(): string {
    // Generate dynamic key based on session info
    const nav = navigator.userAgent.slice(-8);
    const time = Math.floor(Date.now() / 86400000); // Changes daily
    return btoa(nav + time.toString()).slice(0, 16);
  }
  
  private static multiLayerObfuscate(text: string): string {
    const key = this.getSessionKey();
    
    // Layer 1: XOR with dynamic key
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ (i + 42)
      );
    }
    
    // Layer 2: Reverse and add noise
    result = result.split('').reverse().join('');
    
    // Layer 3: Base64 with padding manipulation
    let encoded = btoa(result);
    
    // Layer 4: Add random prefix/suffix to make it look like system data
    const prefix = 'sys_' + Math.random().toString(36).substr(2, 4);
    const suffix = '_' + Date.now().toString(36);
    
    return prefix + encoded + suffix;
  }
  
  private static multiLayerDeobfuscate(obfuscated: string): string {
    try {
      // Remove prefix/suffix
      const parts = obfuscated.split('_');
      if (parts.length < 3) return '';
      
      const encoded = parts.slice(1, -1).join('_');
      
      // Reverse Base64
      let decoded = atob(encoded);
      
      // Reverse the string
      decoded = decoded.split('').reverse().join('');
      
      // Reverse XOR
      const key = this.getSessionKey();
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ (i + 42)
        );
      }
      
      return result;
    } catch {
      return '';
    }
  }
  
  public static setSecureItem(key: string, value: string): void {
    const obfuscated = this.multiLayerObfuscate(value);
    localStorage.setItem(key, obfuscated);
  }
  
  public static getSecureItem(key: string): string | null {
    const obfuscated = localStorage.getItem(key);
    if (!obfuscated) return null;
    return this.multiLayerDeobfuscate(obfuscated);
  }
  
  public static removeSecureItem(key: string): void {
    localStorage.removeItem(key);
  }
}

export default SecureStorageUtil;