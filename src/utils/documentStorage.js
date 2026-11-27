// src/utils/documentStorage.js
import { openDB } from '../database/db';

export async function saveDocument(file, folderId = 'root') {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['documents'], 'readwrite');
    const store = transaction.objectStore('documents');

    const docRecord = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      name: file.name,
      fileType: file.type || 'application/pdf',
      size: file.size,
      blob: file,
      folderId: folderId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    const request = store.add(docRecord);
    request.onsuccess = () => resolve(docRecord);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function getAllDocuments() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function deleteDocument(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['documents', 'recentFiles', 'favorites'], 'readwrite');
    
    transaction.objectStore('documents').delete(id);
    transaction.objectStore('recentFiles').delete(id);
    transaction.objectStore('favorites').delete(id);

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (e) => reject(e.target.error);
  });
}

export async function createFolder(name) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['folders'], 'readwrite');
    const store = transaction.objectStore('folders');

    const folderRecord = {
      id: 'folder_' + Date.now(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    const request = store.add(folderRecord);
    request.onsuccess = () => resolve(folderRecord);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function getAllFolders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['folders'], 'readonly');
    const store = transaction.objectStore('folders');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}