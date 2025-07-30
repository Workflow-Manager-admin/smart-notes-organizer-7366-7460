/**
 * Floating Action Button for adding new notes.
 * Props:
 *  onClick: function
 *  icon: (optional) JSX/icon, defaults to "+"
 */
import React from "react";
import "../styles/FAB.css";

// PUBLIC_INTERFACE
export default function FAB({ onClick, icon }) {
  return (
    <button className="fab" aria-label="Add note" onClick={onClick}>
      {icon || "+"}
    </button>
  );
}
