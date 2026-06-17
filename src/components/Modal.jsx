import { useRef, useState, useLayoutEffect } from "react";
import { FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LinkButton from "../components/LinkButton";
import InfoCard from "../components/InfoCard";
import DrinkGallery from "../components/DrinkGallery";
import Modal from "../components/Modal";
import { DoubleHeart, CupIcon, OfferBadge } from "../components/Icon";
import logo from "../assets/Hello_Bubbles_Logo.png";
import { restaurant as data } from "../data/restaurant";

export default function QrPage() {
    const cardRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [modal, setModal] = useState(null);          // null | "offer" | "soon"

    useLayoutEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const fit = () => {
            const w = el.offsetWidth, h = el.offsetHeight;
            if (!w || !h) return;
            setScale(Math.min(window.innerWidth / w, window.innerHeight / h, 1.3));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        window.addEventListener("resize", fit);
        return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
    }, []);

    const mapsUrl =
        data.maps_url ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || "")}`;

    return (
        <div className="fit-screen">
            <div className="qr-card" ref={cardRef} style={{ transform: `scale(${scale})` }}>
                <img src={logo} alt="Hello Bubbles" className="brand-logo" />
                <p className="welcome">{data.welcome_text}</p>

                <LinkButton href={data.instagram_url} icon={<FaInstagram />}
                    title="Follow us on Instagram" subtitle={data.instagram_handle} caption="See our daily bubbles!" />
                <LinkButton href={data.google_review_url} icon={<FcGoogle />}
                    title="Leave a Google Review" subtitle={`★ ${data.rating} rating | ${data.review_count}+ Reviews`}
                    extraLine="We love your feedback!" />
                <LinkButton href={data.tiktok_url} icon={<FaTiktok />}
                    title="Watch on TikTok" subtitle={data.tiktok_handle} caption="Behind the scenes fun!" dark />

                <div className="info-row">
                    <InfoCard
                        media={<CupIcon size={46} />}
                        title="VIEW OUR WEBSITE"
                        text="Explore flavors and customizations."
                        onClick={() => setModal("soon")}
                    />
                    <InfoCard
                        media={<div className="offer-media"><OfferBadge size={42} />
                            <span className="offer-media__tag">GET 10% OFF YOUR NEXT DRINK</span></div>}
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
                    <span className="qr-footer__heart"><DoubleHeart size={28} /></span>
                </footer>

                <div className="contact-bar">
                    <a className="contact-bar__icon" href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Open in Google Maps"><FaMapMarkerAlt /></a>
                    <span className="contact-bar__address">{data.address}</span>
                    <a className="contact-bar__icon" href={`tel:${data.phone}`} aria-label="Call us"><FaPhoneAlt /></a>
                </div>

                <footer className="credit-footer">
                    Developed by <a href="#" target="_blank" rel="noreferrer">Theatives</a>
                </footer>
            </div>

            {/* modals live OUTSIDE the scaled card */}
            <Modal open={modal === "offer"} onClose={() => setModal(null)}>
                <img src="/offer.png" alt="Latest offer" className="modal-img" />
            </Modal>

            <Modal open={modal === "soon"} onClose={() => setModal(null)}>
                <div className="modal-soon">
                    <h3>We’re coming soon!</h3>
                    <p>Our website is under construction. Check back shortly.</p>
                </div>
            </Modal>
        </div>
    );
}