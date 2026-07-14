import { useState, useEffect, useCallback } from "react";
import ReviewCard from "./ReviewCard";
import { getReviews } from "../lib/api";
import "./Reviews.css";

/* Fallback reviews — used while loading or if none are set in the admin. */
const DEFAULT_REVIEWS = [
  {
    id: 1,
    quote:
      "Eatery offers a perfect blend of delicious cuisine and warm hospitality; it's my favorite spot for any occasion!",
    name: "Jessica",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    id: 2,
    quote:
      "Whether it's a date night or a family gathering, Eatery provides an unforgettable experience every time.",
    name: "David Lee",
    role: "Teacher",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    id: 3,
    quote:
      "Eatery is my go-to for gourmet meals; it's a place where passion for food truly shines through.",
    name: "Sarah Taylor",
    role: "Chef",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
];

export default function Reviews({
  title = "Client Reviews",
  interval = 5000,
  id = "reviews",
}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // fetch reviews from Supabase
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await getReviews();
        if (!alive) return;
        if (!error && data && data.length) {
          setReviews(
            data.map((r) => ({
              id: r.id,
              quote: r.quote,
              name: r.name,
              role: r.role,
              avatar: r.avatar_url,   // DB avatar_url → card `avatar`
            }))
          );
        }
      } catch {
        /* keep fallback */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const slides = reviews.length ? reviews : DEFAULT_REVIEWS;

  const go = useCallback(
    (i) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setIndex((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [paused, slides.length, interval, index]);

  // keep index valid if the number of slides changes after fetch
  useEffect(() => {
    setIndex((i) => (i >= slides.length ? 0 : i));
  }, [slides.length]);

  return (
    <section className="reviews" id={id}>
      <div className="container">
        <h2 className="reviews__title">{title}</h2>

        {loading ? (
          <div className="reviews__carousel">
            <div className="reviews__viewport">
              <div className="reviews__slide">
                <div className="review-card review-card--skeleton" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className="reviews__carousel"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              <button
                className="reviews__nav reviews__nav--prev"
                onClick={() => go(index - 1)}
                aria-label="Previous"
              >
                ‹
              </button>

              <div className="reviews__viewport">
                <div
                  className="reviews__track"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((r, i) => (
                    <div className="reviews__slide" key={r.id ?? i}>
                      <ReviewCard {...r} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="reviews__nav reviews__nav--next"
                onClick={() => go(index + 1)}
                aria-label="Next"
              >
                ›
              </button>
            </div>

            <div className="reviews__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`reviews__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}