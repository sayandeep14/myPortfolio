"use client";

import { useState, useEffect, useCallback, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

// ─── Element picker ───────────────────────────────────────────────────────────

const EL_TYPES = ["plane", "star", "envelope", "bubble", "heart", "cube", "guitar", "mic"] as const;
type ElType = (typeof EL_TYPES)[number];

const EL_COLORS = [
  "#e8c47d", "#a8e8b8", "#f4a8c0", "#f9e784", "#c8a8e8",
  "#80c8e8", "#f08080", "#e8b878", "#90e8a0", "#d0d0d0",
  "#ffb347", "#87ceeb", "#dda0dd", "#98fb98",
];

function ElComponent({ type, size, color }: { type: ElType; size: number; color: string }) {
  switch (type) {
    case "plane":    return <PaperPlane size={size} color={color} />;
    case "star":     return <DoodleStar size={size} color={color} />;
    case "envelope": return <Envelope size={size} color={color} />;
    case "bubble":   return <SpeechBubble size={size} color={color} />;
    case "heart":    return <Heart size={size} color={color} />;
    case "cube":     return <RubiksCube size={size} color={color} />;
    case "guitar":   return <Guitar size={size} color={color} />;
    case "mic":      return <Microphone size={size} color={color} />;
  }
}

// ─── Spawned element (click-to-create) ───────────────────────────────────────

interface SpawnedItem {
  id: number;
  x: number;
  y: number;
  type: ElType;
  size: number;
  color: string;
  dx: number;
  dy: number;
  rotation: number;
}

function SpawnedElement({ item, onDone }: { item: SpawnedItem; onDone: (id: number) => void }) {
  // phase 0 = invisible (scale 0), 1 = popped (scale 1), 2 = flying away
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    // Double rAF so the browser paints phase-0 before transitioning
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase(1)));
    const t1 = setTimeout(() => setPhase(2), 500);
    const t2 = setTimeout(() => onDone(item.id), 4500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [item.id, onDone]);

  const transform =
    phase === 0 ? "scale(0) rotate(0deg)"
    : phase === 1 ? "scale(1) rotate(0deg)"
    : `translate(${item.dx}px, ${item.dy}px) rotate(${item.rotation}deg) scale(0.15)`;

  const transition =
    phase === 0 ? "none"
    : phase === 1 ? "transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s"
    : "transform 3.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 3.4s ease-out";

  return (
    <div
      className="spawned-outer"
      style={{
        position: "fixed",
        left: item.x - item.size / 2,
        top: item.y - item.size / 2,
        zIndex: 8,
        pointerEvents: phase === 1 ? "all" : "none",
        transform,
        opacity: phase === 2 ? 0 : 1,
        transition,
        transformOrigin: "center center",
        cursor: "crosshair",
      }}
    >
      <div className="el-glow">
        <ElComponent type={item.type} size={item.size} color={item.color} />
      </div>
    </div>
  );
}

// ─── Static floating background ───────────────────────────────────────────────

function FloatingElements() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Paper planes – fly across */}
      {[
        { top: "11%", dur: "14s", del: "0s",  sz: 40, col: "#e8c47d", cls: "fly-right" },
        { top: "67%", dur: "11s", del: "-5s", sz: 28, col: "#a8e8b8", cls: "fly-left"  },
        { top: "43%", dur: "18s", del: "-9s", sz: 22, col: "#f4a8c0", cls: "fly-right" },
      ].map((p, i) => (
        <div key={i} className={`el-outer ${p.cls}`} style={{ top: p.top, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><PaperPlane size={p.sz} color={p.col}/></div>
        </div>
      ))}

      {/* Stars – twinkle */}
      {[
        { top: "16%", left: "11%", dur: "4s",   del: "0s",   sz: 22 },
        { top: "57%", left: "83%", dur: "3.2s", del: "-1.5s",sz: 16 },
        { top: "87%", left: "27%", dur: "5s",   del: "-0.7s",sz: 28 },
        { top: "33%", left: "93%", dur: "3.8s", del: "-2s",  sz: 14 },
        { top: "6%",  left: "38%", dur: "4.5s", del: "-3s",  sz: 19 },
      ].map((p, i) => (
        <div key={i} className="el-outer twinkle" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><DoodleStar size={p.sz} color="#f9e784"/></div>
        </div>
      ))}

      {/* Envelopes – drift */}
      {[
        { top: "21%", left: "74%", dur: "9s",  del: "-2s", sz: 36 },
        { top: "77%", left: "7%",  dur: "11s", del: "0s",  sz: 26 },
        { top: "50%", left: "2%",  dur: "13s", del: "-6s", sz: 20 },
      ].map((p, i) => (
        <div key={i} className="el-outer drift" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><Envelope size={p.sz} color="#c8a8e8"/></div>
        </div>
      ))}

      {/* Speech bubbles – float up */}
      {[
        { top: "88%", left: "6%",  dur: "13s", del: "0s",  sz: 34 },
        { top: "92%", left: "88%", dur: "10s", del: "-4s", sz: 24 },
        { top: "95%", left: "52%", dur: "15s", del: "-8s", sz: 20 },
      ].map((p, i) => (
        <div key={i} className="el-outer float-up" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><SpeechBubble size={p.sz} color="#80c8e8"/></div>
        </div>
      ))}

      {/* Hearts – bounce */}
      {[
        { top: "27%", left: "89%", dur: "3.5s", del: "0s",   sz: 26 },
        { top: "63%", left: "14%", dur: "4s",   del: "-1s",  sz: 20 },
        { top: "7%",  left: "57%", dur: "2.8s", del: "-2s",  sz: 24 },
        { top: "82%", left: "66%", dur: "3.2s", del: "-0.5s",sz: 18 },
      ].map((p, i) => (
        <div key={i} className="el-outer bounce-float" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><Heart size={p.sz} color="#f08080"/></div>
        </div>
      ))}

      {/* Rubik's cubes – tumble */}
      {[
        { top: "47%", left: "88%", dur: "6s",   del: "0s",   sz: 30, col: "#90e8a0" },
        { top: "14%", left: "61%", dur: "8.5s", del: "-3s",  sz: 22, col: "#90d0f0" },
        { top: "74%", left: "44%", dur: "7s",   del: "-1.5s",sz: 18, col: "#e8a8f0" },
      ].map((p, i) => (
        <div key={i} className="el-outer tumble" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><RubiksCube size={p.sz} color={p.col}/></div>
        </div>
      ))}

      {/* Guitars – sway */}
      {[
        { top: "16%", left: "4%",  dur: "8s",  del: "0s",  sz: 52 },
        { top: "62%", left: "73%", dur: "10s", del: "-4s", sz: 38 },
      ].map((p, i) => (
        <div key={i} className="el-outer sway" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><Guitar size={p.sz} color="#e8b878"/></div>
        </div>
      ))}

      {/* Mics – drift */}
      {[
        { top: "51%", left: "95%", dur: "8s",  del: "-1s", sz: 42 },
        { top: "7%",  left: "83%", dur: "12s", del: "-5s", sz: 30 },
      ].map((p, i) => (
        <div key={i} className="el-outer drift" style={{ top: p.top, left: p.left, animationDuration: p.dur, animationDelay: p.del }}>
          <div className="el-glow"><Microphone size={p.sz} color="#d0d0d0"/></div>
        </div>
      ))}
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

// ─── Inner page (needs useSearchParams → must be inside Suspense) ─────────────

function MessagePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialAnon = params.get("type") !== "signed";

  const [isAnon, setIsAnon] = useState(initialAnon);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [spawned, setSpawned] = useState<SpawnedItem[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [, startTransition] = useTransition();

  const dark = isAnon;

  // "Click anywhere" hint: fade in after 1.8s, fade out after 5s
  useEffect(() => {
    if (!isAnon) { setShowHint(false); return; }
    const t1 = setTimeout(() => setShowHint(true), 1800);
    const t2 = setTimeout(() => setShowHint(false), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isAnon]);

  const removeSpawned = useCallback((id: number) => {
    setSpawned((prev) => prev.filter((e) => e.id !== id));
  }, []);

  function handlePageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isAnon) return;
    const target = e.target as HTMLElement;
    if (target.closest(".msg-card") || target.closest(".msg-back")) return;

    const angle = Math.random() * Math.PI * 2;
    const dist = 140 + Math.random() * 180;

    setSpawned((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        type: EL_TYPES[Math.floor(Math.random() * EL_TYPES.length)],
        size: 26 + Math.floor(Math.random() * 28),
        color: EL_COLORS[Math.floor(Math.random() * EL_COLORS.length)],
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 720,
      },
    ]);
  }

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
      {/* SVG roughen filter */}
      <svg width="0" height="0" style={{ position: "fixed", pointerEvents: "none" }}>
        <defs>
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" seed="5"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      {/* Spawned elements (fixed layer, above floating, below card) */}
      {spawned.map((item) => (
        <SpawnedElement key={item.id} item={item} onDone={removeSpawned} />
      ))}

      <div
        onClick={handlePageClick}
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
          cursor: dark ? "crosshair" : "default",
        }}
      >
        {/* Back arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); router.back(); }}
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

        {/* Static floating background elements */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            opacity: isAnon ? 1 : 0,
            transition: "opacity 0.65s ease",
          }}
        >
          {/* pointer-events re-enabled per-element via .el-outer CSS */}
          <FloatingElements />
        </div>

        {/* "Click anywhere" hint */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            pointerEvents: "none",
            opacity: showHint ? 0.45 : 0,
            transition: "opacity 1s ease",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(245,244,240,0.8)",
            fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          ✦ Click anywhere
        </div>

        {/* Form card */}
        <div
          className="msg-card"
          onClick={(e) => e.stopPropagation()}
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
            cursor: "default",
          }}
        >
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
            {isAnon ? <>Say <em style={{ color: "var(--accent)" }}>anything.</em></> : <>Drop a <em style={{ color: "var(--accent)" }}>note.</em></>}
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
            {isAnon ? "No name. No trace. Just words." : "I'll read every message. Some I'll reply to."}
          </p>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem" }}>
            <button
              onClick={() => { setStatus("idle"); setIsAnon((v) => !v); }}
              aria-label="Toggle anonymous"
              style={{
                width: 46, height: 26, borderRadius: 13,
                background: isAnon ? "var(--accent)" : "rgba(17,17,17,0.18)",
                border: "none", cursor: "pointer", position: "relative",
                transition: "background 0.35s ease", flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute", top: 4, left: isAnon ? 24 : 4,
                  width: 18, height: 18, borderRadius: "50%",
                  backgroundColor: "#fff",
                  transition: "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.25)",
                }}
              />
            </button>
            <span
              style={{
                fontSize: "0.68rem", letterSpacing: "0.13em", textTransform: "uppercase",
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
            <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem" }}>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", marginBottom: "0.6rem", color: dark ? "rgba(245,244,240,0.92)" : "var(--ink)" }}>
                {isAnon ? "It's out there now." : "Sent."}
              </p>
              <p style={{ fontSize: "0.82rem", fontWeight: 300, lineHeight: 1.75, fontFamily: "var(--font-dm-sans), system-ui, sans-serif", color: dark ? "rgba(245,244,240,0.45)" : "rgba(17,17,17,0.5)" }}>
                {isAnon ? "Your words arrived safely, without a trace." : "I'll get back to you soon. Thank you."}
              </p>
              <button
                onClick={() => { setMessage(""); setHint(""); setName(""); setEmail(""); setStatus("idle"); }}
                style={{ marginTop: "1.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", padding: "0.3rem 0" }}
              >
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Official: name + email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", overflow: "hidden", maxHeight: isAnon ? 0 : 160, opacity: isAnon ? 0 : 1, transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease" }}>
                <div>
                  <label style={labelStyle(dark)}>Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required={!isAnon} tabIndex={isAnon ? -1 : 0} style={inputStyle(dark)}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                  />
                </div>
                <div>
                  <label style={labelStyle(dark)}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required={!isAnon} tabIndex={isAnon ? -1 : 0} style={inputStyle(dark)}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle(dark)}>Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={isAnon ? "Write anything. It's just between us." : "What's on your mind?"} required rows={5}
                  style={{ ...inputStyle(dark), resize: "vertical", minHeight: 120 }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                />
              </div>

              {/* Anonymous-only hint */}
              <div style={{ overflow: "hidden", maxHeight: isAnon ? 90 : 0, opacity: isAnon ? 1 : 0, transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease" }}>
                <label style={labelStyle(dark)}>Leave a clue (optional)</label>
                <input type="text" value={hint} onChange={(e) => setHint(e.target.value)} placeholder="A small hint about who you are, if you'd like…" tabIndex={isAnon ? 0 : -1} style={inputStyle(dark)}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = dark ? "rgba(245,244,240,0.14)" : "rgba(17,17,17,0.18)")}
                />
              </div>

              {status === "error" && (
                <p style={{ fontSize: "0.78rem", color: "var(--accent)", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", fontWeight: 300 }}>
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ alignSelf: "flex-start", padding: "0.8rem 1.8rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? 0.65 : 1, fontFamily: "var(--font-dm-sans), system-ui, sans-serif", transition: "opacity 0.25s, transform 0.15s", marginTop: "0.25rem" }}
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
        /* ── Floating element wrapper ───────────────────────────── */
        .el-outer {
          position: absolute;
          pointer-events: all;
          cursor: crosshair;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }

        /* ── Glow target (inner) ───────────────────────────────── */
        .el-glow {
          transition: filter 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── Hover glow: warm multi-layer halo ────────────────── */
        .el-outer:hover .el-glow,
        .spawned-outer:hover .el-glow {
          filter:
            drop-shadow(0 0 5px rgba(255, 220, 100, 0.95))
            drop-shadow(0 0 12px rgba(255, 200, 80,  0.7))
            drop-shadow(0 0 28px rgba(255, 160, 50,  0.45))
            drop-shadow(0 0 50px rgba(255, 130, 30,  0.2));
          transform: scale(1.22);
        }

        /* ── Animation keyframes ───────────────────────────────── */
        .fly-right { left: 0; animation-name: fly-right; }
        @keyframes fly-right {
          from { transform: translateX(-130px) rotate(-12deg); }
          to   { transform: translateX(calc(100vw + 130px)) rotate(-12deg); }
        }

        .fly-left { right: 0; animation-name: fly-left; }
        @keyframes fly-left {
          from { transform: translateX(130px) rotate(10deg); }
          to   { transform: translateX(calc(-100vw - 130px)) rotate(10deg); }
        }

        .twinkle { animation-name: twinkle; animation-timing-function: ease-in-out; }
        @keyframes twinkle {
          0%, 100% { transform: scale(1)   rotate(0deg);   opacity: 0.6; }
          50%       { transform: scale(1.4) rotate(180deg); opacity: 1;   }
        }

        .drift { animation-name: drift; animation-timing-function: ease-in-out; }
        @keyframes drift {
          0%   { transform: translate(0,     0)    rotate(0deg);  }
          25%  { transform: translate(9px,  -13px) rotate(6deg);  }
          50%  { transform: translate(5px,  -7px)  rotate(0deg);  }
          75%  { transform: translate(-7px, -15px) rotate(-6deg); }
          100% { transform: translate(0,     0)    rotate(0deg);  }
        }

        .float-up { animation-name: float-up; animation-timing-function: ease-in; }
        @keyframes float-up {
          0%   { transform: translateY(0)      rotate(-3deg); opacity: 0;   }
          10%  { opacity: 0.65; }
          85%  { opacity: 0.6;  }
          100% { transform: translateY(-115vh) rotate(8deg);  opacity: 0;   }
        }

        .bounce-float { animation-name: bounce-float; animation-timing-function: ease-in-out; }
        @keyframes bounce-float {
          0%, 100% { transform: translateY(0)    scale(1);    }
          50%       { transform: translateY(-18px) scale(1.06); }
        }

        .tumble { animation-name: tumble; animation-timing-function: linear; }
        @keyframes tumble {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .sway { animation-name: sway; animation-timing-function: ease-in-out; transform-origin: top center; }
        @keyframes sway {
          0%, 100% { transform: rotate(-9deg); }
          50%       { transform: rotate(9deg);  }
        }

        /* ── Spawned element wrapper ───────────────────────────── */
        .spawned-outer { cursor: crosshair; }

        /* ── Input / textarea placeholders ─────────────────────── */
        .msg-card input::placeholder,
        .msg-card textarea::placeholder { color: rgba(245,244,240,0.2); }

        @media (max-width: 600px) {
          .msg-back { top: 1rem !important; left: 1rem !important; }
        }
      `}</style>
    </>
  );
}

// ─── Exported page (Suspense required for useSearchParams in app dir) ─────────

export default function MessagePage() {
  return (
    <Suspense fallback={null}>
      <MessagePageInner />
    </Suspense>
  );
}
