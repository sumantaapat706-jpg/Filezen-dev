import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ToolCard({ title, description, path, icon: Icon, iconBg, iconColor }) {
  return (
    <Link to={path} className="tool-card">
      <div>
        <div
          className="tool-icon-box"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <h3 className="tool-card-title">{title}</h3>
        <p className="tool-card-desc">{description}</p>
      </div>
      <div className="tool-card-action">
        Open Tool <ArrowRight size={16} />
      </div>
    </Link>
  );
}