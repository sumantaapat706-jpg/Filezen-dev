import React from 'react';
import { Mail, ShieldAlert } from 'lucide-react';

export default function Contact() {
  return (
    <div className="info-container">
      <h1>Contact &amp; Support</h1>
      <p>
        Have feedback, feature requests, or need assistance with Filezen on web or Android?
        Fill out the form below or reach out via email.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
        <Mail color="var(--primary-blue)" size={22} />
        <span>
          <strong>Email Support:</strong>{' '}
          <a href="mailto:support@filezen.app" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
            support@filezen.app
          </a>
        </span>
      </div>

      {/* Embedded Google Form */}
      <div style={{ margin: '1.5rem 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScQvt2FoA3-2YFAQXIv5oJVvcSCBA39LcTvNDdSPZmN4rRj2w/viewform?embedded=true"
          width="100%"
          height="821"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Contact Support Form"
        >
          Loading…
        </iframe>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
        <ShieldAlert color="var(--primary-purple)" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '0.92rem' }}>
          <strong>Note on Document Issues:</strong> Because Filezen processes files 100% locally on your
          device, we cannot recover lost files or access documents you have edited. Always keep a backup
          of original files before modifying them.
        </p>
      </div>
    </div>
  );
}