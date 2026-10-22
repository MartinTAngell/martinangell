"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "/about", target: "_self"},
  { label: "Publications", href: "/publications", target: "_self" },
  { label: "Rants", href: "/rants", target: "_self" },
  { label: "Resume", href: "/resume", target: "_blank" }
]

const LINKS_DELAY = 0.15;
const ANIMATION_STAGGER = 0.10;

const Nav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="relative z-10 flex items-center justify-between px-[4vw] py-5">
      <Link href="/" className="fade-in text-sm tracking-[0.22em] select-none hover:text-accent transition">
        MARTIN ANGELL
      </Link>
      <div className="hidden md:flex items-center gap-10 text-sm">
        {links.map(({ label, href, target }, i) => (
          <Link key={href} href={href} target={target}
            aria-current={isActive(href) ? "page" : undefined}
            className={`fade-in transition hover:text-fg 
              ${isActive(href) ? "text-fg underline decoration-accent decoration-2 underline-offset-8" : "text-accent-text"}`}
            style={{ animationDelay: `${LINKS_DELAY + i * ANIMATION_STAGGER}s` }}>
            {label}
          </Link>
        ))}
      </div>

      <button type="button" onClick={() => setOpen(!open)}
        aria-expanded={open} aria-controls="mobile-menu"
        className="md:hidden text-sm text-accent-text hover:text-fg">
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div id="mobile-menu"
          className="md:hidden absolute inset-x-0 top-full border-y border-dg bg-accent-bg px-[4vw] py-4">
          {links.map(({ label, href, target }) => (
            <Link key={href} href={href} target={target}
              aria-current={isActive(href) ? "page" : undefined}
              className={`block py-3 font-serif text-2xl ${isActive(href) ? "text-accent" : "text-fg"}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Nav 
