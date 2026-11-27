// src/components/FolderCard.jsx
import React from 'react';
import { Folder } from 'lucide-react';

export default function FolderCard({ folder, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-3 group"
    >
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Folder className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800">{folder.name}</h4>
        <p className="text-xs text-slate-400">Local Folder</p>
      </div>
    </div>
  );
}