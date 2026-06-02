"use client";

import { createClient } from "@/lib/supabase/client";

export default function AdminLogin({ searchParams }: { searchParams: { error?: string } }) {
  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--ink)" }}>
      <div style={{ textAlign: "center", padding: "3rem", border: "1px solid rgba(245,244,240,0.08)", maxWidth: 360, width: "100%" }}>
        <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--bg)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
          SG · Admin
        </p>
        <p style={{ fontSize: "0.75rem", color: "rgba(245,244,240,0.35)", fontWeight: 300, marginBottom: "2.5rem" }}>
          Sign in with your GitHub account to access the admin panel.
        </p>

        {searchParams.error && (
          <p style={{ fontSize: "0.78rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
            Access denied or auth error. Make sure you're using the authorised account.
          </p>
        )}

        <button
          onClick={signIn}
          style={{ width: "100%", padding: "0.85rem", backgroundColor: "var(--accent)", border: "none", color: "#fff", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
