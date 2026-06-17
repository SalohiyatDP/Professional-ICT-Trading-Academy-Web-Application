/**
 * Lightweight IndexedDB wrapper (no external deps).
 * Used for durable, larger data: replay sessions, quiz history, AI tutor chats.
 * Small key/value preferences live in localStorage (see storage.ts).
 */

const DB_NAME = "ict-academy";
const DB_VERSION = 1;

export const STORES = {
  replaySessions: "replaySessions",
  quizResults: "quizResults",
  tutorMessages: "tutorMessages",
  kv: "kv",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

export function initDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORES.replaySessions)) {
        db.createObjectStore(STORES.replaySessions, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.quizResults)) {
        const store = db.createObjectStore(STORES.quizResults, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("moduleId", "moduleId", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.tutorMessages)) {
        db.createObjectStore(STORES.tutorMessages, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.kv)) {
        db.createObjectStore(STORES.kv);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

async function tx<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await initDB();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(store, mode);
    const objectStore = transaction.objectStore(store);
    const request = fn(objectStore);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbPut<T>(store: StoreName, value: T, key?: IDBValidKey): Promise<void> {
  await tx(store, "readwrite", (s) => (key !== undefined ? s.put(value, key) : s.put(value)));
}

export async function dbGet<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  return tx<T>(store, "readonly", (s) => s.get(key) as IDBRequest<T>);
}

export async function dbGetAll<T>(store: StoreName): Promise<T[]> {
  return tx<T[]>(store, "readonly", (s) => s.getAll() as IDBRequest<T[]>);
}

export async function dbDelete(store: StoreName, key: IDBValidKey): Promise<void> {
  await tx(store, "readwrite", (s) => s.delete(key));
}

export async function dbClear(store: StoreName): Promise<void> {
  await tx(store, "readwrite", (s) => s.clear());
}
