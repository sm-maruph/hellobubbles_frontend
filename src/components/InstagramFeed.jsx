import { useEffect } from "react";
import "./InstagramFeed.css";

export default function InstagramFeed({
  eyebrow = "Instagram",
  title = "Follow Our Daily Bubbles",
  handle = "@hellobubbles.officials",
  profileUrl = "https://www.instagram.com/hellobubbles.officials/",
  feedId = "7i8UGdDh8KVGnQJVPboJ",
  id = "instagram",
}) {
  // load Behold's widget script once
  useEffect(() => {
    if (window.__bhldScript) return;
    window.__bhldScript = true;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    document.head.appendChild(s);
  }, []);

  return (
    <section className="ig" id={id}>
      <div className="container">
        <div className="ig__head">
          <div>
            {eyebrow && <p className="ig__eyebrow">{eyebrow}</p>}
            <h2 className="ig__title">{title}</h2>
          </div>
          <a className="ig__handle" href={profileUrl} target="_blank" rel="noreferrer">
            {handle}
          </a>
        </div>

        <behold-widget feed-id={feedId} />
      </div>
    </section>
  );
}