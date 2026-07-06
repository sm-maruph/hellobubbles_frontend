import { useRef, useState, useEffect, useCallback } from "react";
import "./Aboutus.css";

/* Dummy images — swap for your backend URLs later. */
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
  "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=",
  "https://t3.ftcdn.net/jpg/01/28/52/18/360_F_128521888_fmzQgeBbrnCpAS7A4wKPKbu0VDikCeBh.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScIOwkO2vEtaD2f3SIWMtx-OfPUfTpbkFxQqIvDl5OBhiMx2D5hsSycaNN&s=10",
  "https://www.foodandwine.com/thmb/wUW4lb3uY6RNxeohbebwb-H_2QY=/fit-in/532x368/filters:no_upscale():max_bytes(150000):strip_icc()/Most-Anticipated-Restaurant-Openings-Summer-2026-FT-DGTL0626-Driskill-Bar-and-Grill-01-280d4be0075e432fb1abd1d897403f67.jpg",
];

/**
 * About section with a single-image auto-advancing carousel (5s).
 * `images` is an array of image URLs (empty/falsy entries are ignored).
 */
export default function AboutUs({
  title = "About Us",
  text = "Welcome to Hello Bubbles, where passion meets flavor. We're dedicated to serving handcrafted dishes with love. Our story began with a desire to share warmth through food. Join us for an unforgettable culinary experience.",
  images = DEFAULT_IMAGES,
  interval = 5000,
  id = "about",
}) {
  const provided = (images || []).filter(Boolean);
  const slides = provided.length ? provided : DEFAULT_IMAGES;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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

  return (
    <section className="about" id={id}>
      <div className="container about__inner">
        <h2 className="about__title">{title}</h2>
        <p className="about__text">{text}</p>

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
      </div>
    </section>
  );
}