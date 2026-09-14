"use client";
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet" | "invert";

/** One call-to-action element, rendered as a link or a button as needed. */
export default function Action({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  external = false,
  type = "button",
  disabled,
  ariaLabel,
}: {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const classes = `btn btn-${variant} ${className}`;

  if (href && external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
