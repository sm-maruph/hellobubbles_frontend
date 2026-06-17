export default function LinkButton({ href, icon, title, subtitle, extraLine, caption, dark }) {
  return (
    <>
      <a
        className={`link-btn ${dark ? "link-btn--dark" : "link-btn--red"}`}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <span className="link-btn__icon">{icon}</span>
        <span className="link-btn__text">
          <strong>{title}</strong>
          {subtitle && <span>{subtitle}</span>}
          {extraLine && <span>{extraLine}</span>}
        </span>
      </a>
      {caption && <p className="link-btn__caption">{caption}</p>}
    </>
  );
}