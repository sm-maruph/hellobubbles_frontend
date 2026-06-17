export default function InfoCard({ media, title, text, href }) {
  return (
    <a className="info-card" href={href} target="_blank" rel="noreferrer">
      <div className="info-card__media">{media}</div>
      <div className="info-card__body">
        <div className="info-card__title">{title}</div>
        <div className="info-card__text">{text}</div>
      </div>
    </a>
  );
}