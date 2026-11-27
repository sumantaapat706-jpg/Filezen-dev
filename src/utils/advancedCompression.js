// src/utils/advancedCompression.js
import { PDFDocument } from 'pdf-lib';

export async function compressPDF(file, preset = 'medium', onProgress) {
  try {
    if (onProgress) onProgress(20, 'Reading PDF document...');
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    
    if (onProgress) onProgress(50, 'Optimizing PDF objects and structure...');

    // Compression level configurations
    // Note: pdf-lib automatically removes unused object streams and cleans up structure upon saving.
    const useObjectStreams = preset !== 'low';

    // Save compressed PDF with options
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: useObjectStreams,
    });

    if (onProgress) onProgress(90, 'Finalizing compressed file...');

    const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    
    // Safety check: ensure file size actually decreased
    let finalBlob = compressedBlob;
    if (compressedBlob.size >= file.size && preset === 'high') {
      // If high compression didn't reduce size on a minimal PDF, return original
      finalBlob = file;
    }

    if (onProgress) onProgress(100, 'Compression complete!');

    return {
      success: true,
      originalSize: file.size,
      compressedSize: finalBlob.size,
      reduction: Math.max(0, ((1 - finalBlob.size / file.size) * 100).toFixed(1)),
      blob: finalBlob,
    };
  } catch (error) {
    console.error('Compression error:', error);
    throw new Error('Failed to compress PDF. The file may be corrupted or password-protected.');
  }
}