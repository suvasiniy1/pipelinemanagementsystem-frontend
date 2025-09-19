import LocalStorageUtil from './LocalStorageUtil';

class SecureStorage {
  private static readonly SECRET_KEY = 'plms_secure_key_2024';

  // Simple obfuscation - not cryptographically secure but prevents casual tampering
  private static obfuscate(value: string): string {
    let result = '';
    for (let i = 0; i < value.length; i++) {
      result += String.fromCharCode(value.charCodeAt(i) ^ this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length));
    }
    return btoa(result); // Base64 encode
  }

  private static deobfuscate(obfuscated: string): string {
    try {
      const decoded = atob(obfuscated); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length));
      }
      return result;
    } catch {
      return '';
    }
  }

  public static setSecureItem(key: string, value: string): void {
    const obfuscated = this.obfuscate(value);
    LocalStorageUtil.setItem(key, obfuscated);
  }

  public static getSecureItem(key: string): string | null {
    const obfuscated = LocalStorageUtil.getItem(key);
    if (!obfuscated) return null;
    return this.deobfuscate(obfuscated);
  }

  public static removeSecureItem(key: string): void {
    LocalStorageUtil.removeItem(key);
  }
}

export default SecureStorage;