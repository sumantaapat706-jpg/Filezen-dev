// src/utils/batchProcessor.js
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function processBatch(files, operation, options = {}, onProgress) {
  const zip = new JSZip();
  const results = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const progressPercent = Math.round(((i) / total) * 100);
    
    if (onProgress) {
      onProgress(progressPercent, `Processing ${file.name} (${i + 1}/${total})...`);
    }

    try {
      let processedBlob;

      if (operation === 'compress') {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else if (operation === 'number-pages') {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pdfBytes = await pdfDoc.save();
        processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else {
        processedBlob = file;
      }

      results.push({
        fileName: file.name,
        success: true,
        blob: processedBlob,
        size: processedBlob.size,
      });

      // Add to ZIP archive
      zip.file(`processed_${file.name}`, processedBlob);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      results.push({
        fileName: file.name,
        success: false,
        error: error.message || 'Processing failed',
      });
    }
  }

  if (onProgress) {
    onProgress(100, 'Generating ZIP package...');
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  return {
    results,
    zipBlob,
  };
}
