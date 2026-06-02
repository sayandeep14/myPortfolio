"use client";

import { useState } from "react";
import { sendMessage } from "@/app/actions/messages";

export default function ContactForm() {
  const [anon, setAnon] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", hint: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendMessage({
        is_anonymous: anon,
        name:    anon ? undefined : form.name,
        email:   anon ? undefined : form.email,
        hint:    anon && form.hint ? form.hint : undefined,
        message: form.message,
      });
      setStatus("sent");
      setForm({ name: "", email: "", hint: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem",
    background: "rgba(245,244,240,0.06)", border: "1px solid rgba(245,244,240,0.12)",
    color: "var(--bg)", fontSize: "0.875rem", fontWeight: 300,
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    outline: "none", transition: "border-color 0.2s",
  };

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <p style={{ fontSize: "1.4rem", fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--bg)", marginBottom: "0.5rem" }}>
          Message received.
        </p>
        <p style={{ fontSize: "0.85rem", color: "rgba(245,244,240,0.45)", fontWeight: 300 }}>
          I'll get back to you if you left contact details.
        </p>
        <button onClick={() => setStatus("idle")} style={{ marginTop: "1.5rem", background: "none", border: "1px solid rgba(245,244,240,0.2)", color: "rgba(245,244,240,0.5)", padding: "0.5rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Anonymous toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid rgba(245,244,240,0.1)", marginBottom: "0.5rem" }}>
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--bg)", marginBottom: "0.2rem", fontWeight: 400 }}>
            Send anonymously
          </p>
          <p style={{ fontSize: "0.7rem", color: "rgba(245,244,240,0.4)", fontWeight: 300 }}>
            Your name and email won&apos;t be collected
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAnon((a) => !a)}
          style={{
            width: 44, height: 24, borderRadius: 12,
            backgroundColor: anon ? "var(--accent)" : "rgba(245,244,240,0.15)",
            border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
            transition: "background-color 0.25s",
          }}
          aria-label="Toggle anonymous"
        >
          <span style={{
            position: "absolute", top: 3, left: anon ? 23 : 3,
            width: 18, height: 18, borderRadius: "50%", backgroundColor: "#fff",
            transition: "left 0.25s",
          }} />
        </button>
      </div>

      {anon ? (
        <div>
          <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,244,240,0.4)", marginBottom: "0.4rem" }}>
            Hint <span style={{ color: "rgba(245,244,240,0.2)" }}>(optional — so I might know who you are)</span>
          </label>
          <input style={inputStyle} placeholder="e.g. we met at college..." value={form.hint} onChange={set("hint")} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="contact-form-grid">
          <div>
            <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,244,240,0.4)", marginBottom: "0.4rem" }}>Name *</label>
            <input required style={inputStyle} placeholder="Your name" value={form.name} onChange={set("name")} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,244,240,0.4)", marginBottom: "0.4rem" }}>Email *</label>
            <input required type="email" style={inputStyle} placeholder="your@email.com" value={form.email} onChange={set("email")} />
          </div>
        </div>
      )}

      <div>
        <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,244,240,0.4)", marginBottom: "0.4rem" }}>Message *</label>
        <textarea
          required
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="What's on your mind?"
          value={form.message}
          onChange={set("message")}
        />
      </div>

      {status === "error" && (
        <p style={{ fontSize: "0.78rem", color: "var(--accent)" }}>Something went wrong. Try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          padding: "0.85rem 2rem", backgroundColor: status === "sending" ? "transparent" : "var(--accent)",
          border: "1px solid var(--accent)", color: "#fff",
          fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          alignSelf: "flex-start", transition: "background-color 0.2s",
        }}
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      <style>{`
        @media (max-width: 600px) { .contact-form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </form>
  );
}
