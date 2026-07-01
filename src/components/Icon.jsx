/* Small inline icons (no icon library needed). All use currentColor. */

export const HeartIcon = ({ filled = false, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.35-9.3-8.5C1.2 8.9 2.5 5.9 5.5 5.5c1.9-.25 3.4.9 4.5 2.3C11.1 6.4 12.6 5.25 14.5 5.5c3 .4 4.3 3.4 2.8 6-2.3 4.15-9.3 8.5-9.3 8.5z" />
  </svg>
);

export const BagIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 7h12l1 13H5L6 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

export const ReceiptIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
    <path d="M9 7h6M9 11h6M9 15h4" />
  </svg>
);

export const QrIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 0h2v2h-2v-2zm0-4h2v2h-2v-2z" />
  </svg>
);

export const XIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const TrashIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
);
export const DoubleHeart = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 24" fill="none" aria-hidden="true">
    <path d="M12 21S3 15 3 8.5A5 5 0 0 1 12 5a5 5 0 0 1 9 3.5C21 15 12 21 12 21z" fill="#d62828" />
    <path d="M30 21s-9-6-9-12.5A5 5 0 0 1 30 5a5 5 0 0 1 9 3.5C39 15 30 21 30 21z" fill="#161616" />
  </svg>
);

export const OfferBadge = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#d62828" />
    <path d="M17 17h2v2h-2zM29 29h2v2h-2zM17 31 31 17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const CupIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
    <path d="M8 8V5a4 4 0 0 1 8 0v3" />
  </svg>
);