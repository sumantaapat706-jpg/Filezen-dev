// src/pages/PageNumbering.jsx
import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ArrowLeft, FileText, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/historyDB';

export default function PageNumbering() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numberedUrl, setNumberedUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setNumberedUrl(null);
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      pages.forEach((page, index) => {
        const { width } = page.getSize();
        const text = `Page ${index + 1} of ${totalPages}`;
        const textWidth = font.widthOfTextAtSize(text, 10);
        
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: 20, // 20 units from the bottom
          size: 10,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setNumberedUrl(URL.createObjectURL(blob));

      await logActivity('Page Numbering', `Added page numbers to ${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to add page numbers. Please ensure the file is a valid PDF.');
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
      <h1 className="text-3xl font-bold text-slate-800">PDF Page Numbering</h1>
      <p className="text-slate-500 mt-1 mb-6">Automatically stamp professional page numbers (e.g., Page X of Y) at the footer of every page.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <FileText className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">{file ? file.name : 'Choose PDF File'}</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>

        {file && !numberedUrl && (
          <button 
            onClick={handleAddPageNumbers}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Apply Page Numbers Now</span>}
          </button>
        )}

        {numberedUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 text-center">
            <h3 className="font-bold text-lg text-emerald-700">Page Numbers Added Successfully!</h3>
            <a 
              href={numberedUrl} 
              download="numbered_document.pdf"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Numbered PDF</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}