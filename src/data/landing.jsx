/* =========================================================
   LANDING CONTENT
   Central place for page content. Swap these values for data
   fetched from your admin panel / API when the backend is ready.
   Image fields can be imported assets or URLs from your backend.
========================================================= */

export const landingData = {
  nav: {
    logo: "Hello Bubbles",
    links: [
      { label: "About", href: "#about" },
      { label: "Menu", href: "#menu" },
      { label: "Reservations", href: "#reservations" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
    cta: { label: "Book Table", href: "#reservations" },
  },

  hero: {
    title: "Hello Bubbles — Savor the Flavor",
    subtitle:
      "Indulge in our handcrafted dishes, where flavors meet love. Join us for an unforgettable culinary journey!",
    ctaLabel: "Make a Reservation",
    ctaHref: "#reservations",
    image: "", // e.g. "/images/hero.jpg" or a URL from your backend
  },

  about: {
    title: "About Us",
    text:
      "Welcome to Hello Bubbles, where passion meets flavor. We're dedicated to serving handcrafted dishes with love. Our story began with a desire to share warmth through food. Join us for an unforgettable culinary experience.",
    images: ["", "", "", ""], // up to 4 image URLs
  },
};
