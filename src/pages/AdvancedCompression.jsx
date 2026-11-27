// src/pages/AdvancedCompression.jsx
import React, { useState } from 'react';
import { Upload, Sliders, Download, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { compressPDF } from '../utils/advancedCompression';
import { logActivity } from '../utils/historyDB';

export default function AdvancedCompression() {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setResult(null);

    try {
      const res = await compressPDF(file, preset, (prog, text) => {
        setProgress(prog);
        setStatusText(text);
      });
      setResult(res);
      await logActivity('Advanced Compression', file.name, `${res.reduction}% size reduction`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Advanced PDF Compression</h1>
        <p className="text-slate-500 mt-1">Optimize PDF structure and reduce file size locally in your browser.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        {/* File Upload */}
        {!file ? (
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
            <Upload className="w-10 h-10 text-blue-600 mb-3" />
            <span className="font-semibold text-slate-700">Click to upload PDF or drag and drop</span>
            <span className="text-xs text-slate-400 mt-1">Supports PDF files up to 100MB</span>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="font-medium text-slate-800">{file.name}</h4>
              <p className="text-xs text-slate-400">Original Size: {formatSize(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-sm text-red-500 hover:underline font-medium">
              Remove
            </button>
          </div>
        )}

        {/* Compression Presets */}
        {file && !result && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Select Compression Preset</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'low', name: 'Low Compression', desc: 'Fastest, minimal size reduction, highest fidelity' },
                { id: 'medium', name: 'Medium Compression', desc: 'Balanced object optimization & structure cleanup' },
                { id: 'high', name: 'High Compression', desc: 'Aggressive optimization for maximum size reduction' },
              ].map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${preset === p.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <h5 className="font-semibold text-slate-800 text-sm">{p.name}</h5>
                  <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress State */}
        {loading && (
          <div className="space-y-2 py-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>{statusText}</span>
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {file && !result && !loading && (
          <button 
            onClick={handleCompress}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:opacity-95 transition-opacity"
          >
            Compress PDF Now
          </button>
        )}

        {/* Success Result */}
        {result && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3 text-emerald-700">
              <CheckCircle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Compression Successful!</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center bg-white p-4 rounded-xl border border-emerald-100">
              <div>
                <p className="text-xs text-slate-400">Original Size</p>
                <p className="font-semibold text-slate-800">{formatSize(result.originalSize)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Compressed Size</p>
                <p className="font-semibold text-slate-800">{formatSize(result.compressedSize)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Reduction</p>
                <p className="font-semibold text-emerald-600">-{result.reduction}%</p>
              </div>
            </div>
            <button 
              onClick={handleDownload}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Compressed PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}