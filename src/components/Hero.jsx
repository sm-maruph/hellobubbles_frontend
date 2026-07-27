import { useState, useEffect, useCallback } from "react";
import Button from "./Button";
import { getHeroImages } from "../lib/api";
import "./Hero.css";
import heroImg from "../assets/fuska.jpg";
import heroLogo from "../assets/Hello_Bubbles_Logo_white.png";

export default function Hero({
  title = "Hello Bubbles — The Food Artisan",
  subtitle = "Indulge in our handcrafted dishes, where flavors meet love. Join us for an unforgettable culinary journey!",
  ctaLabel = "Make a Order",
  ctaHref = "#menu",
  imageAlt = "Signature dish at Hello Bubbles",
  interval = 5000,
  id = "home",
}) {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    getHeroImages().then(({ data }) => {
      if (alive && data?.length) setImages(data.map((r) => r.image_url).filter(Boolean));
    });
    return () => { alive = false; };
  }, []);

  const slides = images.length ? images : [heroImg];   // fallback to bundled image

  const go = useCallback((i) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  useEffect(() => {
    setIndex((i) => (i >= slides.length ? 0 : i));
  }, [slides.length]);

  return (
    <section className="hero" id={id}>
      <div className="container">
        <div className="hero__head">
          <img className="hero__logo" src={heroLogo} alt={title} />
          <p className="hero__subtitle">{subtitle}</p>
          <Button as="a" href={ctaHref} variant="outline">
            {ctaLabel}
          </Button>
        </div>

        <figure className="hero__media">
          <div className="hero__viewport">
            <div className="hero__track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {slides.map((src, i) => (
                <img
                  className="hero__slide"
                  src={src}
                  alt={imageAlt}
                  key={i}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>
          </div>

          {slides.length > 1 && (
            <div className="hero__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`hero__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}