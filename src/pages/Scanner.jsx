// src/pages/Scanner.jsx
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, Camera, Download, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/historyDB';

export default function Scanner() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleCapture = (e) => {
    if (e.target.files) {
      const newScans = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setScans(prev => [...prev, ...newScans]);
      setPdfUrl(null);
    }
  };

  const generateScanPDF = async () => {
    if (scans.length === 0) return;
    setLoading(true);

    try {
      const pdfDoc = await PDFDocument.create();
      for (const scan of scans) {
        const buffer = await scan.file.arrayBuffer();
        const img = scan.file.type === 'image/png' ? await pdfDoc.embedPng(buffer) : await pdfDoc.embedJpg(buffer);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      await logActivity('Document Scanner', `Scanned and compiled ${scans.length} pages`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate scanned PDF.');
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
      <h1 className="text-3xl font-bold text-slate-800">Document Scanner</h1>
      <p className="text-slate-500 mt-1 mb-6">Capture or upload photos of physical pages to compile into a clean scan PDF.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <Camera className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">Take or Upload Scan Photos</span>
          <input type="file" multiple accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
        </label>

        {scans.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {scans.map((s, i) => (
              <div key={i} className="relative bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col items-center">
                <img src={s.preview} alt="scan" className="w-20 h-20 object-cover rounded-lg mb-1" />
                <span className="text-xs text-slate-500">Page {i + 1}</span>
              </div>
            ))}
          </div>
        )}

        {scans.length > 0 && !pdfUrl && (
          <button onClick={generateScanPDF} disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Compile Scans to PDF</span>}
          </button>
        )}

        {pdfUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3">
            <h3 className="font-bold text-emerald-700">Scan Compiled Successfully!</h3>
            <a href={pdfUrl} download="scanned_document.pdf" className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700">
              <Download className="w-5 h-5" />
              <span>Download Scanned PDF</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}