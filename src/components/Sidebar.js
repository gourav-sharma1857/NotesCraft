import React from 'react';
import './Sidebar.css';

export default function Sidebar({ 
  sections, 
  selectedSectionId, 
  onSelectSection, 
  onAddSection, 
  onGoHome,
  onMoveSection,
  collapsed,
  onToggleCollapse
}) {
  if (collapsed) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="back-btn" onClick={onGoHome}>
          ← Back
        </button>
      </div>
      
      <div className="sidebar-label">SECTIONS</div>
      
      <nav className="sidebar-sections">
        {sections?.map((section, index) => (
          <div
            key={section.id}
            className={`sidebar-section ${selectedSectionId === section.id ? 'active' : ''}`}
          >
            <div className="section-main" onClick={() => onSelectSection(section.id)}>
              <span className="section-num">{index + 1}</span>
              <span className="section-name">{section.title || 'Untitled'}</span>
            </div>
            <div className="section-arrows">
              <button onClick={(e) => { e.stopPropagation(); onMoveSection(index, -1); }} disabled={index === 0}>↑</button>
              <button onClick={(e) => { e.stopPropagation(); onMoveSection(index, 1); }} disabled={index === sections.length - 1}>↓</button>
            </div>
          </div>
        ))}
      </nav>
      
      <button className="add-section-btn" onClick={onAddSection}>
        + New Section
      </button>
    </aside>
  );
}
