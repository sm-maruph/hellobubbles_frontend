import { useEffect, useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { fetchRestaurant } from "../services/api";
import LinkButton from "../components/LinkButton";
import InfoCard from "../components/InfoCard";
import DrinkGallery from "../components/DrinkGallery";
import { DoubleHeart, CupIcon, OfferBadge } from "../components/Icon";

const SLUG = "hellobubbles";

export default function QrPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRestaurant(SLUG)
      .then(setData)
      .catch((err) => {
        console.error("fetchRestaurant failed:", err);
        setError(true);
      });
  }, []);

  if (error) return <div className="state">Couldn’t load this page. Try again.</div>;
  if (!data) return <div className="state">Loading…</div>;

  return (
    <div className="qr-screen">
      <div className="qr-card">
        <h1 className="brand">
          <span className="brand__script">Hello</span>
          <span className="brand__bold">Bubbles</span>
          <DoubleHeart size={24} />
        </h1>
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

        <div className="info-row">
          <InfoCard
            media={<CupIcon />}
            title="VIEW OUR WEBSITE"
            text="Explore flavors and customizations."
            href={data.menu_url}
          />
          <InfoCard
            media={
              <div className="offer-media">
                <OfferBadge />
                <span className="offer-media__tag">GET 10% OFF YOUR NEXT DRINK</span>
              </div>
            }
            title="LATEST OFFERS"
            text="Current deals and limited-time specials."
            href={data.offers_url}
          />
        </div>

        <h2 className="wonders">Explore Our Bubble Wonders</h2>
        <DrinkGallery drinks={data.drinks} />

        <footer className="qr-footer">
          <p className="qr-footer__url">{data.website_label}</p>
          <p>Made with love by {data.name}</p>
          <span className="qr-footer__heart"><DoubleHeart size={30} /></span>
        </footer>
      </div>
    </div>
  );
}