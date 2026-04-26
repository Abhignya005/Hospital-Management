import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }
  .page { min-height: 100vh; padding-top: 70px; }
  .content { max-width: 800px; margin: 0 auto; padding: 36px 24px 60px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: #102033; margin-bottom: 28px; }

  .profile-hero { background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.07); border-radius: 22px; padding: 32px; display: flex; align-items: center; gap: 24px; margin-bottom: 22px; box-shadow: 0 6px 24px rgba(15,23,42,0.07); flex-wrap: wrap; }
  .profile-avatar-xl { width: 84px; height: 84px; border-radius: 50%; background: linear-gradient(135deg,#0f9d74,#2f8fb6); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 8px 24px rgba(15,157,116,0.28); }
  .profile-hero-info h2 { font-family: 'DM Serif Display', serif; font-size: 22px; color: #102033; margin-bottom: 4px; }
  .profile-hero-info p { font-size: 13px; color: #5f6f87; margin-bottom: 2px; }
  .profile-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: rgba(15,157,116,0.10); color: #0b7d5d; font-size: 12px; font-weight: 700; margin-top: 8px; }

  .section-card { background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.07); border-radius: 20px; padding: 26px 28px; margin-bottom: 18px; box-shadow: 0 4px 16px rgba(15,23,42,0.05); }
  .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-head h3 { font-size: 16px; font-weight: 700; color: #102033; }
  .btn-edit { padding: 7px 16px; border-radius: 9px; border: 1.5px solid rgba(15,157,116,0.22); background: rgba(15,157,116,0.07); color: #0f9d74; font-size: 12px; font-weight: 600; cursor: pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .btn-edit:hover { background: rgba(15,157,116,0.14); }
  .btn-save { padding: 7px 16px; border-radius: 9px; border: none; background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; font-family:'DM Sans',sans-serif; box-shadow:0 3px 10px rgba(15,157,116,0.20); }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .info-item label { display: block; font-size: 11px; font-weight: 700; color: #5f6f87; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 5px; }
  .info-item p { font-size: 14px; font-weight: 500; color: #102033; }
  .form-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid rgba(15,23,42,0.12); background:rgba(255,255,255,0.90); font-family:'DM Sans',sans-serif; font-size:14px; color:#102033; outline:none; transition:border-color 0.18s; }
  .form-input:focus { border-color: #0f9d74; }

  .allergy-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .allergy-tag { padding: 5px 12px; border-radius: 20px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18); color: #dc2626; font-size: 12px; font-weight: 600; }

  .danger-zone { background: rgba(255,233,233,0.60); border: 1px solid rgba(239,68,68,0.18); border-radius: 20px; padding: 24px 28px; }
  .danger-zone h3 { font-size: 15px; font-weight: 700; color: #b42318; margin-bottom: 6px; }
  .danger-zone p { font-size: 13px; color: #5f6f87; margin-bottom: 16px; }
  .btn-danger { padding: 10px 22px; border-radius: 10px; border: 1px solid rgba(239,68,68,0.25); background: rgba(239,68,68,0.07); color: #dc2626; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.15s; }
  .btn-danger:hover { background: rgba(239,68,68,0.13); }

  @media (max-width: 520px) { .info-grid { grid-template-columns: 1fr; } .profile-hero { flex-direction: column; text-align:center; } }
`;
function injectCSS(id, css) { if (document.getElementById(id)) return; const s = document.createElement("style"); s.id = id; s.textContent = css; document.head.appendChild(s); }

export default function Profile() {
  injectCSS("prof-css", CSS);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u) { navigate("/login"); return; }
    setUser(u);
    setForm({ name: u.name, email: u.email, phone: "+91 9876543210", dob: "1990-05-15", gender: "Male", blood: "O+", address: "123, Banjara Hills, Hyderabad" });
  }, [navigate]);

  const save = () => {
    const updated = { ...user, name: form.name, email: form.email };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated); setEditing(false);
  };

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "U";

  if (!user) return null;

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <h1 className="page-title">👤 My Profile</h1>

        <div className="profile-hero">
          <div className="profile-avatar-xl">{initials}</div>
          <div className="profile-hero-info">
            <h2>{user.name}</h2>
            <p>📧 {user.email}</p>
            <p>📞 +91 9876543210</p>
            <span className="profile-badge">✅ {user.role || "Patient"}</span>
          </div>
        </div>

        {/* Personal Info */}
        <div className="section-card">
          <div className="section-head">
            <h3>Personal Information</h3>
            {editing
              ? <button className="btn-save" onClick={save}>💾 Save</button>
              : <button className="btn-edit" onClick={() => setEditing(true)}>✏️ Edit</button>}
          </div>
          <div className="info-grid">
            {[
              { key:"name",    label:"Full Name"    },
              { key:"email",   label:"Email"        },
              { key:"phone",   label:"Phone"        },
              { key:"dob",     label:"Date of Birth"},
              { key:"gender",  label:"Gender"       },
              { key:"blood",   label:"Blood Group"  },
            ].map(f => (
              <div className="info-item" key={f.key}>
                <label>{f.label}</label>
                {editing
                  ? <input className="form-input" name={f.key} value={form[f.key]||""} onChange={handle} />
                  : <p>{form[f.key] || "—"}</p>}
              </div>
            ))}
            <div className="info-item" style={{ gridColumn:"1/-1" }}>
              <label>Address</label>
              {editing
                ? <input className="form-input" name="address" value={form.address||""} onChange={handle} />
                : <p>{form.address || "—"}</p>}
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="section-card">
          <div className="section-head"><h3>Medical Information</h3></div>
          <div style={{ marginBottom:16 }}>
            <div className="info-item" style={{ marginBottom:12 }}>
              <label>Known Allergies</label>
            </div>
            <div className="allergy-tags">
              {["Penicillin","Dust","Pollen"].map(a => <span key={a} className="allergy-tag">⚠️ {a}</span>)}
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item"><label>Chronic Conditions</label><p>Hypertension</p></div>
            <div className="info-item"><label>Current Medications</label><p>Amlodipine 5mg</p></div>
            <div className="info-item"><label>Emergency Contact</label><p>+91 9000011111</p></div>
            <div className="info-item"><label>Insurance Provider</label><p>Star Health</p></div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="danger-zone">
          <h3>⚠️ Danger Zone</h3>
          <p>Deleting your account is permanent and cannot be undone. All your records will be lost.</p>
          <button className="btn-danger">🗑️ Delete Account</button>
        </div>
      </div>
    </div>
  );
}