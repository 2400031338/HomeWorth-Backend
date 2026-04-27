import React, { useState } from "react";
import { BackIcon } from "../components/Icons";
import { authAPI } from "../service/api";

export default function RegisterPage({ onRegister, onBack, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    if (!name || !email || !password || !confirm) { setError("All fields are required."); return; }
    if (password !== confirm)   { setError("Passwords do not match."); return; }
    if (password.length < 6)    { setError("Password must be at least 6 characters."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    try {
      const userData = { fullName: name, email, password, role };
      const response = await authAPI.register(userData);
      
      // Handle the backend response format
      const user = {
        id: response.id,
        name: response.fullName || response.name || name,
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
      // Call onRegister with user data
      onRegister(user);
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = "Registration failed. Please try again.";

      if (err.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please check if your backend is running.";
      } else if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid registration data.";
        } else if (err.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = err.response.data?.message || `Registration failed (${err.response.status})`;
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
          <button className="nav-btn nav-btn-ghost" onClick={onGoLogin}>Login</button>
        </div>
      </nav>

      <div className="auth-page fade-in" style={{ flex: 1 }}>
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-dec1" /><div className="auth-left-dec2" />
          <div className="auth-left-inner">
            <button className="auth-back-btn" onClick={onBack}><BackIcon /> Back to Home</button>
            <div className="auth-tag">✨ New Account</div>
            <h1 className="auth-left-title">Join<br/><span>HomeWorth</span><br/>Today</h1>
            <p className="auth-left-desc">Create your free account and start unlocking your property's true potential with expert guidance.</p>
            <div className="auth-features">
              {[ ["🆓","100% free to join"], ["🏠","Submit unlimited properties"], ["📊","Get expert improvement advice"], ["📈","Track ROI on upgrades"] ].map(([ic, t]) => (
                <div key={t} className="auth-feature"><div className="feature-dot">{ic}</div><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card fade-up">
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-sub">Fill in the details below to get started for free</p>

            {error && <div className="error-box">⚠️ {error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
            </div>
            <div className="form-group">
              <label className="form-label">Register As</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="user">🏠 Homeowner (User)</option>
                <option value="admin">⚙️ Administrator</option>
              </select>
            </div>

            <div className="success-box">🔒 Your data is secure. We never share your information with third parties.</div>

            <button className="btn-primary" onClick={handle} disabled={loading}>
              {loading ? "Creating Account..." : "Create My Account →"}
            </button>

            <div className="divider">or</div>
            <p style={{ textAlign: "center", fontSize: 14, color: "var(--earth-mid)" }}>
              Already have an account?{" "}
              <span className="link-text" onClick={onGoLogin}>Sign in here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}