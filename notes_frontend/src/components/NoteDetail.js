/**
 * NoteDetail: View/Edit single note. Rich text editing, tags/folder.
 * Props:
 *   note: {id, title, body, tags, folder}
 *   folders: all folders
 *   tags: all tags
 *   onChange: function({title, body, tags, folder})
 *   onDelete
 *   onSave
 */
import React, { useState, useEffect, useRef } from "react";
import "../styles/NoteDetail.css";

// Minimal rich text (contentEditable), not full featured, for minimalism
function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value;
  }, [value]);
  function handleInput(e) {
    onChange(e.currentTarget.innerHTML);
  }
  return (
    <div
      className="rich-text-editor"
      contentEditable
      ref={ref}
      aria-label="Note body"
      onInput={handleInput}
      suppressContentEditableWarning={true}
      style={{
        border: "1px solid var(--border-color)",
        minHeight: 120,
        padding: 12,
        borderRadius: 6,
        margin: "8px 0",
        fontFamily: "inherit",
        background: "var(--bg-secondary)",
        outline: "none"
      }}
    ></div>
  );
}

// PUBLIC_INTERFACE
export default function NoteDetail({ note, folders, tags, onChange, onDelete, onSave }) {
  const [editNote, setEditNote] = useState({ ...note });
  const [editing, setEditing] = useState(!note.id); // New = editing

  useEffect(() => {
    setEditNote({ ...note });
    setEditing(!note.id);
  }, [note]);

  function updateField(field, value) {
    setEditNote((n) => ({ ...n, [field]: value }));
    if (onChange) onChange({ ...editNote, [field]: value });
  }

  function toggleEditing() { setEditing((e) => !e); }

  return (
    <div className="note-detail">
      <div className="note-detail-title-area">
        {editing ? (
          <input
            className="note-title-input"
            placeholder="Title"
            value={editNote.title || ""}
            onChange={e => updateField("title", e.target.value)}
          />
        ) : (
          <div className="note-detail-title">
            {note.title || <em>Untitled</em>}
          </div>
        )}
        <div style={{ marginLeft: "auto" }}>
          {!editing && (
            <button onClick={toggleEditing}>Edit</button>
          )}
          {editing && note.id && (
            <button onClick={onDelete} style={{ color: "red" }}>
              Delete
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <>
          <RichTextEditor
            value={editNote.body || ""}
            onChange={val => updateField("body", val)}
          />
          <div className="note-detail-meta">
            <select
              value={editNote.folder || ""}
              onChange={e => updateField("folder", e.target.value)}
            >
              <option value="">No Folder</option>
              {folders.map(f => (
                <option value={f.id} key={f.id}>{f.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Comma separated tags"
              value={(editNote.tags || []).map(t => t.name).join(", ")}
              onChange={e =>
                updateField(
                  "tags",
                  e.target.value
                    .split(",")
                    .map(v => v.trim())
                    .filter(Boolean)
                    .map((name, i) => ({ id: i, name }))
                )
              }
              style={{ minWidth: 120 }}
            />
          </div>
          <button className="save-btn" onClick={() => onSave(editNote)}>
            Save
          </button>
          <button className="cancel-btn" onClick={toggleEditing}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <div
            className="note-detail-body"
            dangerouslySetInnerHTML={{ __html: note.body || "" }}
          />
          <div className="note-detail-meta">
            <span>
              Folder: {folders.find(f => f.id === note.folder)?.name || "None"}
            </span>
            <span>
              Tags: {(note.tags || []).map((tag) => (
                <span className="note-tag" key={tag.id}>#{tag.name} </span>
              ))}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
