import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './/Sidebar';
import './NoteWorkspace.css';

// ============ STYLE PANEL ============
function StylePanel({ target, note, currentSection, onUpdate, onUpdateSection, onClose }) {
  const fonts = ['Inter', 'Georgia', 'Playfair Display', 'Roboto Mono', 'Arial', 'Times New Roman', 'Courier New', 'Verdana'];
  const sizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'];
  const bgColors = [
  '#0f172a', 
  '#111827', 
  '#020617', 
  '#171717', 
  '#064e3b', 
  '#4c1d95', 
  '#1e1b4b', 
  '#1c1917', 
  '#ffffff', 
  '#f8fafc',
  '#f1f5f9',
  '#fef3c7',
  '#dcfce7',
  '#dbeafe',
  '#fce7f3',
  '#ecfdf5'
];  
  const bgGradients = [
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { name: 'Night', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { name: 'Sky', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
    { name: 'Deep Space', value: 'linear-gradient(135deg, #000000 0%, #434343 100%)' },
  { name: 'Midnight City', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { name: 'Abyss', value: 'linear-gradient(135deg, #000428 0%, #004e92 100%)' },
  { name: 'Eclipse', value: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' },
  { name: 'Dark Purple', value: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)' },
  { name: 'Obsidian', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { name: 'Evergreen Dark', value: 'linear-gradient(135deg, #051937 0%, #004d7a 100%)' },
  { name: 'Royal Dark', value: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' },
  ];

  if (target === 'background') {
    return (
      <div className="style-panel-overlay" onClick={onClose}>
        <div className="style-panel" onClick={e => e.stopPropagation()}>
          <h3>🖼️ Background</h3>
          <div className="style-section">
            <label>Solid Colors</label>
            <div className="color-grid">
              {['#ffffff', '#f8fafc', '#f1f5f9', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', '#fef2f2', '#f5f3ff', '#ecfdf5', '#1e293b', '#0f172a'].map(c => (
                <div key={c} className={`color-swatch ${note.background?.value === c ? 'active' : ''}`}
                  style={{ background: c, border: c === '#ffffff' ? '1px solid #e2e8f0' : 'none' }} 
                  onClick={() => onUpdate({ background: { type: 'solid', value: c } })} />
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
          <button className="panel-close-btn" onClick={onClose}>Done</button>
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
        <h3>{target === 'title' ? '✨ Title Style' : '📝 Section Style'}</h3>
        <div className="style-section">
          <label>Font Family</label>
          <select value={style?.fontFamily || 'Inter'} onChange={e => updateStyle({ fontFamily: e.target.value })}>
            {fonts.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </div>
        <div className="style-section">
          <label>Font Size</label>
          <select value={style?.fontSize || '24px'} onChange={e => updateStyle({ fontSize: e.target.value })}>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="style-section">
          <label>Text Color</label>
          <div className="color-grid large">
            {colors.map(c => (
              <div key={c} className={`color-swatch ${style?.color === c ? 'active' : ''}`}
                style={{ background: c, border: c === '#ffffff' ? '1px solid #e2e8f0' : 'none' }} 
                onClick={() => updateStyle({ color: c })} />
            ))}
          </div>
        </div>
        <button className="panel-close-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

// ============ RICH TEXT EDITOR ============
function RichTextEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(true);

  const colors = [
    '#1e293b', '#334155', '#dc2626', '#ea580c', '#d97706', 
    '#65a30d', '#16a34a', '#0d9488', '#0891b2', '#2563eb', 
    '#7c3aed', '#c026d3', '#db2777', '#e11d48', '#ffffff'
  ];

  const bgColors = [
    'transparent', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', 
    '#fef2f2', '#f5f3ff', '#ecfdf5', '#fff7ed', '#f0f9ff'
  ];

  useEffect(() => {
    if (editorRef.current && block.content && editorRef.current.innerHTML !== block.content) {
      editorRef.current.innerHTML = block.content;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange({ content: editorRef.current.innerHTML });
    }
  };

  const execCommand = (command, value = null) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.warn('No selection available');
      return;
    }

    // Save the selection before focusing
    const range = selection.getRangeAt(0);
    
    // Ensure editor is active
    editorRef.current?.focus();
    
    // Restore selection
    selection.removeAllRanges();
    selection.addRange(range);

    // Force inline styles
    document.execCommand("styleWithCSS", false, true);

    // Apply the command
    if (command === "foreColor" || command === "hiliteColor") {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, value);
    }

    handleInput();
  };




  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertText', '    ');
    }
  };

  return (
    <div className="rich-text-block">
      <div className="block-side-controls">
        <button className="move-btn" onClick={onMoveUp} disabled={!canMoveUp} title="Move up">↑</button>
        <button className="move-btn" onClick={onMoveDown} disabled={!canMoveDown} title="Move down">↓</button>
      </div>
      
      <div className="rich-text-container">
        {showToolbar && (
          <div className="rich-toolbar">
            <div className="toolbar-group">
              <button onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} title="Bold"><b>B</b></button>
              <button onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} title="Italic"><i>I</i></button>
              <button onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }} title="Underline"><u>U</u></button>
              <button onMouseDown={(e) => { e.preventDefault(); execCommand('strikeThrough'); }} title="Strikethrough"><s>S</s></button>
            </div>
            
            <div className="toolbar-divider"></div>
            
            <div className="toolbar-group">
              <button onClick={() => execCommand('insertUnorderedList')} title="Bullet list">•</button>
              <button onClick={() => execCommand('insertOrderedList')} title="Numbered list">1.</button>
            </div>
            
            <div className="toolbar-divider"></div>
            
            <div className="toolbar-group">
              <div className="color-dropdown-wrapper">
                <button className="color-btn" title="Text color">A<span className="color-indicator" style={{ background: '#dc2626' }}></span></button>
                <div className="color-dropdown-menu">
                  <div className="dropdown-label">Text Color</div>
                  <div className="color-options">
                    {colors.map(c => (
                      <div key={c} className="color-opt" style={{ background: c, border: c === '#ffffff' ? '1px solid #ddd' : 'none' }} 
                        onMouseDown={(e) => { e.preventDefault(); execCommand('foreColor', c); }} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="color-dropdown-wrapper">
                <button className="color-btn" title="Highlight">🖍️</button>
                <div className="color-dropdown-menu">
                  <div className="dropdown-label">Highlight</div>
                  <div className="color-options">
                    {bgColors.map(c => (
                      <div key={c} className="color-opt" 
                        style={{ background: c === 'transparent' ? '#fff' : c, border: '1px solid #ddd' }} 
                        onMouseDown={(e) => { e.preventDefault(); execCommand('hiliteColor', c); }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="toolbar-divider"></div>
            
            <div className="toolbar-group">
              <select onChange={(e) => execCommand('fontSize', e.target.value)} defaultValue="3" className="size-select">
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="7">Huge</option>
              </select>
            </div>
            
            <button className="delete-block-btn" onClick={onDelete} title="Delete block">🗑️</button>
          </div>
        )}
        
       <div
          ref={editorRef}          // ✅ fix this
          className="rich-editor"
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder="Start typing..."
          style={{
              background: block.style?.background || 'transparent'
                }}
        />
      </div>
    </div>
  );
}

// ============ CODE BLOCK ============
function CodeBlock({ content, language, onChange, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const languages = ['javascript', 'python', 'java', 'c++'];

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="code-block">
      <div className="block-side-controls">
        <button className="move-btn" onClick={onMoveUp} disabled={!canMoveUp}>↑</button>
        <button className="move-btn" onClick={onMoveDown} disabled={!canMoveDown}>↓</button>
      </div>
      
      <div className="code-container">
        <div className="code-header">
          <select value={language || 'javascript'} onChange={e => onChange(content, e.target.value)}>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="code-actions">
            <button onClick={handleCopy} className="code-action-btn">
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button onClick={onDelete} className="code-action-btn delete">🗑️</button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={content}
          onChange={e => {
            onChange(e.target.value, language);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="// Enter code..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// ============ SUBHEADING BLOCK ============
function SubheadingBlock({ block, onChange, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  return (
    <div className="subheading-block">
      <div className="block-side-controls">
        <button className="move-btn" onClick={onMoveUp} disabled={!canMoveUp}>↑</button>
        <button className="move-btn" onClick={onMoveDown} disabled={!canMoveDown}>↓</button>
      </div>
      <input
        className="subheading-input"
        value={block.content}
        onChange={e => onChange({ content: e.target.value })}
        placeholder="Subheading..."
      />
      <button className="inline-delete-btn" onClick={onDelete}>🗑️</button>
    </div>
  );
}

// ============ NOTE PREVIEW & PDF EXPORT ============
function NotePreview({ note, onClose, onExportPDF }) {
  const previewRef = useRef(null);

  const getBackground = () => {
    if (!note?.background) return '#ffffff';
    return note.background.type === 'gradient' ? note.background.value : note.background.value || '#ffffff';
  };

  const handleExportPDF = () => {
    const content = previewRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${note.title || 'Note'}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Georgia&family=Playfair+Display:wght@400;500;600;700&family=Roboto+Mono&display=swap" rel="stylesheet">
          <style>
            @media print {
              @page { margin: 20mm; }
            }
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 40px;
              background: ${getBackground()};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            h1 { margin-bottom: 30px; }
            h2 { margin: 25px 0 15px 0; }
            h3 { margin: 20px 0 10px 0; font-size: 18px; border-left: 3px solid #3b82f6; padding-left: 12px; }
            p { margin: 10px 0; line-height: 1.7; }
            pre {
              background: #1e293b;
              color: #4ade80;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              font-family: 'Roboto Mono', monospace;
              font-size: 13px;
            }
            ul, ol { margin: 10px 0; padding-left: 24px; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={e => e.stopPropagation()}>
        <div className="preview-header">
          <h3>📄 Preview</h3>
          <div className="preview-actions">
            <button className="export-btn" onClick={handleExportPDF}>
              📥 Export PDF
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
        
        <div className="preview-scroll" style={{ background: getBackground() }}>
          <div ref={previewRef} className="preview-content">
            <h1 style={{
              fontFamily: note.titleStyle?.fontFamily || 'Inter',
              fontSize: note.titleStyle?.fontSize || '32px',
              color: note.titleStyle?.color || '#1e293b',
              fontWeight: '700'
            }}>
              {note.title || 'Untitled Note'}
            </h1>
            
            {note.sections?.map(section => (
              <div key={section.id} className="preview-section">
                <h2 style={{
                  fontFamily: section.titleStyle?.fontFamily || 'Inter',
                  fontSize: section.titleStyle?.fontSize || '24px',
                  color: section.titleStyle?.color || '#334155'
                }}>
                  {section.title || 'Untitled Section'}
                </h2>
                
                {section.content?.map(block => (
                  <div key={block.id} className="preview-block">
                    {block.type === 'code' ? (
                      <pre><code>{block.content}</code></pre>
                    ) : block.type === 'subheading' ? (
                      <h3>{block.content}</h3>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN WORKSPACE ============
function NoteWorkspace({ note, selectedSectionId, onSelectSection, onUpdate, onGoHome }) {
  const [localNote, setLocalNote] = useState(note);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [styleTarget, setStyleTarget] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
  const currentSectionIndex = localNote?.sections?.findIndex(s => s.id === selectedSectionId);

  const addSection = (atIndex = -1) => {
    const newSection = { 
      id: Date.now().toString(), 
      title: 'New Section', 
      titleStyle: { fontFamily: 'Inter', fontSize: '24px', color: '#334155' }, 
      content: [] 
    };
    const sections = [...(localNote.sections || [])];
    if (atIndex >= 0) {
      sections.splice(atIndex, 0, newSection);
    } else {
      sections.push(newSection);
    }
    updateNote({ sections });
    onSelectSection(newSection.id);
  };

  const moveSection = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= localNote.sections.length) return;
    const sections = [...localNote.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    updateNote({ sections });
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
    const newBlock = { 
      id: Date.now().toString(), 
      type, 
      content: '', 
      style: {},
      language: type === 'code' ? 'javascript' : undefined
    };
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

  const moveContent = (blockIndex, direction) => {
    if (!currentSection) return;
    const toIndex = blockIndex + direction;
    if (toIndex < 0 || toIndex >= currentSection.content.length) return;
    const content = [...currentSection.content];
    const [moved] = content.splice(blockIndex, 1);
    content.splice(toIndex, 0, moved);
    updateSection(currentSection.id, { content });
  };

  const getBackground = () => {
    if (!localNote?.background) return '#ffffff';
    return localNote.background.type === 'gradient' ? localNote.background.value : localNote.background.value || '#ffffff';
  };

  return (
    <div className="workspace-layout">
      <Sidebar
        sections={localNote?.sections}
        selectedSectionId={selectedSectionId}
        onSelectSection={onSelectSection}
        onAddSection={() => addSection()}
        onGoHome={onGoHome}
        onMoveSection={moveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="workspace-main" style={{ background: getBackground() }}>
        <div className="workspace-topbar">
          <div className="topbar-left">
            <button className="topbar-btn icon-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? '☰' : '✕'}
            </button>
            <span className={`save-indicator ${saveStatus}`}>
              {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✓ Saved' : '○ Unsaved'}
            </span>
          </div>
          
          <div className="topbar-right">
            <button className="topbar-btn" onClick={() => setShowPreview(true)}>
              <span className="btn-icon">👁️</span> Preview
            </button>
            <button className="topbar-btn" onClick={() => { setStyleTarget('title'); setShowStylePanel(true); }}>
              <span className="btn-icon">✨</span> Title Style
            </button>
            <button className="topbar-btn" onClick={() => { setStyleTarget('background'); setShowStylePanel(true); }}>
              <span className="btn-icon">🎨</span> Background
            </button>
          </div>
        </div>

        <div className="workspace-content">
          <input 
            className="note-title-input" 
            value={localNote?.title || ''} 
            onChange={e => updateNote({ title: e.target.value })} 
            placeholder="Note Title..."
            style={{ 
              fontFamily: localNote?.titleStyle?.fontFamily, 
              color: localNote?.titleStyle?.color, 
              fontSize: localNote?.titleStyle?.fontSize 
            }} 
          />

          {currentSection ? (
            <div className="section-editor">
              <div className="section-header-bar">
                <div className="section-controls">
                  <button className="section-move-btn" onClick={() => moveSection(currentSectionIndex, -1)} disabled={currentSectionIndex === 0}>↑</button>
                  <button className="section-move-btn" onClick={() => moveSection(currentSectionIndex, 1)} disabled={currentSectionIndex === localNote.sections.length - 1}>↓</button>
                </div>
                
                <input 
                  className="section-title-input" 
                  value={currentSection.title || ''} 
                  onChange={e => updateSection(currentSection.id, { title: e.target.value })} 
                  placeholder="Section Title..."
                  style={{ 
                    fontFamily: currentSection.titleStyle?.fontFamily, 
                    color: currentSection.titleStyle?.color 
                  }} 
                />
                
                <div className="section-actions">
                  <button className="section-action-btn" onClick={() => { setStyleTarget('section'); setShowStylePanel(true); }}>🎨</button>
                  <button className="section-action-btn delete" onClick={() => window.confirm('Delete this section?') && deleteSection(currentSection.id)}>🗑️</button>
                </div>
              </div>

              <div className="blocks-container">
                {currentSection.content?.map((block, index) => {
                  const canMoveUp = index > 0;
                  const canMoveDown = index < currentSection.content.length - 1;
                  
                  if (block.type === 'code') {
                    return (
                      <CodeBlock 
                        key={block.id} 
                        content={block.content} 
                        language={block.language}
                        onChange={(content, language) => updateContent(block.id, { content, language })} 
                        onDelete={() => deleteContent(block.id)}
                        onMoveUp={() => moveContent(index, -1)}
                        onMoveDown={() => moveContent(index, 1)}
                        canMoveUp={canMoveUp}
                        canMoveDown={canMoveDown}
                      />
                    );
                  } else if (block.type === 'subheading') {
                    return (
                      <SubheadingBlock
                        key={block.id}
                        block={block}
                        onChange={(updates) => updateContent(block.id, updates)}
                        onDelete={() => deleteContent(block.id)}
                        onMoveUp={() => moveContent(index, -1)}
                        onMoveDown={() => moveContent(index, 1)}
                        canMoveUp={canMoveUp}
                        canMoveDown={canMoveDown}
                      />
                    );
                  } else {
                    return (
                      <RichTextEditor 
                        key={block.id} 
                        block={block} 
                        onChange={(updates) => updateContent(block.id, updates)} 
                        onDelete={() => deleteContent(block.id)}
                        onMoveUp={() => moveContent(index, -1)}
                        onMoveDown={() => moveContent(index, 1)}
                        canMoveUp={canMoveUp}
                        canMoveDown={canMoveDown}
                      />
                    );
                  }
                })}
              </div>

              <div className="add-block-bar">
                <button className="add-block-btn" onClick={() => addContent('text')}>
                  <span></span> Text Block
                </button>
                <button className="add-block-btn" onClick={() => addContent('subheading')}>
                  <span></span> Subheading
                </button>
                <button className="add-block-btn" onClick={() => addContent('code')}>
                  <span></span> Code Block
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No sections yet</h3>
              <p>Create your first section to start writing</p>
              <button className="create-section-btn" onClick={() => addSection()}>
                + Create Section
              </button>
            </div>
          )}
        </div>
      </div>

      {showStylePanel && (
        <StylePanel 
          target={styleTarget} 
          note={localNote} 
          currentSection={currentSection}
          onUpdate={updateNote} 
          onUpdateSection={(updates) => updateSection(currentSection?.id, updates)} 
          onClose={() => setShowStylePanel(false)} 
        />
      )}

      {showPreview && (
        <NotePreview note={localNote} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

export default NoteWorkspace;
