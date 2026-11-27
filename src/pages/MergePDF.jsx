// src/pages/MergePDF.jsx
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, FileText, Download, Loader2, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/historyDB';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mergedUrl, setMergedUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
      setMergedUrl(null);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }

    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedUrl(URL.createObjectURL(blob));

      await logActivity('Merge PDF', `Merged ${files.length} documents successfully`);
    } catch (err) {
      console.error(err);
      alert('Failed to merge PDFs. Ensure files are valid.');
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
      <h1 className="text-3xl font-bold text-slate-800">Merge PDF Documents</h1>
      <p className="text-slate-500 mt-1 mb-6">Combine multiple PDF files into a single unified document instantly.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <Plus className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">Add PDF Files</span>
          <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 text-sm">Selected Files ({files.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3 truncate">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length >= 2 && !mergedUrl && (
          <button 
            onClick={handleMerge}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Merge PDFs Now</span>}
          </button>
        )}

        {mergedUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 text-center">
            <h3 className="font-bold text-lg text-emerald-700">Merge Successful!</h3>
            <a 
              href={mergedUrl} 
              download="merged_document.pdf"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
            >
              <Download className="w-5 h-5" />
              <span>Download Merged PDF</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}