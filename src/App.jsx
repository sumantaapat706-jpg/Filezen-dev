// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

export function App() {
  return (
    <div>
      {/* Your existing app components */}
      <Analytics />
    </div>
  );
}

const AdvancedCompression = lazy(() => import('./pages/AdvancedCompression.jsx'));
const BatchProcessing = lazy(() => import('./pages/BatchProcessing'));
const PDFToJPG = lazy(() => import('./pages/PDFToJPG'));
const PageNumbering = lazy(() => import('./pages/PageNumbering'));
const MergePDF = lazy(() => import('./pages/MergePDF'));
const SplitPDF = lazy(() => import('./pages/SplitPDF'));
const DocumentInfo = lazy(() => import('./pages/DocumentInfo'));
const StudyPlanner = lazy(() => import('./pages/StudyPlanner'));
const Scanner = lazy(() => import('./pages/Scanner'));
// Stage 1 Pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ImageToPDF = lazy(() => import('./pages/ImageToPDF'));

// Stage 2 Productivity Pages
const Organizer = lazy(() => import('./pages/Organizer'));

// Placeholder for upcoming Stage 2 features
function ToolComingNext({ name }) {
  return (
    <div className="info-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{name}</h1>
      <p className="text-slate-500 mb-6">This productivity module is ready for integration.</p>
      <Link to="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
        &larr; Back to Dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>Loading Filezen...</div>}>
            <Routes>
              {/* General Navigation */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Stage 1 PDF Tools */}
              <Route path="/merge-pdf" element={<MergePDF />} />
              <Route path="/split-pdf" element={<SplitPDF />} />
              <Route path="/image-to-pdf" element={<ImageToPDF />} />
              
              <Route path="/compress-pdf" element={<AdvancedCompression/>} />
             <Route path="/pdf-to-jpg" element={<PDFToJPG />} />

              {/* Stage 2 Productivity Features */}
              <Route path="/organizer" element={<Organizer />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/recent-files" element={<ToolComingNext name="Recent Files" />} />
              <Route path="/favorites" element={<ToolComingNext name="Favorites" />} />
              <Route path="/page-numbering" element={<PageNumbering />} />
              <Route path="/document-info" element={<DocumentInfo />} />
              <Route path="/study-planner" element={<StudyPlanner />} />
              {/* 👇 Paste your Stage 3 routes right here 👇 */}
  
  <Route path="/batch-processing" element={<BatchProcessing />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}