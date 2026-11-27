// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  Files,
  Scissors,
  ImagePlus,
  Minimize2,
  FileImage,
  Clock,
  FolderKanban,
  Layers,
  Camera,
  Hash,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import { getRecentActivity, clearActivityHistory } from '../utils/historyDB';

const TOOLS_LIST = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDF documents into a single unified file in your exact preferred order.',
    path: '/merge-pdf',
    icon: Files,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    keywords: 'combine join unite merge pdf',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Extract specific pages or custom page ranges from a PDF into a brand-new document.',
    path: '/split-pdf',
    icon: Scissors,
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed',
    keywords: 'extract separate cut remove pages split pdf',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, JPEG, and PNG images into a clean, shareable PDF document in seconds.',
    path: '/image-to-pdf',
    icon: ImagePlus,
    iconBg: '#ecfdf5',
    iconColor: '#059669',
    keywords: 'jpg png photo picture convert image to pdf',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Optimize PDF structure and reduce file size locally while preserving document readability.',
    path: '/compress-pdf',
    icon: Minimize2,
    iconBg: '#fff7ed',
    iconColor: '#ea580c',
    keywords: 'shrink reduce size optimize compress pdf',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Render PDF pages as crisp high-resolution JPG images and download individually or as a ZIP.',
    path: '/pdf-to-jpg',
    icon: FileImage,
    iconBg: '#fdf2f8',
    iconColor: '#db2777',
    keywords: 'export render pages picture pdf to jpg image',
  },
  {
    id: 'organizer',
    title: 'PDF Organizer',
    description: 'Rearrange, rotate, and manage pages visually inside your documents.',
    path: '/organizer',
    icon: FolderKanban,
    iconBg: '#eff6ff',
    iconColor: '#0284c7',
    keywords: 'organize rearrange rotate pages pdf',
  },
  {
    id: 'scanner',
    title: 'Document Scanner',
    description: 'Capture or upload photos of physical pages to compile into a clean scan PDF.',
    path: '/scanner',
    icon: Camera,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    keywords: 'scan camera photos picture document scanner pdf',
  },
  {
    id: 'page-numbering',
    title: 'PDF Page Numbering',
    description: 'Automatically stamp professional page numbers (e.g., Page X of Y) at the footer.',
    path: '/page-numbering',
    icon: Hash,
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
    keywords: 'numbering pages footer stamp pdf',
  },
  {
    id: 'document-info',
    title: 'Document Information',
    description: 'Inspect hidden metadata, properties, and details of any PDF document.',
    path: '/document-info',
    icon: Info,
    iconBg: '#fefce8',
    iconColor: '#ca8a04',
    keywords: 'metadata info details properties pdf',
  },
  {
    id: 'study-planner',
    title: 'Study Planner & Tasks',
    description: 'Organize your reading assignments, research notes, and document review goals.',
    path: '/study-planner',
    icon: CalendarCheck,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    keywords: 'study planner tasks goals reading notes',
  },
  {
    id: 'batch-processing',
    title: 'Batch Processing',
    description: 'Process multiple PDF files simultaneously in bulk right inside your browser.',
    path: '/batch-processing',
    icon: Layers,
    iconBg: '#faf5ff',
    iconColor: '#9333ea',
    keywords: 'batch bulk multiple process compress number pdf',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const data = await getRecentActivity(5);
    setActivities(data);
  }

  async function handleClearHistory() {
    await clearActivityHistory();
    setActivities([]);
  }

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.includes(q)
    );
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="privacy-pill">
          <ShieldCheck size={16} />
          <span>100% Private — Files Never Leave Your Device</span>
        </div>
        <h1 className="hero-title">
          All Your <span>PDF Tools</span> in One Place
        </h1>
        <p className="hero-subtitle">
          Fast, free, and secure PDF utilities built for students, teachers, and professionals.
          Merge, split, convert, and optimize documents directly in your browser.
        </p>

        {/* Search Bar */}
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tools (e.g., Merge, Split, Batch, Scanner)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search PDF tools"
          />
        </div>
      </section>

      {/* Main Tools Grid */}
      <section id="all-tools">
        <div className="section-header">
          <h2 className="section-title">PDF Productivity Tools</h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} available
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        ) : (
          <div className="activity-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              No tools matched "<strong>{searchQuery}</strong>". Try searching for Merge, Split, Batch, or Scanner.
            </p>
          </div>
        )}
      </section>

      {/* Recent Activity Section */}
      <section>
        <div className="section-header">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary-blue)" />
            Recent Activity
          </h2>
          {activities.length > 0 && (
            <button onClick={handleClearHistory} className="clear-btn">
              Clear History
            </button>
          )}
        </div>

        <div className="activity-card">
          {activities.length === 0 ? (
            <div className="activity-empty">
              No recent activity yet. Processed files are logged locally on your device for quick reference.
            </div>
          ) : (
            <ul className="activity-list">
              {activities.map((item) => (
                <li key={item.id} className="activity-item">
                  <div className="activity-meta">
                    <span className="activity-badge">{item.toolName}</span>
                    <strong>{item.fileName}</strong>
                    {item.details && (
                      <span style={{ color: 'var(--text-secondary)' }}>({item.details})</span>
                    )}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}