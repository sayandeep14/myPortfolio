"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/actions/messages";

// ─── SVG hand-drawn elements ──────────────────────────────────────────────────

function PaperPlane({ size = 36, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <path d="M2.5 18.5 L33.5 3.5 L21.5 32.5 L15.5 19.5 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M15.5 19.5 L21.5 14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function DoodleStar({ size = 26, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <path d="M13 1 L15.5 10.5 L25 13 L15.5 15.5 L13 25 L10.5 15.5 L1 13 L10.5 10.5 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function Envelope({ size = 34, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 34 24.5" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <path d="M2 2.5 L32 2.5 L32 22 L2 22 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 4 L17 14.5 L32 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SpeechBubble({ size = 36, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.83} viewBox="0 0 36 30" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <path d="M3 2 Q3 0.5 4.5 0.5 L31.5 0.5 Q33 0.5 33 2 L33 19 Q33 20.5 31.5 20.5 L14 20.5 L8 29 L8 20.5 L4.5 20.5 Q3 20.5 3 19 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function Heart({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 28 24.5" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <path d="M14 22.5 C14 22.5 1.5 14.5 1.5 7 C1.5 3.5 4.5 1 7.5 1 C10 1 12.5 2.5 14 4.5 C15.5 2.5 18 1 20.5 1 C23.5 1 26.5 3.5 26.5 7 C26.5 14.5 14 22.5 14 22.5 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function RubiksCube({ size = 30, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <path d="M15 2 L28 9.5 L28 21.5 L15 29 L2 21.5 L2 9.5 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M15 2 L15 15.5 L2 9.5" stroke={color} strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M15 15.5 L28 9.5" stroke={color} strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M15 15.5 L15 29" stroke={color} strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M8.5 6 L8.5 19" stroke={color} strokeWidth="0.7" strokeLinecap="round"/>
      <path d="M21.5 6 L21.5 19" stroke={color} strokeWidth="0.7" strokeLinecap="round"/>
      <path d="M3.5 13 L14.5 18.5" stroke={color} strokeWidth="0.7" strokeLinecap="round"/>
      <path d="M15.5 18.5 L26.5 13" stroke={color} strokeWidth="0.7" strokeLinecap="round"/>
    </svg>
  );
}

function Guitar({ size = 48, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size * 0.5} height={size} viewBox="0 0 22 48" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <ellipse cx="11" cy="37" rx="8.5" ry="9.5" stroke={color} strokeWidth="1.5"/>
      <ellipse cx="11" cy="27" rx="5" ry="6" stroke={color} strokeWidth="1.5"/>
      <rect x="9.5" y="4.5" width="3" height="22.5" rx="1.2" stroke={color} strokeWidth="1.4"/>
      <rect x="7.5" y="1" width="7" height="5.5" rx="1.5" stroke={color} strokeWidth="1.4"/>
      <circle cx="11" cy="33" r="2.8" stroke={color} strokeWidth="1.1"/>
      <path d="M8.5 37 L13.5 37" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function Microphone({ size = 40, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 22 40" fill="none" style={{ filter: "url(#roughen)", display: "block" }}>
      <rect x="5.5" y="1.5" width="11" height="19" rx="5.5" stroke={color} strokeWidth="1.5"/>
      <path d="M3 14 C3 14 3 22 11 22 C19 22 19 14 19 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 22 L11 34" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5.5 34 L16.5 34" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Floating background layer ────────────────────────────────────────────────

function FloatingElements() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Paper planes – fly across */}
      <div className="el fly-right" style={{ top: "11%", animationDuration: "14s", animationDelay: "0s" }}>
        <PaperPlane size={40} color="#e8c47d"/>
      </div>
      <div className="el fly-left" style={{ top: "67%", animationDuration: "11s", animationDelay: "-5s" }}>
        <PaperPlane size={28} color="#a8e8b8"/>
      </div>
      <div className="el fly-right" style={{ top: "43%", animationDuration: "18s", animationDelay: "-9s" }}>
        <PaperPlane size={22} color="#f4a8c0"/>
      </div>

      {/* Stars – twinkle in place */}
      <div className="el twinkle" style={{ top: "16%", left: "11%", animationDuration: "4s", animationDelay: "0s" }}>
        <DoodleStar size={22} color="#f9e784"/>
      </div>
      <div className="el twinkle" style={{ top: "57%", left: "83%", animationDuration: "3.2s", animationDelay: "-1.5s" }}>
        <DoodleStar size={16} color="#f9e784"/>
      </div>
      <div className="el twinkle" style={{ top: "87%", left: "27%", animationDuration: "5s", animationDelay: "-0.7s" }}>
        <DoodleStar size={28} color="#f9e784"/>
      </div>
      <div className="el twinkle" style={{ top: "33%", left: "93%", animationDuration: "3.8s", animationDelay: "-2s" }}>
        <DoodleStar size={14} color="#f9e784"/>
      </div>
      <div className="el twinkle" style={{ top: "6%", left: "38%", animationDuration: "4.5s", animationDelay: "-3s" }}>
        <DoodleStar size={19} color="#f9e784"/>
      </div>

      {/* Envelopes – drift */}
      <div className="el drift" style={{ top: "21%", left: "74%", animationDuration: "9s", animationDelay: "-2s" }}>
        <Envelope size={36} color="#c8a8e8"/>
      </div>
      <div className="el drift" style={{ top: "77%", left: "7%", animationDuration: "11s", animationDelay: "0s" }}>
        <Envelope size={26} color="#c8a8e8"/>
      </div>
      <div className="el drift" style={{ top: "50%", left: "2%", animationDuration: "13s", animationDelay: "-6s" }}>
        <Envelope size={20} color="#c8a8e8"/>
      </div>

      {/* Speech bubbles – float up and restart */}
      <div className="el float-up" style={{ top: "88%", left: "6%", animationDuration: "13s", animationDelay: "0s" }}>
        <SpeechBubble size={34} color="#80c8e8"/>
      </div>
      <div className="el float-up" style={{ top: "92%", left: "88%", animationDuration: "10s", animationDelay: "-4s" }}>
        <SpeechBubble size={24} color="#80c8e8"/>
      </div>
      <div className="el float-up" style={{ top: "95%", left: "52%", animationDuration: "15s", animationDelay: "-8s" }}>
        <SpeechBubble size={20} color="#80c8e8"/>
      </div>

      {/* Hearts – bounce float */}
      <div className="el bounce-float" style={{ top: "27%", left: "89%", animationDuration: "3.5s", animationDelay: "0s" }}>
        <Heart size={26} color="#f08080"/>
      </div>
      <div className="el bounce-float" style={{ top: "63%", left: "14%", animationDuration: "4s", animationDelay: "-1s" }}>
        <Heart size={20} color="#f08080"/>
      </div>
      <div className="el bounce-float" style={{ top: "7%", left: "57%", animationDuration: "2.8s", animationDelay: "-2s" }}>
        <Heart size={24} color="#f08080"/>
      </div>
      <div className="el bounce-float" style={{ top: "82%", left: "66%", animationDuration: "3.2s", animationDelay: "-0.5s" }}>
        <Heart size={18} color="#f08080"/>
      </div>

      {/* Rubik's cubes – tumble */}
      <div className="el tumble" style={{ top: "47%", left: "88%", animationDuration: "6s", animationDelay: "0s" }}>
        <RubiksCube size={30} color="#90e8a0"/>
      </div>
      <div className="el tumble" style={{ top: "14%", left: "61%", animationDuration: "8.5s", animationDelay: "-3s" }}>
        <RubiksCube size={22} color="#90d0f0"/>
      </div>
      <div className="el tumble" style={{ top: "74%", left: "44%", animationDuration: "7s", animationDelay: "-1.5s" }}>
        <RubiksCube size={18} color="#e8a8f0"/>
      </div>

      {/* Guitars – sway */}
      <div className="el sway" style={{ top: "16%", left: "4%", animationDuration: "8s", animationDelay: "0s" }}>
        <Guitar size={52} color="#e8b878"/>
      </div>
      <div className="el sway" style={{ top: "62%", left: "73%", animationDuration: "10s", animationDelay: "-4s" }}>
        <Guitar size={38} color="#e8b878"/>
      </div>

      {/* Mics – drift */}
      <div className="el drift" style={{ top: "51%", left: "95%", animationDuration: "8s", animationDelay: "-1s" }}>
        <Microphone size={42} color="#d0d0d0"/>
      </div>
      <div className="el drift" style={{ top: "7%", left: "83%", animationDuration: "12s", animationDelay: "-5s" }}>
        <Microphone size={30} color="#d0d0d0"/>
      </div>
    </div>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function labelStyle(dark: boolean): React.CSSProperties {
  return {
    display: "block",
    fontSize: "0.62rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: dark ? "rgba(245,244,240,0.35)" : "rgba(17,17,17,0.4)",
    marginBottom: "0.5rem",
    transition: "color 0.6s ease",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
  };
}

function inputStyle(dark: boolean): React.CSSProperties {
  return {
    width: "100%",
    background: "none",
    border: "none",
    borderBottom: `1px solid ${dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)"}`,
    padding: "0.55rem 0",
    fontSize: "0.88rem",
    fontWeight: 300,
    color: dark ? "rgba(245,244,240,0.88)" : "var(--ink)",
    outline: "none",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    transition: "border-color 0.3s ease, color 0.6s ease",
    boxSizing: "border-box" as const,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MessagePage() {
  const router = useRouter();
  const [isAnon, setIsAnon] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [, startTransition] = useTransition();

  const dark = isAnon;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    setStatus("sending");
    startTransition(async () => {
      try {
        await sendMessage({
          is_anonymous: isAnon,
          name: isAnon ? undefined : name || undefined,
          email: isAnon ? undefined : email || undefined,
          hint: isAnon && hint ? hint : undefined,
          message,
        });
        setStatus("sent");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <>
      {/* SVG filter – shared for all hand-drawn elements */}
      <svg width="0" height="0" style={{ position: "fixed", pointerEvents: "none" }}>
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" seed="5"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: dark ? "#0a0a0a" : "#f5f4f0",
          transition: "background-color 0.65s ease",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 1.5rem 3rem",
        }}
      >
        {/* Back arrow */}
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="msg-back"
          style={{
            position: "fixed",
            top: "1.5rem",
            left: "1.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.4rem 0.6rem",
            color: dark ? "rgba(245,244,240,0.45)" : "rgba(17,17,17,0.4)",
            fontSize: "1.3rem",
            zIndex: 100,
            lineHeight: 1,
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = dark ? "rgba(245,244,240,0.9)" : "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = dark ? "rgba(245,244,240,0.45)" : "rgba(17,17,17,0.4)")}
        >
          ←
        </button>

        {/* Flying elements – behind the card */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: isAnon ? 1 : 0,
            transition: "opacity 0.65s ease",
          }}
        >
          <FloatingElements />
        </div>

        {/* Form card */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 500,
            backgroundColor: dark ? "rgba(255,255,255,0.04)" : "#ffffff",
            border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(17,17,17,0.08)",
            borderRadius: 18,
            padding: "2.75rem 2.5rem",
            backdropFilter: dark ? "blur(24px)" : "none",
            boxShadow: dark ? "0 0 60px rgba(0,0,0,0.6)" : "0 8px 48px rgba(17,17,17,0.07)",
            transition: "background-color 0.65s ease, border-color 0.65s ease, box-shadow 0.65s ease",
          }}
        >
          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
              fontWeight: 500,
              color: dark ? "rgba(245,244,240,0.95)" : "var(--ink)",
              lineHeight: 1.18,
              marginBottom: "0.45rem",
              transition: "color 0.65s ease",
            }}
          >
            {isAnon ? (
              <>Say <em style={{ color: "var(--accent)" }}>anything.</em></>
            ) : (
              <>Drop a <em style={{ color: "var(--accent)" }}>note.</em></>
            )}
          </h1>

          <p
            style={{
              fontSize: "0.82rem",
              fontWeight: 300,
              color: dark ? "rgba(245,244,240,0.38)" : "rgba(17,17,17,0.45)",
              marginBottom: "1.75rem",
              lineHeight: 1.75,
              transition: "color 0.65s ease",
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            }}
          >
            {isAnon
              ? "No name. No trace. Just words."
              : "I'll read every message. Some I'll reply to."}
          </p>

          {/* Anonymous toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem" }}>
            <button
              onClick={() => { setStatus("idle"); setIsAnon((v) => !v); }}
              aria-label="Toggle anonymous"
              style={{
                width: 46,
                height: 26,
                borderRadius: 13,
                background: isAnon ? "var(--accent)" : "rgba(17,17,17,0.18)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.35s ease",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  left: isAnon ? 24 : 4,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  transition: "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.25)",
                }}
              />
            </button>
            <span
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: dark ? "rgba(245,244,240,0.42)" : "rgba(17,17,17,0.45)",
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                transition: "color 0.65s ease",
              }}
            >
              {isAnon ? "Anonymous" : "Signed"}
            </span>
          </div>

          {/* Sent state */}
          {status === "sent" ? (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem 0 0.5rem",
                color: dark ? "rgba(245,244,240,0.6)" : "rgba(17,17,17,0.5)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "1.5rem",
                  marginBottom: "0.6rem",
                  color: dark ? "rgba(245,244,240,0.92)" : "var(--ink)",
                }}
              >
                {isAnon ? "It's out there now." : "Sent."}
              </p>
              <p style={{ fontSize: "0.82rem", fontWeight: 300, lineHeight: 1.75, fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
                {isAnon
                  ? "Your words arrived safely, without a trace."
                  : "I'll get back to you soon. Thank you."}
              </p>
              <button
                onClick={() => { setMessage(""); setHint(""); setName(""); setEmail(""); setStatus("idle"); }}
                style={{
                  marginTop: "1.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                  padding: "0.3rem 0",
                }}
              >
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Official-only: name + email (collapse when anonymous) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  overflow: "hidden",
                  maxHeight: isAnon ? 0 : 160,
                  opacity: isAnon ? 0 : 1,
                  transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
                }}
              >
                <div>
                  <label style={labelStyle(dark)}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required={!isAnon}
                    tabIndex={isAnon ? -1 : 0}
                    style={inputStyle(dark)}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                  />
                </div>
                <div>
                  <label style={labelStyle(dark)}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required={!isAnon}
                    tabIndex={isAnon ? -1 : 0}
                    style={inputStyle(dark)}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                  />
                </div>
              </div>

              {/* Message (always shown) */}
              <div>
                <label style={labelStyle(dark)}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isAnon ? "Write anything. It's just between us." : "What's on your mind?"}
                  required
                  rows={5}
                  style={{
                    ...inputStyle(dark),
                    resize: "vertical",
                    minHeight: 120,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                />
              </div>

              {/* Anonymous-only: optional hint (collapse when official) */}
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: isAnon ? 90 : 0,
                  opacity: isAnon ? 1 : 0,
                  transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
                }}
              >
                <label style={labelStyle(dark)}>Leave a clue (optional)</label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="A small hint about who you are, if you'd like…"
                  tabIndex={isAnon ? 0 : -1}
                  style={inputStyle(dark)}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                />
              </div>

              {status === "error" && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--accent)",
                    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  alignSelf: "flex-start",
                  padding: "0.8rem 1.8rem",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: status === "sending" ? "default" : "pointer",
                  opacity: status === "sending" ? 0.65 : 1,
                  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                  transition: "opacity 0.25s, transform 0.15s",
                  marginTop: "0.25rem",
                }}
                onMouseEnter={(e) => { if (status !== "sending") (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
              >
                {status === "sending" ? "Sending…" : isAnon ? "Send anonymously" : "Send note"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        /* ── Floating element base ────────────────────────────── */
        .el {
          position: absolute;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }

        /* fly-right: start off-screen left, end off-screen right */
        .fly-right {
          left: 0;
          animation-name: fly-right;
        }
        @keyframes fly-right {
          from { transform: translateX(-120px) rotate(-12deg); }
          to   { transform: translateX(calc(100vw + 120px)) rotate(-12deg); }
        }

        /* fly-left: start off-screen right, end off-screen left */
        .fly-left {
          right: 0;
          animation-name: fly-left;
        }
        @keyframes fly-left {
          from { transform: translateX(120px) rotate(10deg); }
          to   { transform: translateX(calc(-100vw - 120px)) rotate(10deg); }
        }

        /* twinkle: scale + rotate pulse */
        .twinkle {
          animation-name: twinkle;
          animation-timing-function: ease-in-out;
        }
        @keyframes twinkle {
          0%, 100% { transform: scale(1) rotate(0deg);   opacity: 0.65; }
          50%       { transform: scale(1.4) rotate(180deg); opacity: 1; }
        }

        /* drift: gentle wavy float */
        .drift {
          animation-name: drift;
          animation-timing-function: ease-in-out;
        }
        @keyframes drift {
          0%   { transform: translate(0,  0)    rotate(0deg);  }
          25%  { transform: translate(9px, -13px) rotate(6deg);  }
          50%  { transform: translate(5px, -7px)  rotate(0deg);  }
          75%  { transform: translate(-7px, -15px) rotate(-6deg); }
          100% { transform: translate(0,  0)    rotate(0deg);  }
        }

        /* float-up: rises and fades, restarts */
        .float-up {
          animation-name: float-up;
          animation-timing-function: ease-in;
        }
        @keyframes float-up {
          0%   { transform: translateY(0)      rotate(-3deg); opacity: 0;   }
          10%  { opacity: 0.7; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(-115vh) rotate(8deg);  opacity: 0;   }
        }

        /* bounce-float: gentle vertical bounce */
        .bounce-float {
          animation-name: bounce-float;
          animation-timing-function: ease-in-out;
        }
        @keyframes bounce-float {
          0%, 100% { transform: translateY(0)    scale(1);    }
          50%       { transform: translateY(-18px) scale(1.06); }
        }

        /* tumble: full rotation */
        .tumble {
          animation-name: tumble;
          animation-timing-function: linear;
        }
        @keyframes tumble {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* sway: gentle pendulum */
        .sway {
          animation-name: sway;
          animation-timing-function: ease-in-out;
          transform-origin: top center;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-9deg); }
          50%       { transform: rotate(9deg);  }
        }

        /* Input placeholder color */
        .msg-page input::placeholder,
        .msg-page textarea::placeholder {
          color: rgba(245,244,240,0.2);
        }

        @media (max-width: 600px) {
          .msg-back { top: 1rem !important; left: 1rem !important; }
        }
      `}</style>
    </>
  );
}
