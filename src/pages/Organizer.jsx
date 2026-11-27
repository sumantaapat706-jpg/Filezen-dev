// src/pages/Organizer.jsx
import React, { useState, useEffect } from 'react';
import { FolderPlus, Upload, Search, Grid, List, ArrowLeft } from 'lucide-react';
import { getAllDocuments, getAllFolders, createFolder, saveDocument, deleteDocument } from '../utils/documentStorage';
import DocumentCard from '../components/DocumentCard';
import FolderCard from '../components/FolderCard';

export default function Organizer() {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docs = await getAllDocuments();
      const flds = await getAllFolders();
      setDocuments(docs);
      setFolders(flds);
    } catch (err) {
      console.error('Failed to load organizer data:', err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName);
      setNewFolderName('');
      setShowNewFolderModal(false);
      loadData();
    } catch (err) {
      alert('Folder name already exists or invalid.');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await saveDocument(file, currentFolder);
    }
    loadData();
  };

  const handleDeleteDoc = async (id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
      loadData();
    }
  };

  const handleDownloadDoc = (doc) => {
    const url = URL.createObjectURL(doc.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocs = documents
    .filter(doc => currentFolder === 'root' || doc.folderId === currentFolder)
    .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'size') return b.size - a.size;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            {currentFolder !== 'root' && (
              <button onClick={() => setCurrentFolder('root')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-slate-800">
              {currentFolder === 'root' ? 'Document Organizer' : 'Folder View'}
            </h1>
          </div>
          <p className="text-slate-500 text-sm">Manage, sort, and organize your PDF files locally.</p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
          </label>
          <button 
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Folders Section (Only in Root) */}
      {currentFolder === 'root' && folders.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map(folder => (
              <FolderCard key={folder.id} folder={folder} onClick={() => setCurrentFolder(folder.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Documents ({filteredDocs.length})
        </h3>
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-400 font-medium">No documents found.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
            {filteredDocs.map(doc => (
              <DocumentCard 
                key={doc.id} 
                doc={doc} 
                viewMode={viewMode}
                onDownload={handleDownloadDoc}
                onDelete={handleDeleteDoc}
                onFavorite={() => {}}
                isFavorite={false}
                onRename={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input 
                type="text" 
                placeholder="Folder name" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}