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
      
  { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },

  // { label: "Location", href: "#location" },
  { label: "Social", href: "#instagram" },
  { label: "Contact", href: "#location" },

    ],
    cta: { label: "Make an Order", href: "#menu" },
  },

  hero: {
    title: "Hello Bubbles — The Food Artisan",
    subtitle:
      "Indulge in our handcrafted dishes, where flavors meet love. Join us for an unforgettable culinary journey!",
    ctaLabel: "Make An Order",
    ctaHref: "#menu",
    image: "", // e.g. "/images/hero.jpg" or a URL from your backend
  },

  about: {
    title: "About Us",
    text: "Welcome to Hello Bubbles...",
    images: [
      "https://picsum.photos/seed/hb-about1/600/400",
      "https://picsum.photos/seed/hb-about2/600/400",
      "https://picsum.photos/seed/hb-about3/600/400",
      "https://picsum.photos/seed/hb-about4/800/400",
    ],
  }
};
