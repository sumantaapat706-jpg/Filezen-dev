// src/pages/PDFToJPG.jsx
import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { logActivity } from '../utils/historyDB';

// Configure worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFToJPG() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setZipUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      const zip = new JSZip();

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 100));
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
        zip.file(`page_${i}.jpg`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      setZipUrl(URL.createObjectURL(content));
      await logActivity('PDF to JPG', `Converted ${file.name} to JPG images`);
    } catch (err) {
      console.error(err);
      alert('Failed to convert PDF to JPG. Please ensure the file is valid.');
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
      <h1 className="text-3xl font-bold text-slate-800">PDF to JPG Converter</h1>
      <p className="text-slate-500 mt-1 mb-6">Render PDF pages as crisp high-resolution JPG images and download as a ZIP.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <FileText className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">{file ? file.name : 'Choose PDF File'}</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>

        {file && !zipUrl && !loading && (
          <button 
            onClick={handleConvert}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Convert to JPG (ZIP)</span>
          </button>
        )}

        {loading && (
          <div className="space-y-2 py-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Rendering pages to JPG...</span>
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {zipUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 text-center">
            <h3 className="font-bold text-lg text-emerald-700">Conversion Successful!</h3>
            <a 
              href={zipUrl} 
              download="pdf_images.zip"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Images as ZIP</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}