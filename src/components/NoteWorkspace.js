import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import './NoteWorkspace.css';

// ============ STYLE PANEL ============
function StylePanel({ target, note, currentSection, onUpdate, onUpdateSection, onClose }) {
  const fonts = ['Inter', 'Georgia', 'Playfair Display', 'Roboto Mono', 'Arial', 'Times New Roman'];
  const sizes = ['14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'];
  const gradients = [
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { name: 'Night', value: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)' },
    { name: 'Sky', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  ];
  const colors = ['#1e293b', '#334155', '#0f172a', '#dc2626', '#2563eb', '#059669', '#7c3aed', '#db2777'];

  if (target === 'background') {
    return (
      <div className="style-panel-overlay" onClick={onClose}>
        <div className="style-panel" onClick={e => e.stopPropagation()}>
          <h3>Background</h3>
          <div className="style-section">
            <label>Solid Colors</label>
            <div className="color-grid">
              {['#ffffff', '#f8fafc', '#f1f5f9', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3'].map(c => (
                <div key={c} className={`color-swatch ${note.background?.value === c ? 'active' : ''}`}
                  style={{ background: c }} onClick={() => onUpdate({ background: { type: 'solid', value: c } })} />
              ))}
            </div>
          </div>
          <div className="style-section">
            <label>Gradients</label>
            <div className="gradient-grid">
              {gradients.map(g => (
                <div key={g.name} className={`gradient-swatch ${note.background?.value === g.value ? 'active' : ''}`}
                  style={{ background: g.value }} onClick={() => onUpdate({ background: { type: 'gradient', value: g.value } })}>
                  <span>{g.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const style = target === 'title' ? note.titleStyle : currentSection?.titleStyle;
  const updateStyle = (updates) => {
    if (target === 'title') {
      onUpdate({ titleStyle: { ...note.titleStyle, ...updates } });
    } else {
      onUpdateSection({ titleStyle: { ...currentSection?.titleStyle, ...updates } });
    }
  };

  return (
    <div className="style-panel-overlay" onClick={onClose}>
      <div className="style-panel" onClick={e => e.stopPropagation()}>
        <h3>{target === 'title' ? 'Title Style' : 'Section Style'}</h3>
        <div className="style-section">
          <label>Font Family</label>
          <select value={style?.fontFamily || 'Inter'} onChange={e => updateStyle({ fontFamily: e.target.value })}>
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="style-section">
          <label>Font Size</label>
          <select value={style?.fontSize || '24px'} onChange={e => updateStyle({ fontSize: e.target.value })}>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="style-section">
          <label>Color</label>
          <div className="color-grid">
            {colors.map(c => (
              <div key={c} className={`color-swatch ${style?.color === c ? 'active' : ''}`}
                style={{ background: c }} onClick={() => updateStyle({ color: c })} />
            ))}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ============ CODE BLOCK ============
function CodeBlock({ content, language, onChange, onDelete }) {
  const [copied, setCopied] = useState(false);
  const languages = ['javascript', 'python', 'html', 'css', 'java', 'cpp', 'sql', 'bash'];

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <select value={language || 'javascript'} onChange={e => onChange(content, e.target.value)}>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="code-actions">
          <button onClick={handleCopy}>{copied ? '✓ Copied' : '📋 Copy'}</button>
          <button onClick={onDelete}>🗑️</button>
        </div>
      </div>
      <textarea
        className="code-textarea"
        value={content}
        onChange={e => onChange(e.target.value, language)}
        placeholder="Enter code..."
        spellCheck={false}
      />
    </div>
  );
}

// ============ CONTENT BLOCK ============
function ContentBlock({ block, onChange, onDelete }) {
  const [showToolbar, setShowToolbar] = useState(false);

  const toggleStyle = (styleProp) => {
    const current = block.style?.[styleProp];
    onChange({ style: { ...block.style, [styleProp]: !current } });
  };

  const textStyle = {
    fontWeight: block.style?.bold ? 'bold' : 'normal',
    fontStyle: block.style?.italic ? 'italic' : 'normal',
    textDecoration: block.style?.underline ? 'underline' : 'none',
    color: block.style?.color || '#334155',
  };

  return (
    <div className="content-block" onMouseEnter={() => setShowToolbar(true)} onMouseLeave={() => setShowToolbar(false)}>
      {block.type === 'bullet' && <span className="bullet">•</span>}
      <textarea
        className="content-textarea"
        value={block.content}
        onChange={e => onChange({ content: e.target.value })}
        placeholder={block.type === 'bullet' ? 'Bullet point...' : 'Type here...'}
        style={textStyle}
      />
      {showToolbar && (
        <div className="content-toolbar">
          <button className={block.style?.bold ? 'active' : ''} onClick={() => toggleStyle('bold')}><b>B</b></button>
          <button className={block.style?.italic ? 'active' : ''} onClick={() => toggleStyle('italic')}><i>I</i></button>
          <button className={block.style?.underline ? 'active' : ''} onClick={() => toggleStyle('underline')}><u>U</u></button>
          <input type="color" value={block.style?.color || '#334155'} onChange={e => onChange({ style: { ...block.style, color: e.target.value } })} />
          <button onClick={onDelete}>🗑️</button>
        </div>
      )}
    </div>
  );
}

// ============ MAIN WORKSPACE ============
function NoteWorkspace({ note, selectedSectionId, onSelectSection, onUpdate, onGoHome }) {
  const [localNote, setLocalNote] = useState(note);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [styleTarget, setStyleTarget] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const isFirstRender = useRef(true);

  useEffect(() => { setLocalNote(note); }, [note.id]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('unsaved');
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      await onUpdate(localNote);
      setSaveStatus('saved');
    }, 1500);
    return () => clearTimeout(timer);
  }, [localNote]);

  const updateNote = (updates) => setLocalNote(prev => ({ ...prev, ...updates }));
  const currentSection = localNote?.sections?.find(s => s.id === selectedSectionId);

  const addSection = () => {
    const newSection = { id: Date.now().toString(), title: 'New Section', titleStyle: { fontFamily: 'Inter', fontSize: '24px', color: '#334155' }, content: [] };
    updateNote({ sections: [...(localNote.sections || []), newSection] });
    onSelectSection(newSection.id);
  };

  const updateSection = (sectionId, updates) => {
    const sections = localNote.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s);
    updateNote({ sections });
  };

  const deleteSection = (sectionId) => {
    const sections = localNote.sections.filter(s => s.id !== sectionId);
    updateNote({ sections });
    if (selectedSectionId === sectionId) onSelectSection(sections[0]?.id || null);
  };

  const addContent = (type) => {
    if (!currentSection) return;
    const newBlock = { id: Date.now().toString(), type, content: '', style: {} };
    if (type === 'code') newBlock.language = 'javascript';
    updateSection(currentSection.id, { content: [...(currentSection.content || []), newBlock] });
  };

  const updateContent = (blockId, updates) => {
    if (!currentSection) return;
    const content = currentSection.content.map(b => b.id === blockId ? { ...b, ...updates } : b);
    updateSection(currentSection.id, { content });
  };

  const deleteContent = (blockId) => {
    if (!currentSection) return;
    updateSection(currentSection.id, { content: currentSection.content.filter(b => b.id !== blockId) });
  };

  const getBackground = () => {
    if (!localNote?.background) return '#ffffff';
    return localNote.background.type === 'gradient' ? localNote.background.value : localNote.background.value || '#ffffff';
  };

  return (
    <div className="workspace-container">
      <Sidebar
        sections={localNote?.sections}
        selectedSectionId={selectedSectionId}
        onSelectSection={onSelectSection}
        onAddSection={addSection}
        onGoHome={onGoHome}
      />

      <div className="workspace-main" style={{ background: getBackground() }}>
        <div className="workspace-topbar">
          <span className={`save-status ${saveStatus}`}>
            {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✓ Saved' : '○ Unsaved'}
          </span>
          <button onClick={() => { setStyleTarget('title'); setShowStylePanel(true); }}>🎨 Title Style</button>
          <button onClick={() => { setStyleTarget('background'); setShowStylePanel(true); }}>🖼️ Background</button>
        </div>

        <input className="workspace-title-input" value={localNote?.title || ''} onChange={e => updateNote({ title: e.target.value })} placeholder="Note Title..."
          style={{ fontFamily: localNote?.titleStyle?.fontFamily, color: localNote?.titleStyle?.color, fontSize: localNote?.titleStyle?.fontSize }} />

        {currentSection ? (
          <div className="section-content">
            <div className="section-header">
              <input className="section-title-input" value={currentSection.title || ''} onChange={e => updateSection(currentSection.id, { title: e.target.value })} placeholder="Section Title..."
                style={{ fontFamily: currentSection.titleStyle?.fontFamily, color: currentSection.titleStyle?.color }} />
              <button onClick={() => { setStyleTarget('section'); setShowStylePanel(true); }}>🎨</button>
              <button onClick={() => window.confirm('Delete section?') && deleteSection(currentSection.id)}>🗑️</button>
            </div>

            <div className="content-blocks">
              {currentSection.content?.map(block => (
                block.type === 'code' ? (
                  <CodeBlock key={block.id} content={block.content} language={block.language}
                    onChange={(content, language) => updateContent(block.id, { content, language })} onDelete={() => deleteContent(block.id)} />
                ) : (
                  <ContentBlock key={block.id} block={block} onChange={(updates) => updateContent(block.id, updates)} onDelete={() => deleteContent(block.id)} />
                )
              ))}
            </div>

            <div className="add-content-bar">
              <button onClick={() => addContent('text')}>📝 Text</button>
              <button onClick={() => addContent('code')}>💻 Code</button>
              <button onClick={() => addContent('bullet')}>• Bullet</button>
            </div>
          </div>
        ) : (
          <div className="no-section">
            <p>No sections yet</p>
            <button onClick={addSection}>Create First Section</button>
          </div>
        )}
      </div>

      {showStylePanel && (
        <StylePanel target={styleTarget} note={localNote} currentSection={currentSection}
          onUpdate={updateNote} onUpdateSection={(updates) => updateSection(currentSection?.id, updates)} onClose={() => setShowStylePanel(false)} />
      )}
    </div>
  );
}

export default NoteWorkspace;