import { createAdminClient } from "@/lib/supabase/admin";
import PostCard from "@/components/lab/PostCard";
import ContactForm from "@/components/lab/ContactForm";
import type { Post, PostType } from "@/lib/types";

const FILTERS: { value: PostType | "all"; label: string }[] = [
  { value: "all",     label: "All" },
  { value: "article", label: "Articles" },
  { value: "link",    label: "Links" },
  { value: "music",   label: "Music" },
  { value: "movie",   label: "Movies" },
  { value: "book",    label: "Books" },
];

export default async function TheLabPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const db = createAdminClient();

  let query = db.from("posts").select("*").eq("published", true).order("created_at", { ascending: false });
  if (type && type !== "all") query = query.eq("type", type);

  const { data: posts } = await query;
  const feed = (posts ?? []) as Post[];

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "8rem 0 4rem", backgroundColor: "var(--ink)", borderBottom: "1px solid rgba(245,244,240,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.5rem" }}>
            The Lab
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 500, color: "var(--bg)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Thoughts, reviews &amp;<br />
            <em style={{ color: "var(--accent)" }}>things I love.</em>
          </h1>
          <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "rgba(245,244,240,0.45)", maxWidth: 460, lineHeight: 1.85 }}>
            My creative and intellectual corner — articles, links I find interesting, movies, music and books that shape how I think.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "flex", gap: 0, overflowX: "auto" }}>
          {FILTERS.map(({ value, label }) => {
            const active = (type ?? "all") === value;
            return (
              <a
                key={value}
                href={value === "all" ? "/the-lab" : `/the-lab?type=${value}`}
                style={{
                  padding: "1rem 1.25rem", fontSize: "0.68rem", letterSpacing: "0.14em",
                  textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap",
                  color: active ? "var(--accent)" : "var(--muted)",
                  borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Feed */}
      <section style={{ padding: "4rem 0", backgroundColor: "var(--bg)", minHeight: "40vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
          {feed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--muted)" }}>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Nothing here yet.</p>
              <p style={{ fontSize: "0.82rem", fontWeight: 300 }}>Check back soon — something is brewing.</p>
            </div>
          ) : (
            <div className="lab-grid">
              {feed.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "6rem 0", backgroundColor: "var(--ink)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.5rem" }}>
            Drop a note
          </p>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 500, color: "var(--bg)", lineHeight: 1.15, marginBottom: "3rem" }}>
            Say something,<br />
            <em style={{ color: "var(--accent)" }}>anonymously or not.</em>
          </h2>
          <ContactForm />
        </div>
      </section>

      <style>{`
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) { .lab-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .lab-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
