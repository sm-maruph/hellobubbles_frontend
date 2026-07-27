import { useEffect, useState } from "react";
import { getHeroImages, createHeroImage, deleteHeroImage, uploadImage } from "../../lib/api";
import "../admin.css";

export default function AdminHero() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await getHeroImages();
    setImages(data || []);
  };
  useEffect(() => { load(); }, []);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const url = await uploadImage(file, "hero");
      await createHeroImage({ image_url: url, sort: images.length });
      await load();
    } catch (err) {
      setMsg("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this hero image?")) return;
    await deleteHeroImage(id);
    load();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-h1">Hero slider</h1>
      <div className="admin-card">
        <h2 className="admin-h2">Hero images (main banner slider)</h2>

        <label className="admin-btn admin-btn--ghost">
          {uploading ? "Uploading…" : "Add hero image"}
          <input type="file" accept="image/*" onChange={onFile} hidden />
        </label>

        {msg && <p className="admin-error">{msg}</p>}

        <div className="admin-about-grid">
          {images.map((img) => (
            <div className="admin-about-cell" key={img.id}>
              <img src={img.image_url} alt="" />
              <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(img.id)}>
                Delete
              </button>
            </div>
          ))}
          {images.length === 0 && <p className="admin-muted">No hero images yet.</p>}
        </div>
      </div>
    </div>
  );
}