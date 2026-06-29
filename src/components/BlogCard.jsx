import "./BlogCard.css";

/** A single blog preview: image, date, title. Whole card is a link. */
export default function BlogCard({ image, imageAlt = "", date, title, href = "#" }) {
  return (
    <a className="blog-card" href={href}>
      <div className="blog-card__media">
        {image ? (
          <img src={image} alt={imageAlt || title} loading="lazy" />
        ) : (
          <span className="blog-card__ph" />
        )}
      </div>
      {date && <p className="blog-card__date">{date}</p>}
      <h3 className="blog-card__title">{title}</h3>
    </a>
  );
}
