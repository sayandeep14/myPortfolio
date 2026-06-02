import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

const NAV_LINKS = [
  { href: "/admin/posts",     label: "Posts" },
  { href: "/admin/posts/new", label: "+ New Post" },
  { href: "/admin/messages",  label: "Messages" },
  { href: "/the-lab",         label: "View The Lab ↗" },
  { href: "/",                label: "← Portfolio" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ display: "flex", minHeight: "100svh" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: 220, flexShrink: 0, backgroundColor: "var(--ink)", borderRight: "1px solid rgba(245,244,240,0.06)", display: "flex", flexDirection: "column", padding: "2rem 1.5rem", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 200 }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1rem", fontWeight: 600, color: "var(--bg)" }}>SG · Admin</p>
          {user && <p style={{ fontSize: "0.62rem", color: "rgba(245,244,240,0.25)", marginTop: "0.25rem", fontWeight: 300, wordBreak: "break-all" }}>{user.email}</p>}
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,244,240,0.5)", textDecoration: "none", padding: "0.75rem 0", borderBottom: "1px solid rgba(245,244,240,0.06)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <SignOutButton />
      </aside>

      {/* Main content */}
      <main className="admin-main" style={{ flex: 1, marginLeft: 220, padding: "2.5rem", backgroundColor: "var(--bg)", minHeight: "100svh" }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 767px) {
          .admin-sidebar { display: none; }
          .admin-main    { margin-left: 0 !important; padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
