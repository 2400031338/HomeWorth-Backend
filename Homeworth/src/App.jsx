import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import Sidebar from "./Components/Sidebar";
import { HomeIcon, StarIcon, BldgIcon, CheckIcon, Ico } from "./components/Icons";
import { authAPI, propertiesAPI, recommendationsAPI } from "./service/api";
import "./styles/main.css";

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen]   = useState("home"); // "home" | "login" | "register"
  const [user,   setUser]     = useState(null);
  const [dashView, setDashView] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [properties,      setProperties]      = useState([]);
  const [loading, setLoading] = useState(true);

  const LOCAL_USER_KEY = 'homeworth_user';
  const LOCAL_PROPERTIES_KEY = 'homeworth_properties';
  const LOCAL_RECOMMENDATIONS_KEY = 'homeworth_recommendations';

  // Load data from API or localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      const savedUser = localStorage.getItem(LOCAL_USER_KEY);
      const savedProperties = localStorage.getItem(LOCAL_PROPERTIES_KEY);
      const savedRecommendations = localStorage.getItem(LOCAL_RECOMMENDATIONS_KEY);

      if (savedProperties) {
        setProperties(JSON.parse(savedProperties));
      }
      if (savedRecommendations) {
        setRecommendations(JSON.parse(savedRecommendations));
      }

      try {
        const token = localStorage.getItem('token');
        let fallbackUser = savedUser ? JSON.parse(savedUser) : null;

        if (token) {
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
            setDashView(currentUser.role === "admin" ? "admin-dashboard" : "user-properties");
            setScreen("dashboard");
            fallbackUser = currentUser;
          } catch (error) {
            if (fallbackUser) {
              setUser(fallbackUser);
              setDashView(fallbackUser.role === "admin" ? "admin-dashboard" : "user-properties");
              setScreen("dashboard");
            } else {
              localStorage.removeItem('token');
            }
          }
        } else if (fallbackUser) {
          setUser(fallbackUser);
          setDashView(fallbackUser.role === "admin" ? "admin-dashboard" : "user-properties");
          setScreen("dashboard");
        }

        try {
          const [recs, props] = await Promise.all([
            recommendationsAPI.getAll(),
            propertiesAPI.getAll()
          ]);

          if (Array.isArray(recs) && recs.length > 0) {
            setRecommendations(recs);
          }
          if (Array.isArray(props) && props.length > 0) {
            setProperties(props);
          }
        } catch (error) {
          console.warn('Data endpoints not available yet, using existing local data');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
    setDashView(u.role === "admin" ? "admin-dashboard" : "user-properties");
    setScreen("dashboard");
  };

  const handleRegister = (nu) => {
    setUser(nu);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nu));
    setDashView(nu.role === "admin" ? "admin-dashboard" : "user-properties");
    setScreen("dashboard");
  };

  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
    setScreen("home");
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(LOCAL_RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
  }, [recommendations]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (screen === "home")     return <HomePage onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />;
  if (screen === "login")    return <LoginPage onLogin={handleLogin} onBack={() => setScreen("home")} onGoRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterPage onRegister={handleRegister} onBack={() => setScreen("home")} onGoLogin={() => setScreen("login")} />;

  if (user?.role === "admin")
    return <AdminLayout user={user} view={dashView} setView={setDashView} onLogout={handleLogout}
      recommendations={recommendations} setRecommendations={setRecommendations}
      properties={properties} setProperties={setProperties} />;

  return <UserLayout user={user} setUser={setUser} view={dashView} setView={setDashView} onLogout={handleLogout}
    recommendations={recommendations}
    properties={properties.filter(p => p.userId === user.id)}
    setProperties={setProperties}
    allProperties={properties}
  />;
}

// recommendation options used in admin form
const REC_OPTIONS = {
  "Interior": [
    { title:"Interior Paint & Wall Texture", roi:"6-10%", cost:"₹25K – ₹60K", description:"Fresh coat of premium emulsion paint with one accent texture wall per room. Low cost, high visual impact improvement." },
  ],
  "Bathroom": [
    { title:"Full Bathroom Makeover", roi:"15-20%", cost:"₹60K – ₹1.5L", description:"Replace fittings, add glass shower partition, use anti-skid tiles and modern sanitary ware for a premium feel." },
    { title:"Glass Shower Partition", roi:"8-11%", cost:"₹18K – ₹35K", description:"Installing a frameless or semi-framed glass shower partition adds a contemporary touch and increases perceived bathroom value." },
    { title:"Sensor Faucets & Water-Saving Fixtures", roi:"6-9%", cost:"₹15K – ₹30K", description:"Touchless sensor taps and water-saving showerheads are increasingly sought after by eco-conscious buyers." },
    { title:"Anti-Skid Premium Tiles", roi:"7-10%", cost:"₹20K – ₹50K", description:"Replace slippery old tiles with Italian marble-finish or matte anti-skid tiles. Safety meets luxury aesthetics." },
  ],
  "Exterior": [
    { title:"Vastu-Compliant Main Entry", roi:"8-12%", cost:"₹20K – ₹50K", description:"Solid teak or steel door, name plate, well-lit entrance with potted plants. The first impression that sets buyer expectations." },
    { title:"Exterior Paint & Waterproofing", roi:"10-15%", cost:"₹40K – ₹90K", description:"Weather-resistant exterior paint with a waterproofing coat protects the structure and dramatically improves kerb appeal." },
    { title:"Balcony / Terrace Landscaping", roi:"7-11%", cost:"₹30K – ₹70K", description:"Convert bare balconies into green spaces with potted plants, artificial grass, and ambient lighting for lifestyle appeal." },
    { title:"Compound Wall & Gate Upgrade", roi:"6-9%", cost:"₹50K – ₹1.2L", description:"A new compound wall with designer gate adds security and premium feel, especially for independent houses." },
  ],
  "Lighting": [
    { title:"Smart Lighting System", roi:"10-13%", cost:"₹35K – ₹80K", description:"Replace conventional switches with smart dimmable LEDs and scene controllers. Instantly modern and energy efficient." },
    { title:"Decorative Pendant & Chandelier", roi:"6-9%", cost:"₹15K – ₹40K", description:"Statement lighting pieces in living and dining areas create luxury ambiance at a fraction of renovation cost." },
    { title:"Facade & Garden Lighting", roi:"5-8%", cost:"₹12K – ₹30K", description:"Outdoor wall lights, path lights, and garden spotlights improve nighttime kerb appeal significantly." },
  ],
  "Technology": [
    { title:"Smart Home Wiring & Automation", roi:"12-16%", cost:"₹80K – ₹1.8L", description:"Pre-wire for smart switches, video doorbell, and automated curtains. Future-proofing your property for tech-savvy buyers." },
    { title:"Video Door Phone / Smart Lock", roi:"8-11%", cost:"₹12K – ₹28K", description:"Colour video door phone or biometric smart lock adds security and is a much-sought feature in modern housing." },
    { title:"Solar Water Heater", roi:"9-14%", cost:"₹25K – ₹55K", description:"Solar water heater reduces electricity bills and appeals to eco-conscious buyers. Mandatory in many urban layouts." },
    { title:"CCTV & Security System", roi:"7-10%", cost:"₹20K – ₹50K", description:"4-camera CCTV system with DVR and remote monitoring. A strong safety selling point for families." },
  ],
  "Structural": [
    { title:"Waterproofing (Roof & Walls)", roi:"11-15%", cost:"₹30K – ₹80K", description:"Chemical waterproofing treatment for terrace slab and wet walls eliminates seepage, a major buyer concern in Indian homes." },
    { title:"Re-tiling & Grout Repair", roi:"7-10%", cost:"₹20K – ₹55K", description:"Replacing cracked tiles and re-grouting existing surfaces is a low-cost fix with outsized visual and structural impact." },
    { title:"Plumbing Upgrade (CPVC/PEX pipes)", roi:"8-12%", cost:"₹40K – ₹1L", description:"Replace old galvanised iron pipes with CPVC or PEX piping to eliminate rust, leakage, and water quality issues." },
  ],
  "Vastu & Wellness": [
    { title:"Vastu-Compliant Kitchen Placement", roi:"5-9%", cost:"₹15K – ₹40K", description:"Minor structural or cabinet adjustments to align kitchen with Vastu principles — fire/stove in SE direction is highly valued." },
    { title:"Meditation / Pooja Room Setup", roi:"5-8%", cost:"₹10K – ₹25K", description:"Dedicated pooja or meditation corner with marble/granite platform, indirect lighting, and wooden panelling. Deeply valued in Indian households." },
    { title:"Indoor Air Quality Improvement", roi:"6-9%", cost:"₹8K – ₹20K", description:"Air purifying indoor plants, ventilation fans, and non-VOC paints improve air quality and are increasingly important to health-conscious buyers." },
  ],
};

function AdminLayout({ user, view, setView, onLogout, recommendations, setRecommendations, properties, setProperties }) {
  const nav = [
    { id: "admin-dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { id: "admin-recommendations", label: "Recommendations", icon: <StarIcon /> },
    { id: "admin-properties", label: "Properties", icon: <BldgIcon /> },
  ];
  return (
    <div className="layout">
      <Sidebar user={user} navItems={nav} activeView={view} setView={setView} onLogout={onLogout} />
      <div className="main-content">
        {view === "admin-dashboard" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Overview and quick stats</p>
              </div>
            </div>
            <div className="page-body">
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div className="card" style={{ flex: 1 }}>
                  <h3>Recommendations</h3>
                  <p>{recommendations.length}</p>
                </div>
                <div className="card" style={{ flex: 1 }}>
                  <h3>Properties</h3>
                  <p>{properties.length}</p>
                </div>
              </div>
            </div>
          </>
        )}
        {view === "admin-recommendations" && <AdminRecommendations recommendations={recommendations} setRecommendations={setRecommendations} />}
        {view === "admin-properties" && <AdminProperties properties={properties} setProperties={setProperties} />}
      </div>
    </div>
  );
}

function AdminRecommendations({ recommendations, setRecommendations }) {
  const [isFormPage, setIsFormPage] = useState(false);
  const [form, setForm] = useState({ title:"", category:"", roi:"", cost:"", description:"" });
  const [saved, setSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const openForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({ title:item.title, category:item.category, roi:item.roi, cost:item.cost, description:item.description });
    } else {
      setEditingItem(null);
      setForm({ title:"", category:"", roi:"", cost:"", description:"" });
    }
    setIsFormPage(true);
  };

  const closeForm = () => {
    setIsFormPage(false);
    setEditingItem(null);
    setForm({ title:"", category:"", roi:"", cost:"", description:"" });
  };

  const handleAdd = async () => {
    const finalTitle = form.title === "__custom__" ? (form._customTitle || "") : form.title;
    if (!finalTitle || !form.category) return;

    try {
      const recommendationData = {
        title: finalTitle,
        category: form.category,
        roi: form.roi,
        cost: form.cost,
        description: form.description,
        tags: [form.category],
        fromAdmin: true
      };

      if (editingItem) {
        const updated = await recommendationsAPI.update(editingItem.id, recommendationData);
        setRecommendations(recommendations.map(x => x.id === editingItem.id ? updated : x));
      } else {
        const newRec = await recommendationsAPI.create(recommendationData);
        setRecommendations([...recommendations, newRec]);
      }

      setForm({ title:"", category:"", roi:"", cost:"", description:"" });
      setIsFormPage(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving recommendation:', error);
      // Fall back to local state if API fails
      const tempRec = {
        id: editingItem ? editingItem.id : Date.now(),
        title: finalTitle,
        category: form.category,
        roi: form.roi,
        cost: form.cost,
        description: form.description,
        tags: [form.category],
        fromAdmin: true
      };
      
      if (editingItem) {
        setRecommendations(recommendations.map(x => x.id === editingItem.id ? tempRec : x));
      } else {
        setRecommendations([...recommendations, tempRec]);
      }
      
      setForm({ title:"", category:"", roi:"", cost:"", description:"" });
      setIsFormPage(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setEditingItem(null);
    }
  };

  if (isFormPage) {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">{editingItem ? "Edit Recommendation" : "Add Recommendation"}</h1>
            <p className="page-subtitle">Create a new admin recommendation on a dedicated page</p>
          </div>
          <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 20px" }} onClick={closeForm}>Back to recommendations</button>
        </div>
        <div className="page-body">
          {saved && <div className="success-banner"><CheckIcon/> Recommendation saved!</div>}
          <div className="card" style={{ maxWidth:720, margin:"0 auto" }}>
            <div style={{ marginBottom:24 }}>
              <h2 style={{ marginBottom:8, fontSize:28 }}>{editingItem ? "Update Recommendation" : "New Recommendation"}</h2>
              <p style={{ color:"var(--earth-mid)", fontSize:14, lineHeight:1.7 }}>Enter all the details on one page to keep your admin recommendation form clean and structured.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category:e.target.value, title:"", roi:"", cost:"", description:""})}>
                <option value="">— Select a category —</option>
                {Object.keys(REC_OPTIONS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <select className="form-select" value={form.title} disabled={!form.category}
                onChange={e => {
                  const selected = REC_OPTIONS[form.category]?.find(o => o.title === e.target.value);
                  if (selected) setForm({...form, title:selected.title, roi:selected.roi, cost:selected.cost, description:selected.description});
                  else setForm({...form, title:e.target.value});
                }}>
                <option value="">— Select a title —</option>
                {form.category && REC_OPTIONS[form.category]?.map(o => (
                  <option key={o.title} value={o.title}>{o.title}</option>
                ))}
                {form.category && <option value="__custom__">✏️ Custom title...</option>}
              </select>
              {form.title === "__custom__" && (
                <input className="form-input" style={{ marginTop:8 }} placeholder="Enter custom title" value={form._customTitle||""} onChange={e => setForm({...form, _customTitle:e.target.value})} />
              )}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
              <div className="form-group">
                <label className="form-label">Expected ROI</label>
                <input className="form-input" placeholder="e.g. 18-22%" value={form.roi} onChange={e => setForm({...form,roi:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Cost Range</label>
                <input className="form-input" placeholder="e.g. ₹1.2L – ₹2.5L" value={form.cost} onChange={e => setForm({...form,cost:e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Detailed description of the improvement..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
            </div>

            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", flexWrap:"wrap", marginTop:20 }}>
              <button className="btn-secondary" onClick={closeForm}>Cancel</button>
              <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 24px" }} onClick={handleAdd}>{editingItem ? "Save Recommendation" : "Add Recommendation"}</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div><h1 className="page-title">Recommendations</h1><p className="page-subtitle">Manage improvement ideas for homeowners</p></div>
        <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 20px" }} onClick={() => openForm(null)}>+ Add New</button>
      </div>
      <div style={{ marginBottom:16 }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search recommendations..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="page-body">
        {saved && <div className="success-banner"><CheckIcon/> Recommendation saved!</div>}
        {recommendations.length === 0 ? (
          <div className="card" style={{ textAlign:"center", padding:"56px 40px" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>⭐</div>
            <h3 style={{ marginBottom:10 }}>No recommendations yet</h3>
            <p style={{ color:"var(--earth-mid)", fontSize:14 }}>Create your first admin recommendation using the button above.</p>
          </div>
        ) : (
          <div className="rec-grid">
            {recommendations
              .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(r => (
                <div key={r.id} className="rec-card">
                  <div className="rec-header">
                    <div><span className="category-badge">{r.category}</span><div className="rec-title">{r.title}</div></div>
                    <span className="rec-roi">ROI {r.roi}</span>
                  </div>
                  <div className="rec-desc">{r.description}</div>
                  <div className="rec-cost">Cost: {r.cost}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div className="rec-tags">{r.tags?.map(t => <span key={t} className="tag">{t}</span>)}</div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn-sm" style={{ background:"#F3F4F6", color:"#374151", fontSize:12 }} onClick={() => openForm(r)}>Edit</button>
                      <button className="btn-sm" style={{ background:"#FEE2E2", color:"#B91C1C", fontSize:12 }} onClick={() => setRecommendations(recommendations.filter(x => x.id!==r.id))}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

function AdminProperties({ properties, setProperties }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [propSearch, setPropSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleReview = async () => {
    try {
      const updated = await propertiesAPI.update(selected.id, {
        ...selected,
        status: "reviewed",
        adminNote: note
      });
      setProperties(properties.map(p => p.id === selected.id ? updated : p));
      setSelected(null);
      setNote("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating property:', error);
      // Fall back to local state if API fails
      setProperties(properties.map(p => p.id === selected.id ? {...p, status:"reviewed", adminNote:note} : p));
      setSelected(null);
      setNote("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <>
      <div className="page-header"><div><h1 className="page-title">Review Properties</h1><p className="page-subtitle">Evaluate submissions and provide expert feedback</p></div></div>
      <div className="page-body">
        {saved && <div className="success-banner"><CheckIcon/> Review submitted!</div>}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:12 }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search homeowner..."
            value={propSearch}
            onChange={e => setPropSearch(e.target.value)}
          />
          <select className="search-input" style={{ maxWidth:120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Photo</th><th>Homeowner</th><th>Property</th><th>Location</th><th>Area/Age</th><th>Issues</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {properties.length===0 && <tr><td colSpan={8} style={{ textAlign:"center", color:"var(--earth-mid)", padding:"40px" }}>No properties submitted yet.</td></tr>}
                {properties
                    .filter(p => p.userName.toLowerCase().includes(propSearch.toLowerCase()))
                    .filter(p => !statusFilter || p.status === statusFilter)
                    .map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.image
                        ? <img src={p.image} alt="Property" style={{ width:56, height:44, objectFit:"cover", borderRadius:8, border:"1.5px solid #EDE6DC" }} />
                        : <div style={{ width:56, height:44, borderRadius:8, background:"#F0EAE2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏠</div>
                      }
                    </td>
                    <td><strong>{p.userName}</strong></td><td>{p.type}</td><td>{p.location}</td>
                    <td>{p.area}<br/><span style={{ fontSize:12, color:"var(--earth-mid)" }}>{p.age}</span></td>
                    <td style={{ maxWidth:180, fontSize:13 }}>{p.issues}</td>
                    <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
                    <td><button className="btn-sm btn-orange" onClick={() => { setSelected(p); setNote(p.adminNote||""); }}>{p.status==="reviewed"?"Edit":"Review"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selected && (
        <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div className="modal">
            <h2 className="modal-title">Review Property</h2>
            <p className="modal-sub">{selected.userName} · {selected.type} · {selected.location}</p>
            {selected.image && (
              <div style={{ marginBottom:20, borderRadius:12, overflow:"hidden", border:"1.5px solid #EDE6DC" }}>
                <img src={selected.image} alt="Property" style={{ width:"100%", height:200, objectFit:"cover", display:"block" }} />
              </div>
            )}
            <div style={{ background:"var(--saffron-pale)", borderRadius:12, padding:"16px 18px", marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>Property Details</div>
              <div style={{ fontSize:13, color:"var(--earth-mid)", lineHeight:1.8 }}>Area: {selected.area} · Age: {selected.age}<br/>Issues: {selected.issues}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Expert Feedback & Recommendations</label>
              <textarea className="form-textarea" style={{ minHeight:120 }} placeholder="Provide improvement recommendations, ROI, priority..." value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn-sm btn-green" style={{ fontSize:14, padding:"10px 24px" }} onClick={handleReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════
// USER
// ════════════════════════════════════════════
function UserLayout({ user, setUser, view, setView, onLogout, recommendations, properties, setProperties, allProperties }) {
  const nav = [
    { id:"user-profile",      label:"My Profile",      icon:<Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" s={18}/> },
    { id:"user-properties",   label:"My Properties",   icon:<BldgIcon/> },
    { id:"user-improvements", label:"Recommendations", icon:<StarIcon/> },
    { id:"user-saved",       label:"Saved Ideas",     icon:<Ico d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" s={18}/> },
  ];
  return (
    <div className="layout">
      <Sidebar user={user} navItems={nav} activeView={view} setView={setView} onLogout={onLogout} />
      <div className="main-content">
        {view==="user-profile"      && <UserProfile user={user} setUser={setUser} />}
        {view==="user-properties"   && <UserProperties user={user} properties={properties} setProperties={setProperties} allProperties={allProperties} />}
        {view==="user-improvements" && <UserImprovements recommendations={recommendations} properties={properties} />}
        {view==="user-saved"        && <UserSaved recommendations={recommendations} />}
      </div>
    </div>
  );
}

// ── A. USER PROFILE ──────────────────────────────────────────────────────────
function UserProfile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone||"", city: user.city||"" });
  const [budget, setBudget] = useState(user.budget||"");
  const [goal, setGoal] = useState(user.goal||"");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      // For now, just update local state
      // You can add a user update API endpoint later
      setUser({ ...user, ...form, budget, goal });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <div className="page-header">
        <div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Manage your personal information and preferences</p></div>
        {!editing && <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 20px" }} onClick={() => setEditing(true)}>✏️ Edit Profile</button>}
      </div>
      <div className="page-body">
        {saved && <div className="success-banner"><CheckIcon/> Profile updated successfully!</div>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {/* Personal Info */}
          <div className="card">
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,var(--saffron),var(--saffron-light))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, color:"white" }}>{(editing ? form.name : user.name)[0]?.toUpperCase()}</div>
              <div>
                <h3 style={{ fontSize:20 }}>{editing ? form.name : user.name}</h3>
                <div style={{ fontSize:13, color:"var(--earth-mid)" }}>{editing ? form.email : user.email}</div>
              </div>
            </div>
            <h4 style={{ fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--earth-mid)", marginBottom:16 }}>Personal Information</h4>
            {editing ? (
              <div>
                {[["Full Name","name","e.g. Rahul Sharma"],["Email","email","you@example.com"],["Phone","phone","e.g. 9876543210"],["City","city","e.g. Hyderabad"]].map(([l,k,ph]) => (
                  <div className="form-group" key={k}>
                    <label className="form-label">{l}</label>
                    <input className="form-input" placeholder={ph} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[["👤 Name", user.name],["📧 Email", user.email],["📱 Phone", user.phone||"Not set"],["🏙️ City", user.city||"Not set"]].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F0EAE2" }}>
                    <span style={{ fontSize:13, color:"var(--earth-mid)" }}>{l}</span>
                    <span style={{ fontSize:14, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="card">
            <h4 style={{ fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--earth-mid)", marginBottom:20 }}>My Preferences</h4>

            <div className="form-group">
              <label className="form-label">Budget Preference</label>
              {editing ? (
                <select className="form-select" value={budget} onChange={e => setBudget(e.target.value)}>
                  <option value="">— Select budget range —</option>
                  <option value="Under ₹50K">Under ₹50K</option>
                  <option value="₹50K – ₹1L">₹50K – ₹1L</option>
                  <option value="₹1L – ₹3L">₹1L – ₹3L</option>
                  <option value="₹3L – ₹5L">₹3L – ₹5L</option>
                  <option value="₹5L – ₹10L">₹5L – ₹10L</option>
                  <option value="Above ₹10L">Above ₹10L</option>
                </select>
              ) : (
                <div style={{ padding:"12px 16px", background:"var(--saffron-pale)", borderRadius:10, fontSize:14, fontWeight:600 }}>
                  💰 {user.budget || "Not set"}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Property Goal</label>
              {editing ? (
                <div style={{ display:"flex", gap:10 }}>
                  {["Sell","Rent","Personal Use"].map(g => (
                    <button key={g} onClick={() => setGoal(g)} style={{
                      flex:1, padding:"12px 8px", border:`2px solid ${goal===g?"var(--saffron)":"#DDD5CA"}`,
                      borderRadius:10, background: goal===g?"var(--saffron-pale)":"white",
                      color: goal===g?"var(--saffron)":"var(--earth-mid)", fontWeight:700, fontSize:13,
                      cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif"
                    }}>{goal===g?"✓ ":""}{g}</button>
                  ))}
                </div>
              ) : (
                <div style={{ display:"flex", gap:10 }}>
                  {[["Sell","Sell"],["Rent","Rent"],["Personal Use","Personal Use"]].map(([g,label]) => (
                    <div key={g} style={{
                      flex:1, padding:"12px 8px", borderRadius:10, textAlign:"center",
                      background: user.goal===g?"var(--saffron)":"#F5EFE8",
                      color: user.goal===g?"white":"var(--earth-mid)", fontWeight:700, fontSize:13
                    }}>{user.goal===g?"✓ ":""}{label}</div>
                  ))}
                </div>
              )}
            </div>

            {editing && (
              <div style={{ display:"flex", gap:12, marginTop:24 }}>
                <button className="btn-secondary" style={{ flex:1 }} onClick={() => { setEditing(false); setForm({ name:user.name, email:user.email, phone:user.phone||"", city:user.city||"" }); setBudget(user.budget||""); setGoal(user.goal||""); }}>Cancel</button>
                <button className="btn-primary" style={{ flex:2 }} onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── B. USER PROPERTIES ───────────────────────────────────────────────────────
function UserProperties({ user, properties, setProperties, allProperties }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ type:"", city:"", area:"", size:"", age:"", budget:"", issues:"" });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const resetForm = () => { setForm({ type:"", city:"", area:"", size:"", age:"", budget:"", issues:"" }); setImagePreview(null); setImageData(null); setEditingId(null); setErrorMessage(""); };

  const handleImageChange = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { setImagePreview(e.target.result); setImageData(e.target.result); };
    reader.readAsDataURL(file);
  };

  const openEdit = (p) => {
    setForm({ type:p.type, city:p.city||p.location||"", area:p.area||"", size:p.size||"", age:p.age||"", budget:p.budget||"", issues:p.issues||"" });
    setImagePreview(p.image||null); setImageData(p.image||null);
    setEditingId(p.id); setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.type || !form.city) return;

    try {
      setErrorMessage("");
      const propertyData = {
        type: form.type,
        city: form.city,
        area: form.area,
        size: form.size,
        age: form.age,
        budget: form.budget,
        issues: form.issues,
        location: form.city,
        image: imageData,
        status: "pending",
        adminNote: "",
        userId: user.id,
        userName: user.name,
        submittedAt: new Date().toISOString().split("T")[0]
      };

      if (editingId) {
        const updated = await propertiesAPI.update(editingId, propertyData);
        setProperties(allProperties.map(p => p.id === editingId ? updated : p));
      } else {
        const newProp = await propertiesAPI.create(propertyData);
        setProperties([...allProperties, newProp]);
      }

      resetForm();
      setShowForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving property:', error);
      setErrorMessage('Property could not be saved to the backend. Please check your Spring Boot API endpoint and database mapping.');

      const tempProp = {
        id: editingId ? editingId : Date.now(),
        userId: user.id,
        userName: user.name,
        status: "pending",
        adminNote: "",
        image: imageData,
        location: form.city,
        submittedAt: new Date().toISOString().split("T")[0],
        ...form
      };
      
      if (editingId) {
        setProperties(allProperties.map(p => p.id === editingId ? tempProp : p));
      } else {
        setProperties([...allProperties, tempProp]);
      }
      
      resetForm();
      setShowForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await propertiesAPI.delete(id);
      setProperties(allProperties.filter(p => p.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      // Fall back to local state if API fails
      setProperties(allProperties.filter(p => p.id !== id));
      setDeleteId(null);
    }
  };

  if (showForm) {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">{editingId ? "Edit Property" : "Add Property"}</h1>
            <p className="page-subtitle">{editingId ? "Update your property details" : "Add your property to get personalised recommendations"}</p>
          </div>
          <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 20px" }} onClick={() => { resetForm(); setShowForm(false); }}>
            Back to properties
          </button>
        </div>
        <div className="page-body">
          {saved && <div className="success-banner"><CheckIcon/> Property saved successfully!</div>}
          {errorMessage && <div className="error-banner">⚠️ {errorMessage}</div>}
          <div className="card" style={{ maxWidth:860, margin:"0 auto" }}>
            <div style={{ marginBottom:24 }}>
              <h2 style={{ marginBottom:8, fontSize:28 }}>{editingId ? "Edit Property" : "Add New Property"}</h2>
              <p style={{ color:"var(--earth-mid)", fontSize:14, lineHeight:1.7 }}>Enter your property details clearly on this page so the system can generate the best improvement recommendations.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Property Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                  <option value="">— Select type —</option>
                  <option value="Flat / Apartment">🏢 Flat / Apartment</option>
                  <option value="Independent House">🏠 Independent House</option>
                  <option value="Villa">🏡 Villa</option>
                  <option value="Row House">🏘️ Row House</option>
                  <option value="Penthouse">🏙️ Penthouse</option>
                  <option value="Studio Apartment">🛋️ Studio Apartment</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="e.g. Hyderabad" value={form.city} onChange={e => setForm({...form,city:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Area / Locality</label>
                <input className="form-input" placeholder="e.g. Kondapur" value={form.area} onChange={e => setForm({...form,area:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Size (sq.ft)</label>
                <input className="form-input" placeholder="e.g. 1100" value={form.size} onChange={e => setForm({...form,size:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Age of Property</label>
                <select className="form-select" value={form.age} onChange={e => setForm({...form,age:e.target.value})}>
                  <option value="">— Select age —</option>
                  <option value="0-2 years">0–2 years (New)</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="6-10 years">6–10 years</option>
                  <option value="11-20 years">11–20 years</option>
                  <option value="20+ years">20+ years (Old)</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Budget Range for Improvements</label>
                <select className="form-select" value={form.budget} onChange={e => setForm({...form,budget:e.target.value})}>
                  <option value="">— Select budget —</option>
                  <option value="Under ₹50K">Under ₹50K</option>
                  <option value="₹50K – ₹1L">₹50K – ₹1L</option>
                  <option value="₹1L – ₹3L">₹1L – ₹3L</option>
                  <option value="₹3L – ₹5L">₹3L – ₹5L</option>
                  <option value="₹5L – ₹10L">₹5L – ₹10L</option>
                  <option value="Above ₹10L">Above ₹10L</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Issues / Areas for Improvement</label>
                <textarea className="form-textarea" placeholder="Describe issues or areas to improve..." value={form.issues} onChange={e => setForm({...form,issues:e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Property Photo</label>
                {!imagePreview ? (
                  <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
                    onDrop={e=>{e.preventDefault();setDragOver(false);handleImageChange(e.dataTransfer.files[0]);}}
                    onClick={()=>document.getElementById("prop-img-input").click()}
                    style={{ border:`2px dashed ${dragOver?"var(--saffron)":"#DDD5CA"}`, borderRadius:12, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:dragOver?"var(--saffron-pale)":"#FAFAFA", transition:"all 0.2s" }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>📸</div>
                    <div style={{ fontSize:14, fontWeight:600, color:"var(--earth)", marginBottom:3 }}>Click to upload or drag & drop</div>
                    <div style={{ fontSize:12, color:"var(--earth-mid)" }}>JPG, PNG, WEBP up to 10MB</div>
                    <input id="prop-img-input" type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleImageChange(e.target.files[0])} />
                  </div>
                ) : (
                  <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1.5px solid #DDD5CA" }}>
                    <img src={imagePreview} alt="Preview" style={{ width:"100%", height:180, objectFit:"cover", display:"block" }} />
                    <button onClick={()=>{setImagePreview(null);setImageData(null);}} style={{ position:"absolute", top:10, right:10, background:"rgba(61,43,31,0.75)", color:"white", border:"none", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>✕ Remove</button>
                    <div style={{ position:"absolute", bottom:10, left:10, background:"rgba(45,106,79,0.9)", color:"white", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:600 }}>✓ Photo ready</div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:24, flexWrap:"wrap" }}>
              <button className="btn-secondary" onClick={()=>{resetForm();setShowForm(false);}}>Cancel</button>
              <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 24px" }} onClick={handleSubmit}>{editingId?"Save Changes":"Submit Property"}</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div><h1 className="page-title">My Properties</h1><p className="page-subtitle">Manage your properties and track improvement status</p></div>
        <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 20px" }} onClick={() => { resetForm(); setShowForm(true); }}>+ Add Property</button>
      </div>
      <div className="page-body">
        {saved && <div className="success-banner"><CheckIcon/> Property {editingId?"updated":"submitted"} successfully!</div>}
        {errorMessage && <div className="error-banner">⚠️ {errorMessage}</div>}
        {properties.length===0 && (
          <div className="card" style={{ textAlign:"center", padding:"60px 40px" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🏠</div>
            <h3 style={{ marginBottom:10 }}>No properties yet</h3>
            <p style={{ color:"var(--earth-mid)", marginBottom:24, fontSize:14 }}>Add your property to get personalised improvement recommendations.</p>
            <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"12px 28px" }} onClick={() => { resetForm(); setShowForm(true); }}>Add Your First Property</button>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {properties.map(p => (
            <div key={p.id} className="card" style={{ padding:0, overflow:"hidden" }}>
              {p.image && (
                <div style={{ width:"100%", height:200, overflow:"hidden", position:"relative" }}>
                  <img src={p.image} alt="Property" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(61,43,31,0.5) 100%)" }}/>
                  <span className={`status-badge status-${p.status}`} style={{ position:"absolute", top:14, right:14, fontSize:13, padding:"6px 16px" }}>{p.status==="reviewed"?"✓ Reviewed":"⏳ Pending"}</span>
                </div>
              )}
              <div style={{ padding:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <h3 style={{ fontSize:20, marginBottom:4 }}>{p.type}</h3>
                    <div style={{ color:"var(--earth-mid)", fontSize:14 }}>📍 {p.city||p.location}{p.area ? `, ${p.area}` : ""}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {!p.image && <span className={`status-badge status-${p.status}`} style={{ fontSize:13, padding:"6px 16px" }}>{p.status==="reviewed"?"✓ Reviewed":"⏳ Pending"}</span>}
                    <button className="btn-sm" style={{ background:"var(--saffron-pale)", color:"var(--saffron)", fontSize:12 }} onClick={() => openEdit(p)}>✏️ Edit</button>
                    <button className="btn-sm" style={{ background:"#FEE2E2", color:"#B91C1C", fontSize:12 }} onClick={() => setDeleteId(p.id)}>🗑 Delete</button>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                  {[["Size",p.size],["Age",p.age],["Budget",p.budget],["Submitted",p.submittedAt]].map(([l,v]) => (
                    <div key={l} style={{ background:"var(--saffron-pale)", borderRadius:10, padding:"10px 12px" }}>
                      <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--earth-mid)", fontWeight:600, marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{v||"—"}</div>
                    </div>
                  ))}
                </div>
                {p.issues && <div style={{ marginBottom:12 }}><div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--earth-mid)", marginBottom:5 }}>Issues Reported</div><div style={{ fontSize:13 }}>{p.issues}</div></div>}
                {p.adminNote && (
                  <div style={{ background:"#D1FAE5", border:"1px solid #6EE7B7", borderRadius:12, padding:"14px 16px" }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"#065F46", marginBottom:6 }}>✅ Expert Feedback</div>
                    <div style={{ fontSize:13, color:"#064E3B", lineHeight:1.7 }}>{p.adminNote}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && (resetForm(),setShowForm(false))}>
          <div className="modal" style={{ maxWidth:580 }}>
            <h2 className="modal-title">{editingId ? "Edit Property" : "Add Property"}</h2>
            <p className="modal-sub">Fill in the details to get personalised recommendations</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Property Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                  <option value="">— Select type —</option>
                  <option value="Flat / Apartment">🏢 Flat / Apartment</option>
                  <option value="Independent House">🏠 Independent House</option>
                  <option value="Villa">🏡 Villa</option>
                  <option value="Row House">🏘️ Row House</option>
                  <option value="Penthouse">🏙️ Penthouse</option>
                  <option value="Studio Apartment">🛋️ Studio Apartment</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="e.g. Hyderabad" value={form.city} onChange={e => setForm({...form,city:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Area / Locality</label>
                <input className="form-input" placeholder="e.g. Kondapur" value={form.area} onChange={e => setForm({...form,area:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Size (sq.ft)</label>
                <input className="form-input" placeholder="e.g. 1100" value={form.size} onChange={e => setForm({...form,size:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Age of Property</label>
                <select className="form-select" value={form.age} onChange={e => setForm({...form,age:e.target.value})}>
                  <option value="">— Select age —</option>
                  <option value="0-2 years">0–2 years (New)</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="6-10 years">6–10 years</option>
                  <option value="11-20 years">11–20 years</option>
                  <option value="20+ years">20+ years (Old)</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Budget Range for Improvements</label>
                <select className="form-select" value={form.budget} onChange={e => setForm({...form,budget:e.target.value})}>
                  <option value="">— Select budget —</option>
                  <option value="Under ₹50K">Under ₹50K</option>
                  <option value="₹50K – ₹1L">₹50K – ₹1L</option>
                  <option value="₹1L – ₹3L">₹1L – ₹3L</option>
                  <option value="₹3L – ₹5L">₹3L – ₹5L</option>
                  <option value="₹5L – ₹10L">₹5L – ₹10L</option>
                  <option value="Above ₹10L">Above ₹10L</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn:"1/-1" }}>
                <label className="form-label">Issues / Areas for Improvement</label>
                <textarea className="form-textarea" placeholder="Describe issues or areas to improve..." value={form.issues} onChange={e => setForm({...form,issues:e.target.value})} />
              </div>
            </div>
            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Property Photo</label>
              {!imagePreview ? (
                <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
                  onDrop={e=>{e.preventDefault();setDragOver(false);handleImageChange(e.dataTransfer.files[0]);}}
                  onClick={()=>document.getElementById("prop-img-input").click()}
                  style={{ border:`2px dashed ${dragOver?"var(--saffron)":"#DDD5CA"}`, borderRadius:12, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:dragOver?"var(--saffron-pale)":"#FAFAFA", transition:"all 0.2s" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📸</div>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--earth)", marginBottom:3 }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize:12, color:"var(--earth-mid)" }}>JPG, PNG, WEBP up to 10MB</div>
                  <input id="prop-img-input" type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleImageChange(e.target.files[0])} />
                </div>
              ) : (
                <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1.5px solid #DDD5CA" }}>
                  <img src={imagePreview} alt="Preview" style={{ width:"100%", height:180, objectFit:"cover", display:"block" }} />
                  <button onClick={()=>{setImagePreview(null);setImageData(null);}} style={{ position:"absolute", top:10, right:10, background:"rgba(61,43,31,0.75)", color:"white", border:"none", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>✕ Remove</button>
                  <div style={{ position:"absolute", bottom:10, left:10, background:"rgba(45,106,79,0.9)", color:"white", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:600 }}>✓ Photo ready</div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={()=>{resetForm();setShowForm(false);}}>Cancel</button>
              <button className="btn-sm btn-orange" style={{ fontSize:14, padding:"10px 24px" }} onClick={handleSubmit}>{editingId?"Save Changes":"Submit Property"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-backdrop" onClick={()=>setDeleteId(null)}>
          <div className="modal" style={{ maxWidth:400, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🗑️</div>
            <h2 className="modal-title">Delete Property?</h2>
            <p style={{ color:"var(--earth-mid)", fontSize:14, marginBottom:28 }}>This action cannot be undone. The property and all its data will be permanently removed.</p>
            <div style={{ display:"flex", gap:12 }}>
              <button className="btn-secondary" style={{ flex:1 }} onClick={()=>setDeleteId(null)}>Cancel</button>
              <button className="btn-sm" style={{ flex:1, padding:"12px", background:"#B91C1C", color:"white", fontSize:14 }} onClick={()=>handleDelete(deleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── C. PERSONALIZED RECOMMENDATIONS ─────────────────────────────────────────
function UserImprovements({ recommendations, properties }) {
  const FILTERS = ["All", "Low Budget", "High ROI", "Quick Improvements", "Eco-Friendly"];
  const [filter, setFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const adminRecommendations = recommendations.filter(r => r.fromAdmin);
  const categories = ["All", ...new Set(adminRecommendations.map(r => r.category))];

  const matchesFilter = (r) => {
    if (filter === "Low Budget") {
      const cost = r.cost || "";
      return cost.includes("₹") && (cost.includes("K") && !cost.includes("L")) || cost.includes("20K") || cost.includes("15K") || cost.includes("12K") || cost.includes("8K") || cost.includes("40K") || cost.includes("25K") || cost.includes("30K") || cost.includes("35K");
    }
    if (filter === "High ROI") {
      const roi = parseFloat((r.roi||"0").split("-")[1]||r.roi||"0");
      return roi >= 15;
    }
    if (filter === "Quick Improvements") return ["Lighting","Exterior","Interior"].includes(r.category);
    if (filter === "Eco-Friendly") return ["Technology","Vastu & Wellness"].includes(r.category);
    return true;
  };

  const filtered = adminRecommendations
    .filter(r => catFilter==="All" || r.category===catFilter)
    .filter(matchesFilter);

  return (
    <>
      <div className="page-header"><div><h1 className="page-title">Recommendations</h1><p className="page-subtitle">Personalised improvement suggestions based on your property data</p></div></div>
      <div className="page-body">
        {/* Smart filter chips */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--earth-mid)", marginBottom:10 }}>Smart Filters</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s",
                background: filter===f?"var(--earth)":"white",
                color: filter===f?"white":"var(--earth)",
                border: `1.5px solid ${filter===f?"var(--earth)":"#DDD5CA"}`,
              }}>{f==="Low Budget"?"💰 ":f==="High ROI"?"📈 ":f==="Quick Improvements"?"⚡ ":f==="Eco-Friendly"?"🌿 ":""}{f}</button>
            ))}
          </div>
        </div>
        {/* Category filter */}
        <div style={{ marginBottom:26 }}>
          <div style={{ fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--earth-mid)", marginBottom:10 }}>Category</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{
                padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s",
                background: catFilter===c?"var(--saffron)":"white",
                color: catFilter===c?"white":"var(--earth)",
                border: `1.5px solid ${catFilter===c?"var(--saffron)":"#DDD5CA"}`,
                boxShadow: catFilter===c?"0 3px 10px rgba(232,99,26,0.3)":"none"
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div className="rec-grid">
          {filtered.map(r => (
            <div key={r.id} className="rec-card">
              <div className="rec-header">
                <div><span className="category-badge">{r.category}</span><div className="rec-title">{r.title}</div></div>
                <span className="rec-roi">ROI {r.roi}</span>
              </div>
              <div className="rec-desc">{r.description}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                <div style={{ background:"var(--saffron-pale)", borderRadius:8, padding:"8px 12px" }}>
                  <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.6px", color:"var(--earth-mid)", fontWeight:600 }}>Est. Cost</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--earth)", marginTop:2 }}>💰 {r.cost}</div>
                </div>
                <div style={{ background:"#F0FDF4", borderRadius:8, padding:"8px 12px" }}>
                  <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.6px", color:"#065F46", fontWeight:600 }}>Value Increase</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#065F46", marginTop:2 }}>📈 {r.roi}</div>
                </div>
              </div>
              <div className="rec-tags">{r.tags?.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
        {filtered.length===0 && <div className="card" style={{ textAlign:"center", padding:"40px", color:"var(--earth-mid)" }}>No recommendations match this filter.</div>}
      </div>
    </>
  );
}

// ── D. SAVED RECOMMENDATIONS ─────────────────────────────────────────────────
function UserSaved({ recommendations }) {
  const [saved, setSaved] = useState({});       // { id: true }
  const [implemented, setImplemented] = useState({});  // { id: true }
  const [filterTab, setFilterTab] = useState("all"); // "all" | "saved" | "implemented"
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const toggleSave = (id) => {
    setSaved(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) {
        setImplemented(p => ({ ...p, [id]: false }));
        showToast("Removed from saved ideas");
      } else {
        showToast("Added to saved ideas ✓");
      }
      return next;
    });
  };

  const toggleImplemented = (id) => {
    setImplemented(prev => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? "Marked as implemented 🎉" : "Unmarked as implemented");
      return next;
    });
  };

  const adminRecommendations = recommendations.filter(r => r.fromAdmin);
  const savedList = adminRecommendations.filter(r => saved[r.id]);
  const implementedList = savedList.filter(r => implemented[r.id]);
  const pendingList = savedList.filter(r => !implemented[r.id]);

  const displayList =
    filterTab === "saved"       ? pendingList :
    filterTab === "implemented" ? implementedList :
    adminRecommendations;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Saved Ideas</h1>
          <p className="page-subtitle">Bookmark your favourite improvement ideas and track what you have implemented</p>
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:"var(--saffron)", lineHeight:1 }}>{savedList.length}</div>
            <div style={{ fontSize:11, color:"var(--earth-mid)", textTransform:"uppercase", letterSpacing:"0.8px" }}>Saved</div>
          </div>
          <div style={{ width:1, height:36, background:"#EDE6DC" }}/>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:"var(--green)", lineHeight:1 }}>{implementedList.length}</div>
            <div style={{ fontSize:11, color:"var(--earth-mid)", textTransform:"uppercase", letterSpacing:"0.8px" }}>Done</div>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Toast */}
        {toast && (
          <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:"var(--earth)", color:"white", padding:"12px 24px", borderRadius:12, fontSize:14, fontWeight:600, zIndex:9999, boxShadow:"0 8px 32px rgba(0,0,0,0.25)", animation:"fadeUp 0.3s ease" }}>
            {toast}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[["all","All Ideas"],["saved","Saved (" + pendingList.length + ")"],["implemented","Implemented (" + implementedList.length + ")"]].map(([id,label]) => (
            <button key={id} onClick={() => setFilterTab(id)} style={{
              padding:"9px 20px", borderRadius:24, fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s", border:"none",
              background: filterTab===id ? "var(--earth)" : "white",
              color: filterTab===id ? "white" : "var(--earth-mid)",
              boxShadow: filterTab===id ? "0 4px 14px rgba(61,43,31,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>{label}</button>
          ))}
        </div>

        {/* Empty state for saved/implemented tabs */}
        {filterTab !== "all" && displayList.length === 0 && (
          <div className="card" style={{ textAlign:"center", padding:"56px 40px" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>{filterTab==="saved" ? "🔖" : "✅"}</div>
            <h3 style={{ marginBottom:10 }}>{filterTab==="saved" ? "No saved ideas yet" : "Nothing implemented yet"}</h3>
            <p style={{ color:"var(--earth-mid)", fontSize:14 }}>
              {filterTab==="saved" ? "Browse all ideas below and click the bookmark icon to save your favourites." : "Mark saved ideas as implemented once you complete them."}
            </p>
            {filterTab==="implemented" && <button style={{ marginTop:20, padding:"10px 24px", borderRadius:10, background:"var(--saffron)", color:"white", border:"none", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }} onClick={() => setFilterTab("saved")}>View Saved Ideas</button>}
          </div>
        )}

        {/* Cards grid */}
        <div className="rec-grid">
          {displayList.map(r => {
            const isSaved = !!saved[r.id];
            const isDone  = !!implemented[r.id];
            return (
              <div key={r.id} className="rec-card" style={{
                border: isDone ? "2px solid var(--green)" : isSaved ? "2px solid var(--saffron)" : "2px solid transparent",
                opacity: isDone ? 0.88 : 1,
                position:"relative", overflow:"hidden"
              }}>
                {/* Implemented ribbon */}
                {isDone && (
                  <div style={{ position:"absolute", top:14, right:-22, background:"var(--green)", color:"white", fontSize:10, fontWeight:700, padding:"3px 28px", transform:"rotate(35deg)", letterSpacing:"0.8px", textTransform:"uppercase" }}>Done</div>
                )}

                <div className="rec-header" style={{ marginBottom:8 }}>
                  <div style={{ flex:1, paddingRight:8 }}>
                    <span className="category-badge">{r.category}</span>
                    <div className="rec-title" style={{ textDecoration: isDone?"line-through":"none", opacity:isDone?0.6:1 }}>{r.title}</div>
                  </div>
                  <span className="rec-roi">ROI {r.roi}</span>
                </div>

                <div className="rec-desc">{r.description}</div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  <div style={{ background:"var(--saffron-pale)", borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.6px", color:"var(--earth-mid)", fontWeight:600 }}>Est. Cost</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--saffron)", marginTop:2 }}>💰 {r.cost}</div>
                  </div>
                  <div style={{ background:"#F0FDF4", borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.6px", color:"#065F46", fontWeight:600 }}>Value Increase</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#065F46", marginTop:2 }}>📈 {r.roi}</div>
                  </div>
                </div>

                <div className="rec-tags" style={{ marginBottom:14 }}>{r.tags?.map(t => <span key={t} className="tag">{t}</span>)}</div>

                {/* Action buttons */}
                <div style={{ display:"flex", gap:8, borderTop:"1px solid #F0EAE2", paddingTop:14 }}>
                  {/* Save / Unsave */}
                  <button onClick={() => toggleSave(r.id)} style={{
                    flex:1, padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, transition:"all 0.18s",
                    background: isSaved ? "#FEE2E2" : "var(--saffron-pale)",
                    color: isSaved ? "#B91C1C" : "var(--saffron)",
                  }}>
                    {isSaved ? "🗑 Remove" : "🔖 Save"}
                  </button>

                  {/* Mark implemented — only if saved */}
                  {isSaved && (
                    <button onClick={() => toggleImplemented(r.id)} style={{
                      flex:1.4, padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, transition:"all 0.18s",
                      background: isDone ? "#D1FAE5" : "var(--green)",
                      color: isDone ? "#065F46" : "white",
                    }}>
                      {isDone ? "↩ Undo Done" : "✅ Mark Implemented"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filterTab === "all" && recommendations.length === 0 && (
          <div className="card" style={{ textAlign:"center", padding:"40px", color:"var(--earth-mid)" }}>No recommendations available yet. Check back soon!</div>
        )}
      </div>
    </>
  );
}

export default App;


