import "./Aboutus.css";

/* Dummy images — swap for your backend URLs later.
   Lorem Picsum is reliable and deterministic per seed. For food-themed
   placeholders use: https://loremflickr.com/600/450/<keyword>,food */
const DEFAULT_IMAGES = [
  "https://picsum.photos/seed/eatery-about1/600/400",
  "https://picsum.photos/seed/eatery-about2/600/400",
  "https://picsum.photos/seed/eatery-about3/600/400",
  "https://picsum.photos/seed/eatery-about4/800/400",
];

/**
 * About section. `images` is an array of up to 4 image URLs.
 * Layout: two equal images on top, then a narrow + wide pair below
 * (matching the reference design). Empty slots show a placeholder.
 */
export default function AboutUs({
  title = "About Us",
  text = "Welcome to Eatery, where passion meets flavor. We're dedicated to serving handcrafted dishes with love. Our story began with a desire to share warmth through food. Join us for an unforgettable culinary experience.",
  images = DEFAULT_IMAGES,
  id = "about",
}) {
  const source = images.length ? images : DEFAULT_IMAGES;
  const cells = source.slice(0, 4);

  return (
    <section className="about" id={id}>
      <div className="container about__inner">
        <h2 className="about__title">{title}</h2>
        <p className="about__text">{text}</p>

        <div className="about__grid">
          {cells.map((src, i) => (
            <figure className={`about__cell about__cell--${i + 1}`} key={i}>
              {src ? (
                <img src={src} alt="" loading="lazy" />
              ) : (
                <span className="about__placeholder">Image {i + 1}</span>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}