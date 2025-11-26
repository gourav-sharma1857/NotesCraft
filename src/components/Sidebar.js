import React from 'react';
import './Sidebar.css';

export default function Sidebar({ 
  sections, 
  selectedSectionId, 
  onSelectSection, 
  onAddSection, 
  onGoHome 
}) {
  return (
    <aside className="sidebar">
      <button className="sidebar-back-btn" onClick={onGoHome}>
        ← Back to Notes
      </button>
      
      <div className="sidebar-title">SECTIONS</div>
      
      <nav className="sidebar-nav">
        {sections?.map((section, index) => (
          <div
            key={section.id}
            className={`sidebar-item ${selectedSectionId === section.id ? 'active' : ''}`}
            onClick={() => onSelectSection(section.id)}
          >
            <span className="sidebar-item-num">{index + 1}</span>
            <span className="sidebar-item-title">{section.title || 'Untitled'}</span>
          </div>
        ))}
      </nav>
      
      <button className="sidebar-add-btn" onClick={onAddSection}>
        + Add Section
      </button>
    </aside>
  );
}