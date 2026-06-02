import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { formatDate, youtubeThumbnail } from "@/lib/utils";
import type { Post } from "@/lib/types";
import Link from "next/link";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = createAdminClient();
  const { data } = await db.from("posts").select("*").eq("slug", slug).eq("published", true).single();
  if (!data) notFound();
  const post = data as Post;

  return (
    <>
      {/* Header */}
      <section style={{ padding: "7rem 0 3rem", backgroundColor: "var(--ink)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 2rem" }}>
          <Link href="/the-lab" style={{ fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,244,240,0.4)", textDecoration: "none", display: "inline-block", marginBottom: "2rem" }}>
            ← The Lab
          </Link>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>
            {post.type.toUpperCase()}
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.8rem, 5vw, 3.2rem)", fontWeight: 500, color: "var(--bg)", lineHeight: 1.18, marginBottom: "1.5rem" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(245,244,240,0.35)" }}>
            {formatDate(post.created_at)}
            {post.type === "movie" && post.movie_rating && ` · Rating: ${post.movie_rating}/10`}
            {post.movie_genre && ` · ${post.movie_genre}`}
          </p>
          {post.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.25rem" }}>
              {post.tags.map((t) => (
                <span key={t} style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.65rem", border: "1px solid rgba(245,244,240,0.12)", color: "rgba(245,244,240,0.4)" }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "3rem 0 6rem", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 2rem" }}>

          {/* YouTube embed */}
          {post.type === "music" && post.youtube_video_id && (
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ position: "relative", paddingBottom: "56.25%", backgroundColor: "#111" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${post.youtube_video_id}`}
                  title={post.song_title ?? post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
              {post.artist && (
                <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--muted)", fontWeight: 300 }}>
                  {post.song_title} — {post.artist}
                </p>
              )}
            </div>
          )}

          {/* Book details */}
          {post.type === "book" && (
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              {post.book_cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.book_cover_url} alt={post.title} style={{ width: 140, flexShrink: 0, boxShadow: "0 4px 20px rgba(17,17,17,0.12)" }} />
              )}
              <div>
                {post.book_author && <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.5rem" }}>by {post.book_author}</p>}
                {post.book_amazon_url && (
                  <a href={post.book_amazon_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)", paddingBottom: "1px" }}>
                    View on Amazon ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Link preview */}
          {post.type === "link" && post.link_url && (
            <a href={post.link_url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", border: "1px solid var(--border)", marginBottom: "2.5rem", textDecoration: "none", alignItems: "flex-start", flexWrap: "wrap" }}>
              {post.og_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.og_image} alt="" style={{ width: 160, height: 100, objectFit: "cover", flexShrink: 0 }} />
              )}
              <div>
                <p style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.35rem" }}>{post.og_domain}</p>
                <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.05rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.5rem" }}>{post.og_title ?? post.title}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 300, lineHeight: 1.6 }}>{post.og_desc}</p>
              </div>
            </a>
          )}

          {/* Article / review body */}
          {post.content && (
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          )}

          {/* Excerpt if no full content */}
          {!post.content && post.excerpt && (
            <p style={{ fontSize: "1rem", fontWeight: 300, lineHeight: 1.9, color: "var(--muted)" }}>{post.excerpt}</p>
          )}
        </div>
      </section>

      <style>{`
        .prose { font-size: 1rem; font-weight: 300; line-height: 1.9; color: var(--ink); font-family: var(--font-dm-sans), system-ui, sans-serif; }
        .prose p { margin-bottom: 1.4em; }
        .prose h1, .prose h2, .prose h3 { font-family: var(--font-playfair), Georgia, serif; font-weight: 500; color: var(--ink); margin: 1.6em 0 0.5em; }
        .prose h1 { font-size: 2rem; }
        .prose h2 { font-size: 1.5rem; }
        .prose h3 { font-size: 1.2rem; }
        .prose blockquote { border-left: 3px solid var(--accent); padding-left: 1.25rem; color: var(--muted); font-style: italic; margin: 1.5em 0; }
        .prose a { color: var(--accent); }
        .prose code { background: rgba(17,17,17,0.06); padding: 0.1em 0.35em; font-size: 0.88em; }
        .prose pre { background: #111; color: #f5f4f0; padding: 1.25rem; overflow-x: auto; margin: 1.5em 0; }
        .prose pre code { background: none; }
        .prose img { max-width: 100%; margin: 1.5em 0; }
        .prose ul, .prose ol { padding-left: 1.5rem; margin: 0.75em 0; }
        .prose li { margin-bottom: 0.4em; }
      `}</style>
    </>
  );
}
