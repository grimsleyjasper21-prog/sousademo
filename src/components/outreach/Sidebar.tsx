"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/outreach", label: "Today" },
  { href: "/outreach/leads", label: "Leads" },
  { href: "/outreach/import", label: "Import" },
  { href: "/outreach/history", label: "History" },
  { href: "/outreach/settings", label: "Settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/outreach") return pathname === "/outreach";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="oe-sidebar">
      <div className="oe-wordmark">GRIMHART</div>
      <nav className="oe-sidebar-nav">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="oe-nav-link"
            data-active={isActive(pathname, link.href)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
