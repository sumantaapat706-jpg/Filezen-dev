// src/database/db.js

const DB_NAME = 'OmniPDF_DB';
const DB_VERSION = 2; // Incremented to trigger automatic store creation

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Documents Store
      if (!db.objectStoreNames.contains('documents')) {
        const docStore = db.createObjectStore('documents', { keyPath: 'id' });
        docStore.createIndex('folderId', 'folderId', { unique: false });
        docStore.createIndex('name', 'name', { unique: false });
        docStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 2. Folders Store
      if (!db.objectStoreNames.contains('folders')) {
        const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
        folderStore.createIndex('name', 'name', { unique: true });
      }

      // 3. Recent Files Store
      if (!db.objectStoreNames.contains('recentFiles')) {
        const recentStore = db.createObjectStore('recentFiles', { keyPath: 'id' });
        recentStore.createIndex('lastUsed', 'lastUsed', { unique: false });
      }

      // 4. Favorites Store
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }

      // 5. Tasks Store
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('completed', 'completed', { unique: false });
        taskStore.createIndex('priority', 'priority', { unique: false });
      }

      // 6. Study Sessions Store
      if (!db.objectStoreNames.contains('studySessions')) {
        const studyStore = db.createObjectStore('studySessions', { keyPath: 'id' });
        studyStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};