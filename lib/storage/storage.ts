export class SafeStorage {
  static isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const testKey = "__storage_test__";
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  static get(key: string): string | null {
    if (!this.isAvailable()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`Failed to read key "${key}" from localStorage:`, e);
      return null;
    }
  }

  static set(key: string, value: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`Failed to write key "${key}" to localStorage:`, e);
      return false;
    }
  }

  static remove(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Failed to remove key "${key}" from localStorage:`, e);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.clear();
      return true;
    } catch {
      console.warn("Failed to clear localStorage:");
      return false;
    }
  }
}
