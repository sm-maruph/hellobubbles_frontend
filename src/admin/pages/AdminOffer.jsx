import { useEffect, useState } from "react";
import { getSettings, updateSettings, uploadImage } from "../../lib/api";
import "../admin.css";

export default function AdminOffer() {
  const [offerUrl, setOfferUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getSettings().then(({ data }) => setOfferUrl(data?.offer_image_url || ""));
  }, []);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const url = await uploadImage(file, "offer");
      setOfferUrl(url);
    } catch (err) {
      setMsg("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async () => {
    setBusy(true);
    setMsg("");
    const { error } = await updateSettings({ offer_image_url: offerUrl || null });
    setBusy(false);
    setMsg(error ? "Save failed: " + error.message : "Saved ✓");
  };

  const clear = async () => {
    if (!confirm("Remove the offer image?")) return;
    setOfferUrl("");
    await updateSettings({ offer_image_url: null });
    setMsg("Removed ✓");
  };

  return (
    <div className="admin-page">
      <h1 className="admin-h1">Latest Offer</h1>

      <div className="admin-card">
        <h2 className="admin-h2">Offer image (shown on the QR page)</h2>

        <div className="admin-upload">
          {offerUrl ? (
            <img className="admin-thumb admin-thumb--wide" src={offerUrl} alt="Current offer" />
          ) : (
            <div className="admin-muted">No offer image set.</div>
          )}
          <label className="admin-btn admin-btn--ghost">
            {uploading ? "Uploading…" : offerUrl ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" onChange={onFile} hidden />
          </label>
        </div>

        {msg && <p className={msg.includes("✓") ? "admin-ok" : "admin-error"}>{msg}</p>}

        <div className="admin-form__actions">
          <button className="admin-btn" onClick={save} disabled={busy || uploading}>
            {busy ? "Saving…" : "Save"}
          </button>
          {offerUrl && (
            <button className="admin-btn admin-btn--danger" onClick={clear}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}