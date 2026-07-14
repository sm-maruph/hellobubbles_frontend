import "./QrGalleryModal.css";

const money = (n) =>
  n == null || n === "" ? null : `$${Number(n).toFixed(2)}`;

export default function QrGalleryModal({ item, onClose }) {
  const price = money(item.price);

  return (
    <div className="qgm" onClick={onClose}>
      <div className="qgm__box" onClick={(e) => e.stopPropagation()}>
        <button className="qgm__close" aria-label="Close" onClick={onClose}>×</button>

        <div className="qgm__media">
          <img src={item.image_url || item.image} alt={item.title || ""} />
          {item.offer && <span className="qgm__offer">{item.offer}</span>}
        </div>

        <div className="qgm__body">
          {item.title && <h3 className="qgm__title">{item.title}</h3>}
          {item.description && <p className="qgm__desc">{item.description}</p>}
          {price && <p className="qgm__price">{price}</p>}
        </div>
      </div>
    </div>
  );
}