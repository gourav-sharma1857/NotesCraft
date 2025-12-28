import React from 'react';
import './Sidebar.css';

export default function Sidebar({ 
  sections, 
  selectedSectionId, 
  onSelectSection, 
  onAddSection, 
  onGoHome,
  collapsed = false,
  onToggleCollapse,
  onMoveSection
}) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-back-btn" onClick={onGoHome} title="Back">
        {collapsed ? '←' : '← Back to Notes'}
      </button>
      
      {!collapsed && <div className="sidebar-title">SECTIONS</div>}
      
      <nav className="sidebar-nav">
        {sections?.map((section, index) => (
          <div
            key={section.id}
            className={`sidebar-item ${selectedSectionId === section.id ? 'active' : ''}`}
            onClick={() => onSelectSection(section.id)}
          >
            <span className="sidebar-item-num">{index + 1}</span>
            {!collapsed && <span className="sidebar-item-title">{section.title || 'Untitled'}</span>}
            {!collapsed && onMoveSection && (
              <div className="sidebar-item-moves">
                <button onClick={(e) => { e.stopPropagation(); onMoveSection(index, -1); }} disabled={index === 0}>↑</button>
                <button onClick={(e) => { e.stopPropagation(); onMoveSection(index, 1); }} disabled={index === sections.length - 1}>↓</button>
              </div>
            )}
          </div>
        ))}
      </nav>
      
      <button className="sidebar-add-btn" onClick={onAddSection} title="Add section">
        {collapsed ? '+' : '+ Add Section'}
      </button>
    </aside>
  );
}