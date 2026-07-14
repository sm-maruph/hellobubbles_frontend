import "./Contact.css";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/**
 * Contact section with an embedded Google Map (no API key required).
 * Place it before <Footer />. `mapQuery` defaults to the address.
 */
export default function Contact({
  title = "Visit Us",
  subtitle = "Find us in the heart of the city — drop by, call ahead, or send a message.",
  address = "15 Market Way, London, United Kingdom E14 6AH",
  phone = "07952 931101",
  email = "info.foodartisan@gmail.com",
  hours = ["Everyday: 11:00 AM – 11:00 PM"],
  mapQuery,
  id = "location",
}) {
  const query = mapQuery || address;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section className="contact" id={id}>
      <div className="container">
        <div className="contact__grid">
          <div className="contact__info">
            <h2 className="contact__title">{title}</h2>
            {subtitle && <p className="contact__subtitle">{subtitle}</p>}

            <ul className="contact__list">
              <li className="contact__item">
                <span className="contact__icon"><PinIcon /></span>
                <span>{address}</span>
              </li>
              <li className="contact__item">
                <span className="contact__icon"><PhoneIcon /></span>
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
              </li>
              <li className="contact__item">
                <span className="contact__icon"><MailIcon /></span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li className="contact__item">
                <span className="contact__icon"><ClockIcon /></span>
                <span>
                  {hours.map((h, i) => (
                    <span key={i} className="contact__hours-line">{h}</span>
                  ))}
                </span>
              </li>
            </ul>

            <a
              className="contact__directions"
              href={directions}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions →
            </a>
          </div>

          <div className="contact__map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0029916556555!2d-0.018000323120721723!3d51.513161110282155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760319b50453e5%3A0x4684b2e495c6cd4d!2sHello%20Bubbles!5e0!3m2!1sen!2sbd!4v1783967391603!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Hello Bubbles Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
