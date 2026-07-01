import { useEffect, useState } from "react";
import Button from "./Button";
import "./OrderModal.css";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor"
    strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;

const DEFAULT_RESTAURANT = {
  name: "Eatery",
  address: "782 S Westwood Blvd, Los Angeles, CA 90024",
  phone: "+1 (212) 555-1212",
  hours: "Mon–Sat: 9:00 AM – 12:00 PM · Sun: 6:00 AM – 12:00 PM",
};

/**
 * Pickup order popup.
 *  - open: boolean
 *  - items: [{ id, name, price, qty? }]
 *  - restaurant: details shown on the confirmation
 *  - onClose(): close the modal
 *  - onPlaced(order): called after a successful order
 */
export default function OrderModal({
  open,
  items = [],
  restaurant = DEFAULT_RESTAURANT,
  onClose,
  onPlaced,
}) {
  const [lines, setLines] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  // reset each time it opens
  useEffect(() => {
    if (open) {
      setLines(items.map((it) => ({ ...it, qty: it.qty ?? 1 })));
      setName("");
      setPhone("");
      setPlaced(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Esc to close + lock background scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const setQty = (i, delta) =>
    setLines((ls) =>
      ls.map((l, idx) =>
        idx === i ? { ...l, qty: Math.max(1, l.qty + delta) } : l
      )
    );

  const totalItems = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + (Number(l.price) || 0) * l.qty, 0);
  const valid = name.trim() && phone.trim().length >= 6 && lines.length > 0;

  const place = (e) => {
    e.preventDefault();
    if (!valid) return;
    const no = `EAT-${Date.now().toString().slice(-6)}`;
    setOrderNo(no);
    setPlaced(true);
    onPlaced?.({ orderNo: no, name, phone, items: lines, total });
  };

  return (
    <div className="omodal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="omodal__box" onClick={(e) => e.stopPropagation()}>
        <button className="omodal__close" aria-label="Close" onClick={onClose}>
          <XIcon />
        </button>

        {!placed ? (
          <form className="omodal__body" onSubmit={place}>
            <h3 className="omodal__title">Order for Pickup</h3>

            <div className="omodal__items">
              {lines.map((l, i) => (
                <div className="oline" key={l.id ?? i}>
                  <span className="oline__name">{l.name}</span>
                  <div className="oline__qty">
                    <button type="button" onClick={() => setQty(i, -1)} aria-label="Decrease">–</button>
                    <span>{l.qty}</span>
                    <button type="button" onClick={() => setQty(i, 1)} aria-label="Increase">+</button>
                  </div>
                  <span className="oline__price">
                    {money((Number(l.price) || 0) * l.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="omodal__total">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <div className="omodal__fields">
              <input
                className="ofield"
                placeholder="Your name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="ofield"
                type="tel"
                placeholder="Phone number*"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="solid"
              className="omodal__submit"
              disabled={!valid}
            >
              Place Order
            </Button>
          </form>
        ) : (
          <div className="omodal__body omodal__success">
            <span className="omodal__check">
              <CheckIcon />
            </span>
            <h3 className="omodal__title">Your order has been placed!</h3>
            <p className="omodal__msg">
              Our representative will call you shortly to confirm your pickup.
            </p>

            <div className="omodal__summary">
              <div className="orow"><span>Order no.</span><strong>#{orderNo}</strong></div>
              <div className="orow"><span>Name</span><strong>{name}</strong></div>
              <div className="orow"><span>Phone</span><strong>{phone}</strong></div>
              <div className="orow"><span>Items</span><strong>{totalItems}</strong></div>
              <div className="orow"><span>Total</span><strong>{money(total)}</strong></div>
            </div>

            <div className="omodal__restaurant">
              <p className="omodal__rtitle">{restaurant.name}</p>
              <p>{restaurant.address}</p>
              <p>{restaurant.phone}</p>
              <p>{restaurant.hours}</p>
            </div>

            <Button type="button" variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
