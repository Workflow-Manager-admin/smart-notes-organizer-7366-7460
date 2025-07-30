/**
 * Sidebar navigation for folders, tags, and account.
 * Props:
 *   folders: Array of {id, name}
 *   tags: Array of {id, name}
 *   currentFolder: folder id, currentTag: tag id
 *   onFolderSelect(id), onTagSelect(id)
 *   onAddFolder(name)
 *   onLogout()
 */
import React, { useState } from "react";
import "../styles/Sidebar.css";

export default function Sidebar({
  folders = [],
  tags = [],
  currentFolder,
  currentTag,
  onFolderSelect,
  onTagSelect,
  onAddFolder,
  onLogout,
  user,
}) {
  const [newFolder, setNewFolder] = useState("");
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Folders</div>
      <ul className="sidebar-list">
        <li
          className={!currentFolder ? "active" : ""}
          onClick={() => onFolderSelect(null)}
        >
          All Notes
        </li>
        {folders.map((f) => (
          <li
            key={f.id}
            className={f.id === currentFolder ? "active" : ""}
            onClick={() => onFolderSelect(f.id)}
          >
            {f.name}
          </li>
        ))}
      </ul>
      <form
        className="sidebar-add-folder"
        onSubmit={(e) => {
          e.preventDefault();
          if (newFolder.trim()) {
            onAddFolder(newFolder.trim());
            setNewFolder("");
          }
        }}
      >
        <input
          type="text"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          placeholder="Add folder"
          aria-label="Add folder"
        />
        <button type="submit">+</button>
      </form>
      <div className="sidebar-title">Tags</div>
      <ul className="sidebar-list tags-list">
        {tags.map((tag) => (
          <li key={tag.id} className={tag.id === currentTag ? "active" : ""} onClick={() => onTagSelect(tag.id)}>
            #{tag.name}
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          {user && user.email}
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </aside>
  );
}
