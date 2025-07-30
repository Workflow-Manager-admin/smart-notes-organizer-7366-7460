/**
 * NoteList: Renders list of notes (mini cards).
 * Props:
 *   notes: Array of {id, title, updatedAt, tags, folder, snippet}
 *   onNoteClick(id)
 *   currentNote
 */
import React from "react";
import "../styles/NoteList.css";

// PUBLIC_INTERFACE
export default function NoteList({ notes, onNoteClick, currentNote }) {
  return (
    <div className="note-list">
      {notes.length === 0 && (
        <div className="note-list-empty">No notes found.</div>
      )}
      {notes.map((note) => (
        <div
          key={note.id}
          className={`note-card${note.id === currentNote ? " selected" : ""}`}
          onClick={() => onNoteClick(note.id)}
          tabIndex={0}
          aria-label={note.title}
        >
          <div className="note-card-title">{note.title || <em>Untitled</em>}</div>
          <div className="note-card-tags">
            {(note.tags || []).map((tag) => (
              <span className="note-tag" key={tag.id}>#{tag.name}</span>
            ))}
          </div>
          <div className="note-card-snippet" dangerouslySetInnerHTML={{ __html: note.snippet }} />
          <div className="note-card-updated">
            {new Date(note.updatedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
