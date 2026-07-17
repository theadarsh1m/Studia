import { SafeStorage } from "./storage";
import { preferencesSchema, PreferencesData } from "../../types/storage";

const PREFS_KEY = "aistudi_preferences";

export class PreferencesStorage {
  static get(): PreferencesData {
    const raw = SafeStorage.get(PREFS_KEY);
    if (!raw) {
      return { theme: "light", shufflePreference: false, reducedMotion: false };
    }
    try {
      const parsed = JSON.parse(raw);
      const validated = preferencesSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
    } catch (e) {
      console.warn("Failed to parse preferences storage, using defaults", e);
    }
    return { theme: "light", shufflePreference: false, reducedMotion: false };
  }

  static save(data: Partial<PreferencesData>): boolean {
    const current = this.get();
    const updated = { ...current, ...data };
    const validated = preferencesSchema.safeParse(updated);
    if (validated.success) {
      return SafeStorage.set(PREFS_KEY, JSON.stringify(validated.data));
    }
    return false;
  }
}
