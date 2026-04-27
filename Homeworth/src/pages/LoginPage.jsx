import React, { useState } from "react";
import { authAPI } from "../service/api";

export default function LoginPage({ onLogin, onBack, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password, role);

      // Handle the backend response format
      const user = {
        id: response.id,
        name: response.fullName || response.name || email.split('@')[0],
        email: response.email,
        role: response.role
      };

      // If no token in response, create a mock token for now
      if (!response.token) {
        localStorage.setItem('token', `mock-token-${user.id}`);
      } else {
        localStorage.setItem('token', response.token);
      }
      localStorage.setItem('homeworth_user', JSON.stringify(user));

      // Call onLogin with user data
      onLogin(user);
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = "Login failed. Please try again.";

      if (err.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please check if your backend is running.";
      } else if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = err.response.data?.message || `Login failed (${err.response.status})`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="navbar">
        <div className="navbar-brand">Home<span>Worth</span></div>
        <div className="navbar-actions">
          <button className="nav-btn nav-btn-ghost" onClick={onBack}>← Home</button>
          <button className="nav-btn nav-btn-ghost" onClick={onGoRegister}>Register</button>
        </div>
      </nav>

      <div className="auth-page fade-in" style={{ flex: 1 }}>
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-dec1" /><div className="auth-left-dec2" />
          <div className="auth-left-inner">
            <button className="auth-back-btn" onClick={onBack}><span>←</span> Back to Home</button>
            <div className="auth-tag">🔐 Secure Access</div>
            <h1 className="auth-left-title">Welcome<br /><span>Back</span></h1>
            <p className="auth-left-desc">Sign in to access your dashboard and manage properties.</p>
            <div className="auth-features">
              {[["🏠", "View your submitted properties"], ["📋", "Check expert feedback & reviews"], ["💡", "Browse improvement ideas"], ["📈", "Track your property value"]].map(([ic, t]) => (
                <div key={t} className="auth-feature"><div className="feature-dot">{ic}</div><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card fade-up">
            <h2 className="auth-card-title">Sign In</h2>
            <p className="auth-card-sub">Enter your credentials to access your account</p>

            {error && <div className="error-box">⚠️ {error}</div>}



            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="Enter your Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
            </div>
            <div className="form-group">
              <label className="form-label">Login As</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="user">🏠 Homeowner (User)</option>
                <option value="admin">⚙️ Administrator</option>
              </select>
            </div>

            <button className="btn-primary" style={{ marginTop: 8 }} onClick={handle} disabled={loading}>
              {loading ? "Signing In..." : "Sign In →"}
            </button>

            <div className="divider">or</div>
            <p style={{ textAlign: "center", fontSize: 14, color: "var(--earth-mid)" }}>
              Don't have an account?{" "}
              <span className="link-text" onClick={onGoRegister}>Create one free</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}