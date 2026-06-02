import { createAdminClient } from "@/lib/supabase/admin";
import { markRead } from "@/app/actions/messages";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/lib/types";

export default async function MessagesPage() {
  const db = createAdminClient();
  const { data } = await db.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 500, color: "var(--ink)" }}>
          Messages
          {unread > 0 && (
            <span style={{ marginLeft: "0.75rem", fontSize: "0.75rem", backgroundColor: "var(--accent)", color: "#fff", padding: "0.15rem 0.55rem", borderRadius: "999px" }}>
              {unread} new
            </span>
          )}
        </h1>
      </div>

      {messages.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No messages yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ padding: "1.5rem", backgroundColor: msg.read ? "transparent" : "rgba(192,57,43,0.03)", border: "1px solid var(--border)", borderLeft: msg.read ? "1px solid var(--border)" : "3px solid var(--accent)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: msg.is_anonymous ? "var(--muted)" : "var(--accent)", border: "1px solid", borderColor: msg.is_anonymous ? "var(--border)" : "var(--accent)", padding: "0.12rem 0.5rem" }}>
                      {msg.is_anonymous ? "Anonymous" : "Named"}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{formatDate(msg.created_at)}</span>
                    {!msg.read && <span style={{ fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>● Unread</span>}
                  </div>
                  {!msg.is_anonymous && (
                    <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.25rem" }}>
                      {msg.name}
                      {msg.email && <span style={{ color: "var(--muted)", fontWeight: 300 }}> · {msg.email}</span>}
                    </p>
                  )}
                  {msg.is_anonymous && msg.hint && (
                    <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "0.25rem" }}>
                      Hint: {msg.hint}
                    </p>
                  )}
                </div>
                {!msg.read && (
                  <form action={async () => { "use server"; await markRead(msg.id); }}>
                    <button type="submit" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.25rem 0.65rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                      Mark read
                    </button>
                  </form>
                )}
              </div>
              <p style={{ fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.75, color: "var(--ink)", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
