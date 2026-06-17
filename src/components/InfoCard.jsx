export default function InfoCard({ media, title, text, href, onClick }) {
  const inner = (
    <>
      <div className="info-card__media">{media}</div>
      <div className="info-card__body">
        <div className="info-card__title">{title}</div>
        <div className="info-card__text">{text}</div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="info-card" onClick={onClick}>
        {inner}
      </button>
    );
  }

  return (
    <a className="info-card" href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  );
}