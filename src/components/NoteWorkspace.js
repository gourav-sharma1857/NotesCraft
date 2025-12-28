import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import Sidebar from './Sidebar';
import './NoteWorkspace.css';

// ============ RICH TEXT BLOCK ============
function RichTextBlock({ block, onChange, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const isUpdating = useRef(false);

  const fonts = ['Inter', 'Georgia', 'Playfair Display', 'Roboto Mono', 'Arial', 'Courier New', 'Verdana', 'Times New Roman'];
  const sizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'];

  useEffect(() => {
    if (editorRef.current && block.content !== undefined && !isUpdating.current) {
      if (editorRef.current.innerHTML !== block.content) {
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        const start = range ? range.startOffset : 0;
        
        editorRef.current.innerHTML = block.content;
        
        // Restore cursor position
        if (range && editorRef.current.firstChild) {
          try {
            const newRange = document.createRange();
            const textNode = editorRef.current.firstChild;
            newRange.setStart(textNode, Math.min(start, textNode.length || 0));
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } catch (e) {
            // Ignore cursor restoration errors
          }
        }
      }
    }
  }, [block.content]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdating.current = true;
      onChange({ content: editorRef.current.innerHTML });
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const removeFormatting = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      document.execCommand('removeFormat', false, null);
      editorRef.current?.focus();
      handleInput();
    }
  };

  return (
    <div className="text-block" onMouseEnter={() => setShowToolbar(true)} onMouseLeave={() => setShowToolbar(false)}>
      <div className="block-controls">
        <button className="control-btn" onClick={onMoveUp} disabled={!canMoveUp}>↑</button>
        <button className="control-btn" onClick={onMoveDown} disabled={!canMoveDown}>↓</button>
        <button className="control-btn delete" onClick={onDelete}>×</button>
      </div>

      {showToolbar && (
        <div className="text-toolbar">
          <button onClick={() => execCommand('undo')} title="Undo">↶</button>
          <button onClick={() => execCommand('redo')} title="Redo">↷</button>
          <div className="toolbar-divider"></div>
          <button onClick={() => execCommand('bold')} title="Bold"><b>B</b></button>
          <button onClick={() => execCommand('italic')} title="Italic"><i>I</i></button>
          <button onClick={() => execCommand('underline')} title="Underline"><u>U</u></button>
          <button onClick={() => execCommand('insertUnorderedList')} title="Bullet">•</button>
          <button onClick={() => execCommand('insertOrderedList')} title="Numbered">1.</button>
          <div className="toolbar-divider"></div>
          
          <select onChange={(e) => { if(e.target.value) execCommand('fontName', e.target.value); }} value="">
            <option value="">Font</option>
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          
          <select onChange={(e) => { if(e.target.value) execCommand('fontSize', e.target.value); }} value="">
            <option value="">Size</option>
            {sizes.map((s, i) => <option key={s} value={i+1}>{s}</option>)}
          </select>
          
          <div className="color-picker">
            <span>A</span>
            <input type="color" onChange={(e) => execCommand('foreColor', e.target.value)} title="Text color" />
          </div>
          
          <div className="color-picker">
            <span>🖍</span>
            <input type="color" onChange={(e) => execCommand('hiliteColor', e.target.value)} title="Highlight" />
          </div>
          
          <button onClick={removeFormatting} title="Clear formatting" className="clear-fmt">✕</button>
        </div>
      )}

      <div
        ref={editorRef}
        className="text-editor"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning
        data-placeholder="Start typing..."
      />
    </div>
  );
}

// ============ CODE BLOCK ============
function CodeBlock({ block, onChange, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const languages = ['javascript', 'python', 'html', 'css', 'java', 'cpp', 'sql', 'bash', 'typescript', 'json', 'php', 'ruby'];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="block-controls">
        <button className="control-btn" onClick={onMoveUp} disabled={!canMoveUp}>↑</button>
        <button className="control-btn" onClick={onMoveDown} disabled={!canMoveDown}>↓</button>
        <button className="control-btn delete" onClick={onDelete}>×</button>
      </div>

      <div className="code-container">
        <div className="code-header">
          <select value={block.language || 'javascript'} onChange={e => onChange({ ...block, language: e.target.value })}>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={block.content || ''}
          onChange={e => {
            onChange({ ...block, content: e.target.value });
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
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="subheading-block" onMouseEnter={() => setShowTools(true)} onMouseLeave={() => setShowTools(false)}>
      <div className="block-controls">
        <button className="control-btn" onClick={onMoveUp} disabled={!canMoveUp}>↑</button>
        <button className="control-btn" onClick={onMoveDown} disabled={!canMoveDown}>↓</button>
        <button className="control-btn delete" onClick={onDelete}>×</button>
      </div>

      {showTools && (
        <div className="subheading-toolbar">
          <div className="color-picker">
            <span>Color</span>
            <input type="color" value={block.style?.color || '#1e293b'} 
              onChange={(e) => onChange({ ...block, style: { ...block.style, color: e.target.value } })} />
          </div>
        </div>
      )}

      <input
        className="subheading-input"
        value={block.content || ''}
        onChange={e => onChange({ ...block, content: e.target.value })}
        placeholder="Subheading..."
        style={{ color: block.style?.color || '#1e293b' }}
      />
    </div>
  );
}

// ============ MAIN WORKSPACE ============
function NoteWorkspace({ note, selectedSectionId, onSelectSection, onUpdate, onGoHome }) {
  const [localNote, setLocalNote] = useState(note);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showBgPicker, setShowBgPicker] = useState(false);
  const isFirstRender = useRef(true);
  const saveTimeout = useRef(null);

  // Listen to Firebase changes
  useEffect(() => {
    if (!note.id) return;

    const unsubscribe = onSnapshot(doc(db, 'notes', note.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLocalNote({ id: doc.id, ...data });
      }
    });

    return () => unsubscribe();
  }, [note.id]);

  // Auto-save to Firebase
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('unsaved');

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await updateDoc(doc(db, 'notes', localNote.id), {
          title: localNote.title || '',
          background: localNote.background || '#ffffff',
          sections: localNote.sections || [],
          updatedAt: new Date()
        });
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving:', error);
        setSaveStatus('error');
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [localNote.title, localNote.background, localNote.sections, localNote.id]);

  const updateNote = (updates) => setLocalNote(prev => ({ ...prev, ...updates }));
  const currentSection = localNote?.sections?.find(s => s.id === selectedSectionId);
  const currentSectionIndex = localNote?.sections?.findIndex(s => s.id === selectedSectionId);

  const addSection = (atIndex = -1) => {
    const newSection = { id: Date.now().toString(), title: 'New Section', content: [] };
    const sections = [...(localNote.sections || [])];
    if (atIndex >= 0) sections.splice(atIndex, 0, newSection);
    else sections.push(newSection);
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
    if (!window.confirm('Delete this section?')) return;
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

  const bgColors = ['#ffffff', '#f8fafc', '#f1f5f9', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', '#ecfdf5'];
  const bgGradients = [
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { name: 'Night', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { name: 'Sky', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  ];

  const getBg = () => localNote?.background || '#ffffff';

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
      />

      <div className="workspace-main" style={{ background: getBg() }}>
        <div className="top-bar">
          <button className="menu-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
          <span className={`save-status ${saveStatus}`}>
            {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'error' ? '⚠ Error' : '○ Unsaved'}
          </span>
          <button className="bg-btn" onClick={() => setShowBgPicker(!showBgPicker)}>
            🎨 Background
          </button>
        </div>

        {showBgPicker && (
          <div className="bg-picker-overlay" onClick={() => setShowBgPicker(false)}>
            <div className="bg-picker-modal" onClick={e => e.stopPropagation()}>
              <h4>Background</h4>
              <div className="bg-colors">
                {bgColors.map(c => (
                  <div key={c} className="bg-swatch" style={{ background: c }} 
                    onClick={() => { updateNote({ background: c }); setShowBgPicker(false); }} />
                ))}
              </div>
              <div className="bg-gradients">
                {bgGradients.map(g => (
                  <div key={g.name} className="bg-gradient" style={{ background: g.value }}
                    onClick={() => { updateNote({ background: g.value }); setShowBgPicker(false); }}>
                    {g.name}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowBgPicker(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="content-area">
          <input 
            className="note-title" 
            value={localNote?.title || ''} 
            onChange={e => updateNote({ title: e.target.value })} 
            placeholder="Note Title"
          />

          {currentSection ? (
            <>
              <div className="section-header">
                <div className="section-moves">
                  <button onClick={() => moveSection(currentSectionIndex, -1)} disabled={currentSectionIndex === 0}>↑</button>
                  <button onClick={() => moveSection(currentSectionIndex, 1)} disabled={currentSectionIndex === localNote.sections.length - 1}>↓</button>
                </div>
                <input 
                  className="section-title" 
                  value={currentSection.title || ''} 
                  onChange={e => updateSection(currentSection.id, { title: e.target.value })} 
                  placeholder="Section Title"
                />
                <div className="section-btns">
                  <button onClick={() => addSection(currentSectionIndex)}>+ Above</button>
                  <button onClick={() => addSection(currentSectionIndex + 1)}>+ Below</button>
                  <button className="delete" onClick={() => deleteSection(currentSection.id)}>Delete</button>
                </div>
              </div>

              <div className="blocks">
                {currentSection.content?.map((block, index) => {
                  const canMoveUp = index > 0;
                  const canMoveDown = index < currentSection.content.length - 1;
                  
                  if (block.type === 'code') {
                    return <CodeBlock key={block.id} block={block} 
                      onChange={(updates) => updateContent(block.id, updates)} 
                      onDelete={() => deleteContent(block.id)}
                      onMoveUp={() => moveContent(index, -1)}
                      onMoveDown={() => moveContent(index, 1)}
                      canMoveUp={canMoveUp} canMoveDown={canMoveDown} />;
                  } else if (block.type === 'subheading') {
                    return <SubheadingBlock key={block.id} block={block}
                      onChange={(updates) => updateContent(block.id, updates)}
                      onDelete={() => deleteContent(block.id)}
                      onMoveUp={() => moveContent(index, -1)}
                      onMoveDown={() => moveContent(index, 1)}
                      canMoveUp={canMoveUp} canMoveDown={canMoveDown} />;
                  } else {
                    return <RichTextBlock key={block.id} block={block}
                      onChange={(updates) => updateContent(block.id, updates)}
                      onDelete={() => deleteContent(block.id)}
                      onMoveUp={() => moveContent(index, -1)}
                      onMoveDown={() => moveContent(index, 1)}
                      canMoveUp={canMoveUp} canMoveDown={canMoveDown} />;
                  }
                })}
              </div>

              <div className="add-block">
                <button onClick={() => addContent('text')}>+ Text</button>
                <button onClick={() => addContent('subheading')}>+ Subheading</button>
                <button onClick={() => addContent('code')}>+ Code</button>
              </div>
            </>
          ) : (
            <div className="empty">
              <h3>No sections yet</h3>
              <button onClick={() => addSection()}>Create First Section</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteWorkspace;