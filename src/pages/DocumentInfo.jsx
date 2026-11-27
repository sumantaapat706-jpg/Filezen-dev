// src/pages/DocumentInfo.jsx
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, FileText, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/historyDB';

export default function DocumentInfo() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      setMetadata({
        title: pdfDoc.getTitle() || 'Not specified',
        author: pdfDoc.getAuthor() || 'Not specified',
        subject: pdfDoc.getSubject() || 'Not specified',
        producer: pdfDoc.getProducer() || 'Not specified',
        creator: pdfDoc.getCreator() || 'Not specified',
        creationDate: pdfDoc.getCreationDate()?.toLocaleString() || 'Not specified',
        modDate: pdfDoc.getModificationDate()?.toLocaleString() || 'Not specified',
        pageCount: pdfDoc.getPageCount(),
      });

      await logActivity('Document Information', `Inspected metadata for ${selectedFile.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to read PDF metadata. Ensure it is a valid file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
      <h1 className="text-3xl font-bold text-slate-800">Document Information</h1>
      <p className="text-slate-500 mt-1 mb-6">Inspect hidden metadata, properties, and details of any PDF document.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <FileText className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">{file ? file.name : 'Choose PDF File to Inspect'}</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>

        {loading && (
          <div className="flex items-center justify-center py-6 text-slate-500 space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Reading file properties...</span>
          </div>
        )}

        {metadata && !loading && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span>Extracted Metadata</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Page Count</span>
                <span className="text-sm font-semibold text-slate-700">{metadata.pageCount}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Title</span>
                <span className="text-sm font-semibold text-slate-700">{metadata.title}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Author</span>
                <span className="text-sm font-semibold text-slate-700">{metadata.author}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Subject</span>
                <span className="text-sm font-semibold text-slate-700">{metadata.subject}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Creator</span>
                <span className="text-sm font-semibold text-slate-700">{metadata.creator}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Creation Date</span>
                <span className="text-sm font-semibold text-slate-700">{metadata.creationDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}