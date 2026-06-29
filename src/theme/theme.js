/* =========================================================
   THEME (JS)
   Default token values + a helper to override the CSS
   variables at runtime. When your admin panel returns a
   saved theme, call applyTheme(savedTheme).
========================================================= */

export const defaultTheme = {
  colors: {
    bg: "#f6efd9",
    surface: "#ffffff",
    heading: "#1f1c19",
    text: "#2c2824",
    muted: "#6f675b",
    primary: "#c0654a",
    primaryStrong: "#a5543a",
    onPrimary: "#ffffff",
    border: "#ddd3bb",
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Poppins', system-ui, sans-serif",
  },
  radius: {
    sm: "6px",
    md: "12px",
    lg: "18px",
  },
};

const toKebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

/**
 * Apply theme tokens by setting CSS variables on an element (default <html>).
 * Pass a partial object — anything you omit keeps the default value.
 *
 *   applyTheme({ colors: { primary: "#2f7d62" } });
 */
export function applyTheme(theme = {}, el = document.documentElement) {
  const merged = {
    colors: { ...defaultTheme.colors, ...(theme.colors || {}) },
    fonts: { ...defaultTheme.fonts, ...(theme.fonts || {}) },
    radius: { ...defaultTheme.radius, ...(theme.radius || {}) },
  };

  Object.entries(merged.colors).forEach(([k, v]) =>
    el.style.setProperty(`--color-${toKebab(k)}`, v)
  );
  Object.entries(merged.fonts).forEach(([k, v]) =>
    el.style.setProperty(`--font-${toKebab(k)}`, v)
  );
  Object.entries(merged.radius).forEach(([k, v]) =>
    el.style.setProperty(`--radius-${toKebab(k)}`, v)
  );

  return merged;
}
