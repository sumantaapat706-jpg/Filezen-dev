import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <strong>OmniPDF</strong> &copy; {new Date().getFullYear()} — 100% Free &amp; Local Browser PDF Tools.
        </div>
        <div className="footer-links">
          <Link to="/about#privacy">Privacy Policy</Link>
          <Link to="/about#terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}