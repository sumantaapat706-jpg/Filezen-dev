// src/pages/SplitPDF.jsx
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, FileText, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/historyDB';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [splitUrl, setSplitUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSplitUrl(null);
    }
  };

  const handleSplit = async () => {
    if (!file || !pageRange) {
      alert('Please upload a file and specify pages (e.g., 1-3).');
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      // Simple single range or page parsing (e.g. "1-2")
      const [start, end] = pageRange.split('-').map(num => parseInt(num.trim(), 10) - 1);
      const indices = [];
      for (let i = (isNaN(start) ? 0 : start); i <= (isNaN(end) ? start : end); i++) {
        if (i >= 0 && i < pdf.getPageCount()) indices.push(i);
      }

      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setSplitUrl(URL.createObjectURL(blob));

      await logActivity('Split PDF', `Extracted pages from ${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to split PDF. Check page range format.');
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
      <h1 className="text-3xl font-bold text-slate-800">Split PDF Document</h1>
      <p className="text-slate-500 mt-1 mb-6">Extract specific pages or page ranges into a new document.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <FileText className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">{file ? file.name : 'Choose PDF File'}</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Page Range (e.g. 1-3)</label>
            <input 
              type="text" 
              value={pageRange} 
              onChange={(e) => setPageRange(e.target.value)} 
              placeholder="1-3"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {file && pageRange && !splitUrl && (
          <button 
            onClick={handleSplit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Split PDF Now</span>}
          </button>
        )}

        {splitUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 text-center">
            <h3 className="font-bold text-lg text-emerald-700">Split Successful!</h3>
            <a 
              href={splitUrl} 
              download="split_document.pdf"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
            >
              <Download className="w-5 h-5" />
              <span>Download Split PDF</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}