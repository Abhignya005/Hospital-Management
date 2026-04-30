import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import api from "../services/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }
  .page { min-height: 100vh; padding-top: 70px; }
  .content { max-width: 980px; margin: 0 auto; padding: 36px 24px 60px; }
  .header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 22px; }
  .title { font-family: 'DM Serif Display', serif; font-size: 34px; color: #102033; }
  .subtitle { margin-top: 8px; color: #5f6f87; font-size: 14px; }
  .header-actions { display: flex; align-items: center; gap: 10px; }
  .btn-add {
    border: none; border-radius: 10px; padding: 9px 14px;
    background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff;
    font-weight: 700; font-size: 13px; cursor: pointer;
    box-shadow: 0 6px 18px rgba(15,157,116,0.24);
  }

  .pill {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 8px 14px; border-radius: 999px;
    background: rgba(15,157,116,0.12); color: #0f9d74;
    border: 1px solid rgba(15,157,116,0.25);
    font-size: 12px; font-weight: 700;
  }

  .card {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(15,23,42,0.07);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(15,23,42,0.05);
    padding: 18px 20px;
    margin-bottom: 12px;
  }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .name { font-size: 18px; font-weight: 700; color: #102033; }
  .meta { color: #5f6f87; font-size: 13px; margin-top: 4px; }
  .desc { margin-top: 12px; color: #3f5064; font-size: 14px; }
  .res { margin-top: 8px; color: #3f5064; font-size: 14px; }

  .state {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(15,23,42,0.07);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(15,23,42,0.05);
    padding: 28px;
    text-align: center;
    color: #5f6f87;
  }

  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(16,32,51,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1100; padding: 20px;
  }
  .modal-card {
    width: 100%; max-width: 620px; background: #fff; border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.08); box-shadow: 0 20px 60px rgba(15,23,42,0.20);
    padding: 22px;
  }
  .modal-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #102033; margin-bottom: 16px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-row-full { grid-column: 1 / -1; }
  .form-label { display: block; font-size: 12px; font-weight: 700; color: #3f5064; margin-bottom: 6px; }
  .form-input,
  .form-textarea {
    width: 100%; padding: 10px 12px; border-radius: 10px;
    border: 1.4px solid rgba(15,23,42,0.12); font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #102033; outline: none;
  }
  .form-textarea { min-height: 84px; resize: vertical; }
  .form-input:focus,
  .form-textarea:focus { border-color: #0f9d74; box-shadow: 0 0 0 3px rgba(15,157,116,0.10); }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
  .btn-secondary,
  .btn-primary {
    border: none; border-radius: 10px; padding: 10px 16px; font-size: 14px;
    font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .btn-secondary { background: #eef2f7; color: #52647a; }
  .btn-primary { background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff; }
  .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

  @media (max-width: 700px) {
    .form-grid { grid-template-columns: 1fr; }
  }
`;

function injectCSS(id, css) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = css;
    return;
  }
  const s = document.createElement("style");
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

export default function Prescriptions() {
  injectCSS("prescriptions-css", CSS);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({
    title: "",
    doctorName: "",
    visitDate: "",
    description: "",
    directions: "",
  });

  const loadPrescriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.records.getUserRecords("prescription");
      if (response?.success) {
        setItems(response.records || []);
      } else {
        setItems([]);
        setError(response?.message || "Failed to load prescriptions");
      }
    } catch (err) {
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setSaveError("");
    setForm({
      title: "",
      doctorName: "",
      visitDate: "",
      description: "",
      directions: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (!saving) setShowModal(false);
  };

  const savePrescription = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setSaveError("Prescription title is required");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const payload = {
        type: "prescription",
        title: form.title.trim(),
        doctorName: form.doctorName.trim(),
        visitDate: form.visitDate || undefined,
        description: form.description.trim(),
        results: form.directions.trim(),
      };

      const response = await api.records.createRecord(payload);
      if (response?.success) {
        setShowModal(false);
        await loadPrescriptions();
      } else {
        setSaveError(response?.message || "Failed to save prescription");
      }
    } catch (err) {
      setSaveError(err.message || "Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="header">
          <div>
            <h1 className="title">Prescriptions</h1>
            <p className="subtitle">All prescription records attached to your account.</p>
          </div>
          <div className="header-actions">
            <button className="btn-add" onClick={openModal}>+ Add Prescription</button>
            <span className="pill">{items.length} item(s)</span>
          </div>
        </div>

        {loading ? (
          <div className="state">Loading prescriptions...</div>
        ) : error ? (
          <div className="state">{error}</div>
        ) : items.length === 0 ? (
          <div className="state">No prescriptions found yet. Click Add Prescription to store one for this patient.</div>
        ) : (
          items.map((item) => (
            <div className="card" key={item._id}>
              <div className="row">
                <div>
                  <div className="name">{item.title}</div>
                  <div className="meta">
                    {item.doctorName || "Doctor not specified"} · {new Date(item.visitDate || item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="pill">Prescription</span>
              </div>
              {item.description ? <div className="desc">{item.description}</div> : null}
              {item.results ? <div className="res"><strong>Directions:</strong> {item.results}</div> : null}
            </div>
          ))
        )}
      </div>

      {showModal ? (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Prescription</h2>
            <form onSubmit={savePrescription}>
              <div className="form-grid">
                <div className="form-row-full">
                  <label className="form-label">Prescription Title</label>
                  <input
                    className="form-input"
                    name="title"
                    value={form.title}
                    onChange={onFormChange}
                    placeholder="e.g. BP Management Plan"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Doctor Name</label>
                  <input
                    className="form-input"
                    name="doctorName"
                    value={form.doctorName}
                    onChange={onFormChange}
                    placeholder="e.g. Dr. Priya Reddy"
                  />
                </div>
                <div>
                  <label className="form-label">Visit Date</label>
                  <input
                    className="form-input"
                    type="date"
                    name="visitDate"
                    value={form.visitDate}
                    onChange={onFormChange}
                  />
                </div>
                <div className="form-row-full">
                  <label className="form-label">Condition / Notes</label>
                  <textarea
                    className="form-textarea"
                    name="description"
                    value={form.description}
                    onChange={onFormChange}
                    placeholder="Diagnosis or summary"
                  />
                </div>
                <div className="form-row-full">
                  <label className="form-label">Directions</label>
                  <textarea
                    className="form-textarea"
                    name="directions"
                    value={form.directions}
                    onChange={onFormChange}
                    placeholder="Medicine dosage and schedule"
                  />
                </div>
              </div>

              {saveError ? <p style={{ color: "#b42318", marginTop: 12 }}>{saveError}</p> : null}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Prescription"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
