import { useEffect, useState } from "react";
import {
  getMenu, createMenuItem, updateMenuItem, deleteMenuItem, uploadImage,
} from "../../lib/api";
import "../admin.css";

const EMPTY = { name: "", price: "", category: "", image_url: "", available: true };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data, error } = await getMenu();
    if (!error) setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const url = await uploadImage(file, "menu");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setMsg("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => { setForm(EMPTY); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const row = {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      category: form.category.trim() || null,
      image_url: form.image_url || null,
      available: !!form.available,
    };
    const { error } = editingId
      ? await updateMenuItem(editingId, row)
      : await createMenuItem(row);
    setBusy(false);
    if (error) { setMsg("Save failed: " + error.message); return; }
    resetForm();
    load();
  };

  const edit = (it) => {
    setEditingId(it.id);
    setForm({
      name: it.name, price: it.price, category: it.category || "",
      image_url: it.image_url || "", available: it.available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    await deleteMenuItem(id);
    if (editingId === id) resetForm();
    load();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-h1">Menu</h1>

      <form className="admin-card admin-form" onSubmit={submit}>
        <h2 className="admin-h2">{editingId ? "Edit item" : "Add item"}</h2>

        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Name</span>
            <input value={form.name} onChange={set("name")} required />
          </label>
          <label className="admin-field">
            <span>Price</span>
            <input type="number" step="0.01" value={form.price} onChange={set("price")} required />
          </label>
          <label className="admin-field">
            <span>Category</span>
            <input value={form.category} onChange={set("category")} placeholder="e.g. Burger, Drinks" />
          </label>
          <label className="admin-field admin-field--check">
            <input type="checkbox" checked={form.available} onChange={set("available")} />
            <span>Available</span>
          </label>
        </div>

        <div className="admin-upload">
          {form.image_url && <img className="admin-thumb" src={form.image_url} alt="" />}
          <label className="admin-btn admin-btn--ghost">
            {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" onChange={onFile} hidden />
          </label>
        </div>

        {msg && <p className="admin-error">{msg}</p>}

        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={busy || uploading}>
            {editingId ? "Update" : "Add"} item
          </button>
          {editingId && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-card">
        <h2 className="admin-h2">All items ({items.length})</h2>
        <div className="admin-table">
          {items.map((it) => (
            <div className="admin-row" key={it.id}>
              <img className="admin-row__img" src={it.image_url || ""} alt="" />
              <div className="admin-row__main">
                <strong>{it.name}</strong>
                <span className="admin-row__meta">
                  {it.category || "—"} · ${Number(it.price).toFixed(2)}
                  {!it.available && " · hidden"}
                </span>
              </div>
              <div className="admin-row__actions">
                <button className="admin-btn admin-btn--sm" onClick={() => edit(it)}>Edit</button>
                <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="admin-muted">No items yet.</p>}
        </div>
      </div>
    </div>
  );
}
