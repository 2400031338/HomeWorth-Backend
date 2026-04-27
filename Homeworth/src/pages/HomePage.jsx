import React, { useState } from "react";

export default function HomePage({ onLogin, onRegister }) {
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const openFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    setShowFeaturesModal(true);
  };

  const openHow = () => {
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="navbar">
        <div className="navbar-brand">Home<span>Worth</span></div>
        <div className="navbar-actions">
          <div className="nav-logo" onClick={openFeatures}><div className="logo-circle">HW</div></div>
          <button className="nav-btn nav-btn-ghost" onClick={openFeatures}>Features</button>
          <button className="nav-btn nav-btn-ghost" onClick={openHow} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.06)" }}>?</div>
            How it works
          </button>
          <button className="nav-btn nav-btn-ghost" onClick={onLogin}>Login</button>
          <button className="nav-btn nav-btn-solid" onClick={onRegister}>Register</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero fade-up">
        <div className="auth-tag" style={{ position:'absolute', top:32, left:48 }}>🏠 India's #1 Property Enhancement Platform</div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <h1>
            Add Real Value to<br /><span style={{ color: '#F5A56B' }}>Your Home</span>
          </h1>
          <p className="subtitle">
            Expert-curated improvement ideas for Indian middle-class homes.<br />
            Get personalised recommendations and boost your property's market value.
          </p>

          <div className="stats">
            {[['10,000+', 'Homeowners'], ['₹2.5Cr+', 'Value Added'], ['95%', 'Satisfaction']].map(([n, l]) => (
              <div key={l} className="stat">
                <div className="number">{n}</div>
                <div className="label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ background: 'var(--cream)', padding: '72px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, color: 'var(--earth)', marginBottom: 14 }}>Why HomeWorth?</h2>
          <p style={{ color: 'var(--earth-mid)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>Everything you need to make smart property investment decisions</p>
        </div>

        {/* anchor target for 'How it works' — content moved to page bottom */}
        <div id="how" />

        <div className="feature-cards">
          {[
            { icon:'🏡', title:'Personalised Advice', desc:'Recommendations tailored to your property type & location.' },
            { icon:'💡', title:'Expert Ideas', desc:'Curated by renovation professionals experienced in Indian homes.' },
            { icon:'📊', title:'ROI Estimates', desc:'See potential value gain before you spend a rupee.' },
            { icon:'🔒', title:'Secure & Private', desc:'Your data stays with you; we never share it.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="icon">{f.icon}</div>
              <div className="title">{f.title}</div>
              <div className="desc">{f.desc}</div>
            </div>
          ))}
        </div>



        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <p style={{ color: 'var(--earth-mid)', fontSize: 16, marginBottom: 22 }}>Ready to transform your property?</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={onRegister} style={{ padding: '14px 40px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 16px rgba(232,99,26,0.35)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = '#C85515'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--saffron)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Create Free Account
            </button>
            <button onClick={onLogin} style={{ padding: '14px 40px', background: 'white', color: 'var(--earth)', border: '1.5px solid #DDD5CA', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.background = 'var(--saffron-pale)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#DDD5CA'; e.currentTarget.style.background = 'white'; }}>
              Sign In
            </button>
          </div>
        </div>
      </div>

      {showFeaturesModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowFeaturesModal(false)}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <h2 className="modal-title">Top Features of HomeWorth</h2>
            <p className="modal-sub">Quick overview of what this project provides</p>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22 }}>💡</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Expert-Curated Recommendations</div>
                  <div style={{ color: 'var(--earth-mid)' }}>Admin-managed improvement ideas with expected ROI and cost ranges.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22 }}>📋</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Property Submission & Review</div>
                  <div style={{ color: 'var(--earth-mid)' }}>Homeowners can submit properties and admins can review and provide feedback.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22 }}>🔖</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Save & Track Ideas</div>
                  <div style={{ color: 'var(--earth-mid)' }}>Users can save ideas, mark them implemented, and track progress.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22 }}>⚙️</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Admin Dashboard</div>
                  <div style={{ color: 'var(--earth-mid)' }}>Admins manage recommendations, review properties, and moderate content.</div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowFeaturesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* How-it-Works workflow placed at the bottom of the main page */}
      <div style={{ padding: '48px 48px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--earth)', marginBottom: 18 }}>How it works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { n: 1, title: 'Create Account', desc: 'Register as a homeowner to get personalised recommendations.' },
              { n: 2, title: 'Submit Property', desc: 'Add photos and property details for expert review.' },
              { n: 3, title: 'Receive Recommendations', desc: 'Browse curated improvement ideas with estimated ROI & costs.' },
              { n: 4, title: 'Implement & Track', desc: 'Save ideas, mark implemented, and monitor value uplift.' },
            ].map(step => (
              <div key={step.n} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow)', minHeight: 120 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--saffron-pale)', color: 'var(--saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{step.n}</div>
                  <div style={{ fontWeight: 800 }}>{step.title}</div>
                </div>
                <p style={{ marginTop: 10, color: 'var(--earth-mid)', fontSize: 13 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--earth)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'white' }}>Home<span style={{ color: '#F5A56B' }}>Worth</span></div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Empowering Indian Homeowners · FSAD-PS22</div>
      </div>

    </div>
  );
}