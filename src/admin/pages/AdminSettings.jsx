import { useEffect, useState } from "react";
import { getSettings, updateSettings, uploadImage } from "../../lib/api";
import "../admin.css";

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getSettings().then(({ data }) => setForm(data || {}));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onHeroFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "hero");
      setForm((f) => ({ ...f, hero_image_url: url }));
    } catch (err) {
      setMsg("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const { error } = await updateSettings({
      hero_title: form.hero_title,
      hero_subtitle: form.hero_subtitle,
      hero_image_url: form.hero_image_url,
      restaurant_name: form.restaurant_name,
      restaurant_address: form.restaurant_address,
      restaurant_phone: form.restaurant_phone,
      restaurant_hours: form.restaurant_hours,
      primary_color: form.primary_color,
    });
    setBusy(false);
    setMsg(error ? "Save failed: " + error.message : "Saved ✓");
  };

  if (!form) return <p className="admin-muted">Loading…</p>;

  return (
    <div className="admin-page">
      <h1 className="admin-h1">Settings</h1>

      <form className="admin-card admin-form" onSubmit={save}>
        <h2 className="admin-h2">Hero</h2>
        <label className="admin-field">
          <span>Hero title</span>
          <input value={form.hero_title || ""} onChange={set("hero_title")} />
        </label>
        <label className="admin-field">
          <span>Hero subtitle</span>
          <textarea rows={2} value={form.hero_subtitle || ""} onChange={set("hero_subtitle")} />
        </label>
        <div className="admin-upload">
          {form.hero_image_url && <img className="admin-thumb admin-thumb--wide" src={form.hero_image_url} alt="" />}
          <label className="admin-btn admin-btn--ghost">
            {uploading ? "Uploading…" : "Upload hero image"}
            <input type="file" accept="image/*" onChange={onHeroFile} hidden />
          </label>
        </div>

        <h2 className="admin-h2">Restaurant details</h2>
        <div className="admin-form__grid">
          <label className="admin-field"><span>Name</span>
            <input value={form.restaurant_name || ""} onChange={set("restaurant_name")} /></label>
          <label className="admin-field"><span>Phone</span>
            <input value={form.restaurant_phone || ""} onChange={set("restaurant_phone")} /></label>
          <label className="admin-field admin-field--full"><span>Address</span>
            <input value={form.restaurant_address || ""} onChange={set("restaurant_address")} /></label>
          <label className="admin-field admin-field--full"><span>Hours</span>
            <input value={form.restaurant_hours || ""} onChange={set("restaurant_hours")} /></label>
        </div>

        <h2 className="admin-h2">Theme</h2>
        <label className="admin-field admin-field--color">
          <span>Primary color</span>
          <input type="color" value={form.primary_color || "#d62828"} onChange={set("primary_color")} />
          <input value={form.primary_color || ""} onChange={set("primary_color")} />
        </label>

        {msg && <p className={msg.includes("✓") ? "admin-ok" : "admin-error"}>{msg}</p>}

        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={busy || uploading}>Save changes</button>
        </div>
      </form>
    </div>
  );
}
