import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./auth";
import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
  listFolders,
  listTags,
} from "./api";

import Sidebar from "./components/Sidebar";
import AppBar from "./components/AppBar";
import FAB from "./components/FAB";
import NoteList from "./components/NoteList";
import NoteDetail from "./components/NoteDetail";
import AuthForm from "./components/AuthForm";

import "./App.css";

// Layout style colors
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffb300",
};

function NotesAppMain() {
  // Auth
  const { user, token, loading: loadingUser, login, register, logout, error: authError } = useAuth();
  // App state
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentTag, setCurrentTag] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState('light');
  const [saving, setSaving] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Initial load of folders/tags/notes
  useEffect(() => {
    if (!token) return;
    listFolders({ token }).then(setFolders);
    listTags({ token }).then(setTags);
    loadNotes();
  // eslint-disable-next-line
  }, [token, currentFolder, currentTag, search]);

  // Loads main note list
  function loadNotes() {
    if (!token) return;
    listNotes({
      token,
      folder: currentFolder,
      tag: currentTag,
      search,
    })
      .then(setNotes)
      .catch((e) => setError(e.message));
  }

  // Current note
  const currentNote =
    (notes && currentNoteId && notes.find((n) => n.id === currentNoteId)) || null;

  // Handler: select folder
  function handleSelectFolder(id) {
    setCurrentFolder(id);
    setCurrentTag(null);
    setCurrentNoteId(null);
  }

  // Handler: select tag
  function handleSelectTag(id) {
    setCurrentTag(id);
    setCurrentFolder(null);
    setCurrentNoteId(null);
  }

  // Handler: note click
  function handleNoteClick(id) {
    setCurrentNoteId(id);
    setShowNoteEditor(true);
  }

  // Handler: save/create note
  async function handleSaveNote(note) {
    setSaving(true);
    try {
      let updated;
      if (note.id) {
        updated = await updateNote({ token, id: note.id, note });
      } else {
        updated = await createNote({
          token,
          note: {
            ...note,
            folder: note.folder || null,
            tags: (note.tags || []).map((t) => t.name)
          },
        });
      }
      setShowNoteEditor(false);
      setCurrentNoteId(updated.id);
      loadNotes();
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  }

  // Handler: delete note
  async function handleDeleteNote() {
    if (!currentNote) return;
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote({ token, id: currentNote.id });
      setShowNoteEditor(false);
      setCurrentNoteId(null);
      loadNotes();
    } catch (e) {
      setError(e.message);
    }
  }

  // Handler: add folder
  function handleAddFolder(name) {
    // This could call backend to create folder; for now just add locally. Real implementation: call API!
    const fakeId = Math.random().toString(36).slice(2, 10);
    setFolders((prev) => [...prev, { id: fakeId, name }]);
  }

  // Handler: theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Handler: start new note
  function handleNewNote() {
    setCurrentNoteId(null);
    setShowNoteEditor(true);
  }

  // Handler: search
  function handleSearch(val) {
    setSearch(val);
    setCurrentNoteId(null);
    // listNotes will reload due to search change
  }

  if (loadingUser) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app-auth-container">
        <AuthForm
          onLogin={login}
          onRegister={register}
          loading={loadingUser}
          error={authError}
        />
      </div>
    );
  }

  return (
    <div className="app-main">
      <Sidebar
        folders={folders}
        tags={tags}
        currentFolder={currentFolder}
        currentTag={currentTag}
        onFolderSelect={handleSelectFolder}
        onTagSelect={handleSelectTag}
        onAddFolder={handleAddFolder}
        user={user}
        onLogout={logout}
      />
      <div className="app-content">
        <AppBar
          title="My Notes"
          search={search}
          onSearch={handleSearch}
        >
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </AppBar>
        <div className="main-content-body">
          <div className="notes-list-section">
            <NoteList
              notes={notes}
              onNoteClick={handleNoteClick}
              currentNote={currentNote?.id}
            />
          </div>
          <div className="note-detail-section">
            {showNoteEditor || currentNote ? (
              <NoteDetail
                note={showNoteEditor ? currentNote || {} : {}}
                folders={folders}
                tags={tags}
                onChange={() => {}}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
              />
            ) : (
              <div className="note-detail-empty">Select or create a note to view details.</div>
            )}
          </div>
        </div>
        <FAB onClick={handleNewNote} />
        {error && <div className="app-error">{error}</div>}
        {saving && <div className="app-saving">Saving...</div>}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <NotesAppMain />
    </AuthProvider>
  );
}

export default App;
