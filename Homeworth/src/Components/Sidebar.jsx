import React from "react";
import { LogOutIcon } from "../components/Icons";

export default function Sidebar({ user, navItems, activeView, setView, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-name">Home<span>Worth</span></div>
        <div className="sidebar-brand-role">{user.role === "admin" ? "Admin Panel" : "My Dashboard"}</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0] ?? "H"}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOutIcon /> Sign out
        </button>
      </div>
    </div>
  );
}
