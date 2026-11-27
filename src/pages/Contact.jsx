import React from 'react';
import { Mail, ShieldAlert } from 'lucide-react';

export default function Contact() {
  return (
    <div className="info-container">
      <h1>Contact &amp; Support</h1>
      <p>
        Have feedback, feature requests, or need assistance with Filezen on web or Android?
        Reach out directly using the details below.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
        <Mail color="var(--primary-blue)" size={22} />
        <span>
          <strong>Email Support:</strong>{' '}
          <a href="mailto:support@omnipdf.app" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
            support@Filezen.app
          </a>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
        <ShieldAlert color="var(--primary-purple)" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '0.92rem' }}>
          <strong>Note on Document Issues:</strong> Because OmniPDF processes files 100% locally on your
          device, we cannot recover lost files or access documents you have edited. Always keep a backup
          of original files before modifying them.
        </p>
      </div>
    </div>
  );
}