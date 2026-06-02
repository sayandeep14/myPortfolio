"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const portfolioLinks = [
  { label: "About",      href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects",   href: "/#projects" },
  { label: "Hobbies",    href: "/#hobbies" },
  { label: "Links",      href: "/#links" },
  { label: "Contact",    href: "/#contact" },
  { label: "The Lab",    href: "/the-lab" },
];

const labLinks = [
  { label: "← Portfolio", href: "/" },
  { label: "The Lab",     href: "/the-lab" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const navRef    = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Don't render on any admin route — admin has its own sidebar
  if (pathname.startsWith("/admin")) return null;

  const isLab   = pathname.startsWith("/the-lab");
  const links   = isLab ? labLinks : portfolioLinks;
  const logoHref = isLab ? "/" : "/#";

  // On the home page (#anchor links are same-page), use plain hrefs.
  // On any other page, links already use absolute paths like /#about.

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power3.out" }
    );
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const bgColor = isLab
    ? (scrolled || menuOpen ? "rgba(17,17,17,0.96)"  : "transparent")
    : (scrolled || menuOpen ? "rgba(245,244,240,0.96)" : "transparent");

  const textColor   = isLab ? "var(--bg)"  : "var(--ink)";
  const mutedColor  = isLab ? "rgba(245,244,240,0.45)" : "var(--muted)";
  const borderColor = isLab ? "rgba(245,244,240,0.06)" : "var(--border)";
  const overlayBg   = isLab ? "rgba(17,17,17,0.97)" : "rgba(245,244,240,0.97)";
  const overlayText = isLab ? "var(--bg)" : "var(--ink)";

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 500,
          padding: scrolled ? "1rem 0" : "1.75rem 0",
          backgroundColor: bgColor,
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom: scrolled && !menuOpen ? `1px solid ${borderColor}` : "none",
          transition: "padding 0.4s ease, background-color 0.4s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a
            href={logoHref}
            onClick={closeMenu}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: textColor, textDecoration: "none", letterSpacing: "-0.01em", zIndex: 10 }}
          >
            SG
          </a>

          {/* Desktop links */}
          <ul className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: mutedColor, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = mutedColor)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", padding: "0.5rem", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "5px", zIndex: 10 }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: 22, height: 1.5, backgroundColor: textColor,
                transition: "transform 0.3s, opacity 0.3s", transformOrigin: "center",
                transform: menuOpen && i === 0 ? "translateY(6.5px) rotate(45deg)"
                  : menuOpen && i === 2 ? "translateY(-6.5px) rotate(-45deg)" : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 499,
          backgroundColor: overlayBg, backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 2.5rem",
          opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {links.map((link, i) => (
            <li key={link.href} style={{ borderBottom: `1px solid ${borderColor}`, overflow: "hidden" }}>
              <a
                href={link.href}
                onClick={closeMenu}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1.5rem 0", textDecoration: "none",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: 500, color: overlayText,
                  transform: menuOpen ? "translateY(0)" : "translateY(100%)",
                  transitionDelay: menuOpen ? `${i * 0.05}s` : "0s",
                  transitionProperty: "transform, color", transitionDuration: "0.4s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onTouchStart={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onTouchEnd={(e) => (e.currentTarget.style.color = overlayText)}
              >
                <span>{link.label}</span>
                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: mutedColor, fontFamily: "var(--font-dm-sans)" }}>
                  0{i + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "3rem", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: mutedColor }}>
          Sayandeep Giri · Portfolio 2025
        </p>
      </div>

      <style>{`
        .nav-desktop-links { display: flex !important; }
        .nav-hamburger { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
