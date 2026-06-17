export function DoubleHeart({ size = 22, color = "#1b1b1b" }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 64 48" fill="none"
      stroke={color} strokeWidth="2" style={{ verticalAlign: "middle" }}>
      <path d="M20 12c-3-6-12-6-13 1-1 7 7 12 13 18 6-6 14-11 13-18-1-7-10-7-13-1z" />
      <path d="M40 8c-3-6-12-6-13 1-1 7 7 12 13 18 6-6 14-11 13-18-1-7-10-7-13-1z" />
    </svg>
  );
}

export function CupIcon({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
      <rect x="13" y="9" width="22" height="5" rx="2" fill="#9bb3c9" />
      <path d="M15 14h18l-2 30a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" fill="#dcecf5" stroke="#9bb3c9" strokeWidth="1.5" />
      <circle cx="20" cy="41" r="2" fill="#4a2c1a" />
      <circle cx="25" cy="43" r="2" fill="#4a2c1a" />
      <circle cx="29" cy="41" r="2" fill="#4a2c1a" />
      <circle cx="24" cy="45" r="2" fill="#4a2c1a" />
    </svg>
  );
}

export function OfferBadge({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="15" cy="15" r="12" fill="#e24b4a" />
      <text x="15" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">%</text>
      <rect x="21" y="22" width="13" height="11" rx="1.5" fill="#e8b04b" />
      <rect x="21" y="25" width="13" height="3" fill="#c8922f" />
      <rect x="26.5" y="22" width="2" height="11" fill="#c8922f" />
    </svg>
  );
}