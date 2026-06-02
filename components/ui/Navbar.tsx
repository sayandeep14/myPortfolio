"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          padding: scrolled ? "1rem 0" : "1.75rem 0",
          backgroundColor: scrolled || menuOpen ? "rgba(245,244,240,0.96)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom: scrolled && !menuOpen ? "1px solid var(--border)" : "none",
          transition: "padding 0.4s ease, background-color 0.4s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={closeMenu}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              zIndex: 10,
            }}
          >
            SG
          </a>

          {/* Desktop nav links */}
          <ul className="nav-desktop-links">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              zIndex: 10,
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                backgroundColor: "var(--ink)",
                transition: "transform 0.3s, opacity 0.3s",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                backgroundColor: "var(--ink)",
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                backgroundColor: "var(--ink)",
                transition: "transform 0.3s, opacity 0.3s",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="nav-mobile-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 499,
          backgroundColor: "rgba(245,244,240,0.97)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 2.5rem",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {links.map((link, i) => (
            <li key={link.href} style={{ borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
              <a
                href={link.href}
                onClick={closeMenu}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.5rem 0",
                  textDecoration: "none",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
                  fontWeight: 500,
                  color: "var(--ink)",
                  transition: "color 0.2s",
                  transform: menuOpen ? "translateY(0)" : "translateY(100%)",
                  transitionDelay: menuOpen ? `${i * 0.05}s` : "0s",
                  transitionProperty: "transform, color",
                  transitionDuration: "0.4s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onTouchStart={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onTouchEnd={(e) => (e.currentTarget.style.color = "var(--ink)")}
              >
                <span>{link.label}</span>
                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}>
                  0{i + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Footer info in overlay */}
        <p
          style={{
            marginTop: "3rem",
            fontSize: "0.7rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Sayandeep Giri · Portfolio 2025
        </p>
      </div>

      <style>{`
        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-hamburger {
          display: none;
        }
        @media (max-width: 767px) {
          .nav-desktop-links { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>
    </>
  );
}
