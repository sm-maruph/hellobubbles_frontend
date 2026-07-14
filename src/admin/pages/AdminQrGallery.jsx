import { useEffect, useState } from "react";
import { getQrGallery, createQrGalleryItem, updateQrGalleryItem, deleteQrGalleryItem, uploadImage } from "../../lib/api";
import "../admin.css";

const EMPTY = { image_url: "", title: "", description: "", offer: "", price: "" };

export default function AdminQrGallery() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => { const { data } = await getQrGallery(); setRows(data || []); };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file, "qr-gallery"); setForm((f) => ({ ...f, image_url: url })); }
    finally { setUploading(false); }
  };
  const reset = () => { setForm(EMPTY); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    const row = {
      image_url: form.image_url, title: form.title || null,
      description: form.description || null, offer: form.offer || null,
      price: form.price === "" ? null : Number(form.price),
    };
    if (editingId) await updateQrGalleryItem(editingId, row);
    else await createQrGalleryItem(row);
    reset(); load();
  };
  const edit = (r) => { setEditingId(r.id); setForm({ image_url: r.image_url || "", title: r.title || "", description: r.description || "", offer: r.offer || "", price: r.price ?? "" }); };
  const remove = async (id) => { if (confirm("Delete?")) { await deleteQrGalleryItem(id); load(); } };

  return (
    <div className="admin-page">
      <h1 className="admin-h1">QR Gallery</h1>

      <form className="admin-card admin-form" onSubmit={submit}>
        <h2 className="admin-h2">{editingId ? "Edit item" : "Add item"}</h2>
        <div className="admin-upload">
          {form.image_url && <img className="admin-thumb" src={form.image_url} alt="" />}
          <label className="admin-btn admin-btn--ghost">
            {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" onChange={onFile} hidden />
          </label>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field"><span>Title</span><input value={form.title} onChange={set("title")} /></label>
          <label className="admin-field"><span>Price</span><input type="number" step="0.01" value={form.price} onChange={set("price")} /></label>
          <label className="admin-field"><span>Offer (optional)</span><input value={form.offer} onChange={set("offer")} placeholder="10% OFF" /></label>
        </div>
        <label className="admin-field"><span>Short description</span><textarea rows={2} value={form.description} onChange={set("description")} /></label>
        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={uploading}>{editingId ? "Update" : "Add"}</button>
          {editingId && <button type="button" className="admin-btn admin-btn--ghost" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className="admin-card">
        <h2 className="admin-h2">Items ({rows.length})</h2>
        <div className="admin-table">
          {rows.map((r) => (
            <div className="admin-row" key={r.id}>
              <img className="admin-row__img" src={r.image_url} alt="" />
              <div className="admin-row__main">
                <strong>{r.title || "—"}</strong>
                <span className="admin-row__meta">{r.offer ? r.offer + " · " : ""}{r.price != null ? `$${Number(r.price).toFixed(2)}` : ""}</span>
              </div>
              <div className="admin-row__actions">
                <button className="admin-btn admin-btn--sm" onClick={() => edit(r)}>Edit</button>
                <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(r.id)}>Delete</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="admin-muted">No items yet.</p>}
        </div>
      </div>
    </div>
  );
}