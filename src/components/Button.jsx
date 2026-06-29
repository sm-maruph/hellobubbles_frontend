import "./Button.css";

/**
 * Reusable button.
 *  - as: "button" | "a" (renders the right tag)
 *  - variant: "outline" | "solid" | "ghost"
 *  - size: "sm" | "md" | "lg"
 * Any extra props (href, onClick, type...) pass straight through.
 */
export default function Button({
  as: Tag = "button",
  variant = "outline",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag className={`btn btn--${variant} btn--${size} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
