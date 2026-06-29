/**
 * Centers content and applies the page max-width + gutters.
 * Use around any section content you want aligned to the grid.
 */
export default function Container({ as: Tag = "div", className = "", children }) {
  return <Tag className={`container ${className}`.trim()}>{children}</Tag>;
}
