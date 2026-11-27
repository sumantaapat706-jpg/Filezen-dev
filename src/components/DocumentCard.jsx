// src/components/DocumentCard.jsx
import React from 'react';
import { FileText, Download, Trash2, Star, FolderInput, Edit2 } from 'lucide-react';

export default function DocumentCard({ doc, viewMode, onDownload, onDelete, onFavorite, isFavorite, onRename, onMove }) {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-slate-800">{doc.name}</h4>
            <p className="text-xs text-slate-400">
              {formatSize(doc.size)} • Modified {new Date(doc.modifiedAt || doc.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onFavorite(doc)} className={`p-2 rounded-lg hover:bg-slate-50 ${isFavorite ? 'text-amber-500' : 'text-slate-400'}`}>
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button onClick={() => onDownload(doc)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => onRename(doc)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(doc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <button onClick={() => onFavorite(doc)} className={`p-2 rounded-lg hover:bg-slate-50 ${isFavorite ? 'text-amber-500' : 'text-slate-400'}`}>
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        <h4 className="font-semibold text-slate-800 truncate mb-1" title={doc.name}>{doc.name}</h4>
        <p className="text-xs text-slate-400 mb-4">
          {formatSize(doc.size)} • {new Date(doc.modifiedAt || doc.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button onClick={() => onDownload(doc)} className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700">
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
        <div className="flex items-center space-x-1">
          <button onClick={() => onRename(doc)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded" title="Rename">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}