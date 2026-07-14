import { useEffect, useState } from "react";
import { getReviews, createReview, updateReview, deleteReview, uploadImage } from "../../lib/api";
import "../admin.css";

const EMPTY = { quote: "", name: "", role: "", avatar_url: "" };

export default function AdminReviews() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await getReviews();
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "reviews");
      setForm((f) => ({ ...f, avatar_url: url }));
    } finally {
      setUploading(false);
    }
  };

  const reset = () => { setForm(EMPTY); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    const row = { quote: form.quote, name: form.name, role: form.role || null, avatar_url: form.avatar_url || null };
    if (editingId) await updateReview(editingId, row);
    else await createReview(row);
    reset();
    load();
  };

  const edit = (r) => { setEditingId(r.id); setForm({ quote: r.quote, name: r.name, role: r.role || "", avatar_url: r.avatar_url || "" }); };
  const remove = async (id) => { if (confirm("Delete review?")) { await deleteReview(id); load(); } };

  return (
    <div className="admin-page">
      <h1 className="admin-h1">Reviews</h1>

      <form className="admin-card admin-form" onSubmit={submit}>
        <h2 className="admin-h2">{editingId ? "Edit review" : "Add review"}</h2>
        <label className="admin-field"><span>Quote</span>
          <textarea rows={3} value={form.quote} onChange={set("quote")} required /></label>
        <div className="admin-form__grid">
          <label className="admin-field"><span>Name</span>
            <input value={form.name} onChange={set("name")} required /></label>
          <label className="admin-field"><span>Role</span>
            <input value={form.role} onChange={set("role")} placeholder="e.g. Chef" /></label>
        </div>
        <div className="admin-upload">
          {form.avatar_url && <img className="admin-thumb" src={form.avatar_url} alt="" style={{ borderRadius: "50%" }} />}
          <label className="admin-btn admin-btn--ghost">
            {uploading ? "Uploading…" : "Upload avatar"}
            <input type="file" accept="image/*" onChange={onFile} hidden />
          </label>
        </div>
        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={uploading}>{editingId ? "Update" : "Add"}</button>
          {editingId && <button type="button" className="admin-btn admin-btn--ghost" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className="admin-card">
        <h2 className="admin-h2">All reviews ({rows.length})</h2>
        <div className="admin-table">
          {rows.map((r) => (
            <div className="admin-row" key={r.id}>
              <img className="admin-row__img" src={r.avatar_url || ""} alt="" style={{ borderRadius: "50%" }} />
              <div className="admin-row__main">
                <strong>{r.name}</strong>
                <span className="admin-row__meta">{r.role || "—"}</span>
              </div>
              <div className="admin-row__actions">
                <button className="admin-btn admin-btn--sm" onClick={() => edit(r)}>Edit</button>
                <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(r.id)}>Delete</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="admin-muted">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}