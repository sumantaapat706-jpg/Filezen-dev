import React, { useState } from 'react';
import { Layers, Download, CheckCircle, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { processBatch } from '../utils/batchProcessor';
import { logActivity } from '../utils/historyDB';

export default function BatchProcessing() {
  const [files, setFiles] = useState([]);
  const [operation, setOperation] = useState('compress');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [batchResult, setBatchResult] = useState(null);

  const handleFilesChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setBatchResult(null);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRunBatch = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress(0);
    setBatchResult(null);

    try {
      const res = await processBatch(files, operation, {}, (prog, text) => {
        setProgress(prog);
        setStatusText(text);
      });
      setBatchResult(res);
      await logActivity('Batch Processing', `${files.length} files processed`, operation);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = () => {
    if (!batchResult || !batchResult.zipBlob) return;
    const url = URL.createObjectURL(batchResult.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniPDF_Batch_${operation}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ['Bytes', 'KB', 'MB', 'GB'][i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Batch Document Processing</h1>
        <p className="text-slate-500 mt-1">Process multiple PDF files simultaneously right inside your browser.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Select Batch Operation</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'compress', name: 'Batch Compress PDFs', desc: 'Optimize multiple files simultaneously' },
              { id: 'number-pages', name: 'Batch Page Numbering', desc: 'Apply page numbers across multiple documents' },
            ].map((op) => (
              <div 
                key={op.id}
                onClick={() => setOperation(op.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${operation === op.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <h5 className="font-semibold text-slate-800 text-sm">{op.name}</h5>
                <p className="text-xs text-slate-500 mt-1">{op.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50">
          <Layers className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-semibold text-slate-700">Select multiple PDF files or drag & drop</span>
          <span className="text-xs text-slate-400 mt-1">Queue as many documents as needed</span>
          <input type="file" multiple accept=".pdf" onChange={handleFilesChange} className="hidden" />
        </label>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 text-sm">Selected Files ({files.length})</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="truncate pr-4">
                    <p className="font-medium text-slate-800 text-sm truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                  </div>
                  {!loading && !batchResult && (
                    <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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

        {files.length > 0 && !batchResult && !loading && (
          <button 
            onClick={handleRunBatch}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:opacity-95 transition-opacity"
          >
            Start Batch Processing ({files.length} files)
          </button>
        )}

        {batchResult && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3 text-emerald-700">
              <CheckCircle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Batch Processing Complete!</h3>
            </div>
            <p className="text-sm text-slate-600">Successfully processed {batchResult.results.filter(r => r.success).length} of {files.length} files.</p>
            
            <button 
              onClick={handleDownloadZip}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download All as ZIP Archive</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}