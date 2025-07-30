/**
 * AppBar/topbar for title and search. Optional right-side actions.
 * Props:
 *  title: string
 *  search: current search term
 *  onSearch: fn(search string)
 *  children: any additional actions (JSX)
 */
import React from "react";
import "../styles/AppBar.css";

// PUBLIC_INTERFACE
export default function AppBar({ title, search, onSearch, children }) {
  return (
    <header className="appbar">
      <div className="appbar-title">{title}</div>
      <div className="appbar-search">
        <input
          aria-label="search"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search notes..."
        />
      </div>
      <div className="appbar-actions">{children}</div>
    </header>
  );
}
