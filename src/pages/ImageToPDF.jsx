// src/pages/ImageToPDF.jsx
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, Image as ImageIcon, Download, Loader2, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/historyDB';

export default function ImageToPDF() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
      setPdfUrl(null);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleConvertToPDF = async () => {
    if (images.length === 0) return;

    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgObj of images) {
        const arrayBuffer = await imgObj.file.arrayBuffer();
        let embeddedImage;

        if (imgObj.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        // Add a page sized to the image proportions
        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));

      await logActivity('Image to PDF', `Converted ${images.length} images into a PDF`);
    } catch (err) {
      console.error(err);
      alert('Failed to convert images to PDF. Please ensure files are valid JPG or PNG images.');
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
      <h1 className="text-3xl font-bold text-slate-800">Image to PDF Converter</h1>
      <p className="text-slate-500 mt-1 mb-6">Convert JPG and PNG images into a clean, shareable PDF document instantly.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <ImageIcon className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">Select Images (JPG, PNG)</span>
          <span className="text-xs text-slate-400 mt-1">Upload multiple pictures at once</span>
          <input type="file" multiple accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} className="hidden" />
        </label>

        {images.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 text-sm">Selected Images ({images.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col items-center">
                  <img src={img.preview} alt="preview" className="w-20 h-20 object-cover rounded-lg mb-2" />
                  <span className="text-xs text-slate-600 truncate w-full text-center">{img.file.name}</span>
                  {!loading && !pdfUrl && (
                    <button 
                      onClick={() => removeImage(idx)} 
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && !pdfUrl && (
          <button 
            onClick={handleConvertToPDF}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Convert to PDF Now</span>}
          </button>
        )}

        {pdfUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 text-center">
            <h3 className="font-bold text-lg text-emerald-700">Conversion Successful!</h3>
            <a 
              href={pdfUrl} 
              download="converted_images.pdf"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Converted PDF</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}