import { SafeStorage } from "./storage";
import { studySessionSchema, StudySessionData } from "../../types/storage";

const SESSION_KEY = "studia_study_session";
const STORAGE_VERSION = 1;

export class StudyStorage {
  static get(): StudySessionData | null {
    const raw = SafeStorage.get(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      
      // Version check: if storage version mismatch, ignore incompatible data
      if (parsed.version !== STORAGE_VERSION) {
        console.warn(`Storage version mismatch (got ${parsed.version}, expected ${STORAGE_VERSION}). Resetting storage.`);
        this.clear();
        return null;
      }

      const validated = studySessionSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      } else {
        console.warn("Storage data failed Zod validation, clearing corrupt session:", validated.error);
        this.clear();
      }
    } catch (e) {
      console.warn("Failed to parse study storage session, clearing:", e);
      this.clear();
    }
    return null;
  }

  static save(data: Omit<StudySessionData, "version" | "createdAt" | "updatedAt"> & { createdAt?: number }): boolean {
    const current = this.get();
    const now = Date.now();
    
    const sessionToSave: StudySessionData = {
      version: STORAGE_VERSION,
      createdAt: data.createdAt || current?.createdAt || now,
      updatedAt: now,
      originalNotes: data.originalNotes,
      material: data.material,
      flashcardProgress: data.flashcardProgress,
      quizProgress: data.quizProgress,
    };

    const validated = studySessionSchema.safeParse(sessionToSave);
    if (validated.success) {
      return SafeStorage.set(SESSION_KEY, JSON.stringify(validated.data));
    } else {
      console.error("Attempted to save invalid study session data:", validated.error);
      return false;
    }
  }

  static clear(): boolean {
    return SafeStorage.remove(SESSION_KEY);
  }

  // Export session data
  static exportSession(session: StudySessionData): string {
    return JSON.stringify(session, null, 2);
  }

  // Import and validate session data
  static importSession(jsonString: string): StudySessionData | null {
    try {
      const parsed = JSON.parse(jsonString);
      const validated = studySessionSchema.safeParse(parsed);
      if (validated.success) {
        // Save the imported session immediately
        this.save(validated.data);
        return validated.data;
      }
    } catch (e) {
      console.warn("Failed to parse imported JSON session:", e);
    }
    return null;
  }
}
