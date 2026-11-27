import React from 'react';

export default function About() {
  return (
    <div className="info-container">
      <h1>About Filezen</h1>
      <p>
        Filezen is a free-first, open-architecture PDF utility suite designed for students, educators, 
        and professionals who need fast document tools without paywalls, watermarks, or privacy risks.
      </p>

      <h2 id="privacy">Privacy Policy</h2>
      <p>
        <strong>Zero Server Uploads &amp; Local Processing:</strong> All PDF operations—including merging, 
        splitting, compressing, converting, and organizing—happen entirely within your web browser using 
        local JavaScript libraries (<code>pdf-lib</code>, <code>pdfjs-dist</code>). Your files are never 
        uploaded to, stored on, or transmitted to any external server. Once you close or refresh your 
        browser, all active file data is cleared from memory.
      </p>
      <p>
        <strong>Local Storage &amp; IndexedDB History:</strong> To display your recent activity history, 
        Filezen stores lightweight metadata (tool name, output filename, and timestamp) locally on your 
        device using browser storage (<code>IndexedDB</code> and <code>Local Storage</code>). This storage 
        utilizes your device&apos;s available disk space and never leaves your device. You can instantly 
        wipe your history at any time using the <strong>&quot;Clear History&quot;</strong> button on the dashboard.
      </p>
      <p>
        <strong>PWA &amp; Offline Use:</strong> When installed as a Progressive Web App (PWA) or run locally, 
        application assets and files may be cached by your browser for offline use. Filezen does not use 
        tracking cookies, user profiling, or analytics services.
      </p>

      <h2 id="terms">Terms of Use</h2>
      <p>
        Filezen is provided free of charge for personal, academic, and commercial document workflows. 
        Users retain 100% ownership and copyright of all files processed using this application.
      </p>
    </div>
  );
}