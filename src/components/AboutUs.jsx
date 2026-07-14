import { useState, useEffect, useCallback } from "react";
import { getAboutImages } from "../lib/api";
import "./Aboutus.css";

/* Fallback images — used while loading or if none are set in the admin. */
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
  "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=",
  "https://t3.ftcdn.net/jpg/01/28/52/18/360_F_128521888_fmzQgeBbrnCpAS7A4wKPKbu0VDikCeBh.jpg",
];

export default function AboutUs({
  title = "About Us",
  text = "Welcome to Hello Bubbles, where passion meets flavor. We're dedicated to serving handcrafted dishes with love. Our story began with a desire to share warmth through food. Join us for an unforgettable culinary experience.",
  interval = 5000,
  id = "about",
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // fetch About images from Supabase
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await getAboutImages();
        if (!alive) return;
        if (!error && data && data.length) {
          setImages(data.map((r) => r.image_url).filter(Boolean));
        }
      } catch {
        /* keep fallback */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const slides = images.length ? images : DEFAULT_IMAGES;

  const go = useCallback(
    (i) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  // auto-advance every `interval` ms (paused on hover/touch)
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
    <section className="about" id={id}>
      <div className="container about__inner">
        <h2 className="about__title">{title}</h2>
        <p className="about__text">{text}</p>

        {loading ? (
          <div className="about__carousel">
            <div className="about__viewport">
              <div className="about__slide about__slide--skeleton" />
            </div>
          </div>
        ) : (
          <>
            <div
              className="about__carousel"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              <button
                className="about__nav about__nav--prev"
                onClick={() => go(index - 1)}
                aria-label="Previous"
              >
                ‹
              </button>

              <div className="about__viewport">
                <div
                  className="about__track"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((src, i) => (
                    <figure className="about__slide" key={i}>
                      <img src={src} alt="" loading={i === 0 ? "eager" : "lazy"} />
                    </figure>
                  ))}
                </div>
              </div>

              <button
                className="about__nav about__nav--next"
                onClick={() => go(index + 1)}
                aria-label="Next"
              >
                ›
              </button>
            </div>

            <div className="about__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`about__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}