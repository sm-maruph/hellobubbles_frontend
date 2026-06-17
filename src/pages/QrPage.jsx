import { useRef, useState, useLayoutEffect } from "react";
import { FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LinkButton from "../components/LinkButton";
import InfoCard from "../components/InfoCard";
import DrinkGallery from "../components/DrinkGallery";
import { DoubleHeart, CupIcon, OfferBadge } from "../components/Icon";
import logo from "../assets/Hello_Bubbles_Logo.png";
import offer from "../assets/offer.png";

import { restaurant as data } from "../data/restaurant";

export default function QrPage() {
  const cardRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [modal, setModal] = useState(null); // "soon" | "offer" | null

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let frame;

    const fit = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (!w || !h) return;

        const s = Math.min(
          window.innerWidth / w,
          window.innerHeight / h,
          1.3
        );

        setScale(isNaN(s) ? 1 : s);
      });
    };

    fit();
    window.addEventListener("resize", fit);

    return () => {
      window.removeEventListener("resize", fit);
      cancelAnimationFrame(frame);
    };
  }, []);

  const mapsUrl =
    data.maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      data.address || ""
    )}`;

  return (
    <div className="fit-screen">

      {/* MAIN CARD */}
      <div
        className="qr-card"
        ref={cardRef}
        style={{ transform: `scale(${scale})` }}
      >
        <img src={logo} alt="Hello Bubbles" className="brand-logo" />
        <p className="welcome">{data.welcome_text}</p>

        <LinkButton
          href={data.instagram_url}
          icon={<FaInstagram />}
          title="Follow us on Instagram"
          subtitle={data.instagram_handle}
          caption="See our daily bubbles!"
        />

        <LinkButton
          href={data.google_review_url}
          icon={<FcGoogle />}
          title="Leave a Google Review"
          subtitle={`★ ${data.rating} rating | ${data.review_count}+ Reviews`}
          extraLine="We love your feedback!"
        />

        <LinkButton
          href={data.tiktok_url}
          icon={<FaTiktok />}
          title="Watch on TikTok"
          subtitle={data.tiktok_handle}
          caption="Behind the scenes fun!"
          dark
        />

        {/* INFO CARDS */}
        <div className="info-row">
          <InfoCard
            media={<CupIcon size={46} />}
            title="VIEW OUR WEBSITE"
            text="Explore flavors and customizations."
            onClick={() => setModal("soon")}
          />

          <InfoCard
            media={
              <div className="offer-media">
                <OfferBadge size={42} />
                <span className="offer-media__tag">
                  GET 10% OFF YOUR NEXT DRINK
                </span>
              </div>
            }
            title="LATEST OFFERS"
            text="Current deals and limited-time specials."
            onClick={() => setModal("offer")}
          />
        </div>

        <h2 className="wonders">Explore Our Bubble Wonders</h2>
        <DrinkGallery drinks={data.drinks} />

        <footer className="qr-footer">
          <p className="qr-footer__url">{data.website_label}</p>
          <p>Made with love by {data.name}</p>
          <span className="qr-footer__heart">
            <DoubleHeart size={28} />
          </span>
        </footer>

        <div className="contact-bar">
          <a
            className="contact-bar__icon"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in Google Maps"
          >
            <FaMapMarkerAlt />
          </a>

          <span className="contact-bar__address">{data.address}</span>

          <a
            className="contact-bar__icon"
            href={`tel:${data.phone}`}
            aria-label="Call us"
          >
            <FaPhoneAlt />
          </a>
        </div>

        <footer className="credit-footer">
          Developed by{" "}
          <a href="#" target="_blank" rel="noreferrer">
            Theatives
          </a>
        </footer>
      </div>

      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "auto",
              height: "80vh",
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {modal === "soon" && (
              <>
                <h3>Coming Soon</h3>
                <p>Our website is under construction.</p>
              </>
            )}

            {modal === "offer" && (
              <img
                src={offer}
                alt="Offer"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            )}

            <button
              onClick={() => setModal(null)}
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                border: "none",
                background: "#000",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}