// src/utils/historyDB.js
import { openDB } from '../database/db';

const STORE_NAME = 'recentFiles';

export async function logActivity(toolName, fileName, details = '') {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      toolName,
      name: fileName,
      fileName,
      details,
      lastUsed: new Date().toISOString(),
    };

    store.put(record);

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
    });
  } catch (err) {
    console.warn('IndexedDB unavailable for logging:', err);
    return false;
  }
}

export async function getRecentActivity(limit = 5) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const items = request.result || [];
        items.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));
        resolve(items.slice(0, limit));
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function clearActivityHistory() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
    });
  } catch (err) {
    return false;
  }
}