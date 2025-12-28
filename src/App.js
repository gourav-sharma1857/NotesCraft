import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Login from './components/Login';
import NoteWorkspace from './components/NoteWorkspace';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, [user]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setSelectedNote(null);
  };

  const createNote = async () => {
    if (!user) return;
    const newNote = {
      userId: user.uid,
      title: 'Untitled Note',
      titleStyle: { fontFamily: 'Inter', fontSize: '32px', color: '#1e293b', fontWeight: '700' },
      background: { type: 'solid', value: '#ffffff' },
      sections: [{ id: Date.now().toString(), title: 'Introduction', titleStyle: { fontFamily: 'Inter', fontSize: '24px', color: '#334155' }, content: [] }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'notes'), newNote);
    const createdNote = { id: docRef.id, ...newNote };
    setSelectedNote(createdNote);
    setSelectedSectionId(newNote.sections[0].id);
  };

  const deepClean = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClean);
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, typeof v === 'object' ? deepClean(v) : v])
    );
  };

  const updateNote = async (noteId, updates) => {
    const noteRef = doc(db, 'notes', noteId);
    const cleanUpdates = deepClean(updates);
    await updateDoc(noteRef, { ...cleanUpdates, updatedAt: new Date().toISOString() });
  };

  const requestDeleteNote = (note) => {
    setConfirmDelete({
      title: 'Delete Note?',
      message: `Are you sure you want to delete "${note.title || 'Untitled'}"? This action cannot be undone.`,
      onConfirm: async () => {
        await deleteDoc(doc(db, 'notes', note.id));
        if (selectedNote?.id === note.id) setSelectedNote(null);
      }
    });
  };

  const openNote = (note) => {
    setSelectedNote(note);
    setSelectedSectionId(note.sections?.[0]?.id || null);
  };

  const goHome = () => {
    setSelectedNote(null);
    setSelectedSectionId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) return <Login onLogin={signIn} />;

  if (selectedNote) {
    return (
      <NoteWorkspace
        note={selectedNote}
        selectedSectionId={selectedSectionId}
        onSelectSection={setSelectedSectionId}
        onUpdate={async (updates) => {
          await updateNote(selectedNote.id, updates);
          setSelectedNote(prev => ({ ...prev, ...updates }));
        }}
        onGoHome={goHome}
      />
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1> Notes Craft</h1>
        <div className="header-right">
          <span>{user.email}</span>
          <button onClick={handleSignOut} className="btn btn-secondary">Sign Out</button>
        </div>
      </header>
      <main className="home-main">
        <button onClick={createNote} className="btn btn-primary create-btn">+ New Note</button>
        <div className="notes-grid">
          {notes.length === 0 ? (
            <p className="no-notes">No notes yet. Create your first one!</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-card" onClick={() => openNote(note)}
                style={{ background: note.background?.type === 'gradient' ? note.background.value : note.background?.value || '#fff' }}>
                <h3 style={{ fontFamily: note.titleStyle?.fontFamily || 'Inter', color: note.titleStyle?.color || '#1e293b' }}>
                  {note.title || 'Untitled'}
                </h3>
                <p>{note.sections?.length || 0} sections</p>
                <button
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); requestDeleteNote(note); }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ✅ Confirm delete modal */}
      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>{confirmDelete.title}</h3>
            <p>{confirmDelete.message}</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="danger-btn" onClick={async () => {
                await confirmDelete.onConfirm();
                setConfirmDelete(null);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
