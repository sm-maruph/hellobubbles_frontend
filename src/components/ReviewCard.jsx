import "./ReviewCard.css";

/** A single testimonial: quote + avatar, name, role. */
export default function ReviewCard({ quote, name, role, avatar }) {
  return (
    <article className="review-card">
      <p className="review-card__quote">{quote}</p>

      <div className="review-card__author">
        {avatar ? (
          <img className="review-card__avatar" src={avatar} alt="" loading="lazy" />
        ) : (
          <span className="review-card__avatar review-card__avatar--ph" />
        )}
        <div>
          <p className="review-card__name">{name}</p>
          {role && <p className="review-card__role">{role}</p>}
        </div>
      </div>
    </article>
  );
}
