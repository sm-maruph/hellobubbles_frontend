import { useEffect, useState } from "react";
import { getAboutImages, createAboutImage, deleteAboutImage, uploadImage } from "../../lib/api";
import "../admin.css";

export default function AdminAbout() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await getAboutImages();
    setImages(data || []);
  };
  useEffect(() => { load(); }, []);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "about");
      await createAboutImage({ image_url: url, sort: images.length });
      await load();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this image?")) return;
    await deleteAboutImage(id);
    load();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-h1">About images</h1>
      <div className="admin-card">
        <label className="admin-btn admin-btn--ghost">
          {uploading ? "Uploading…" : "Add image"}
          <input type="file" accept="image/*" onChange={onFile} hidden />
        </label>

        <div className="admin-about-grid">
          {images.map((img) => (
            <div className="admin-about-cell" key={img.id}>
              <img src={img.image_url} alt="" />
              <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(img.id)}>
                Delete
              </button>
            </div>
          ))}
          {images.length === 0 && <p className="admin-muted">No images yet.</p>}
        </div>
      </div>
    </div>
  );
}