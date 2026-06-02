import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate, readingTime, youtubeThumbnail } from "@/lib/utils";

const TYPE_LABEL: Record<Post["type"], string> = {
  article: "Article",
  link:    "Link",
  movie:   "Review",
  music:   "Music of Today",
  book:    "Book of the Month",
};

const TYPE_GLYPH: Record<Post["type"], string> = {
  article: "◈",
  link:    "↗",
  movie:   "★",
  music:   "♩",
  book:    "◉",
};

export default function PostCard({ post }: { post: Post }) {
  const href = post.type === "link" && post.link_url
    ? post.link_url
    : `/the-lab/${post.slug}`;
  const external = post.type === "link" && !!post.link_url;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="post-card"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg)",
        transition: "box-shadow 0.2s, transform 0.2s",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(17,17,17,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Image / thumbnail area */}
      {post.type === "music" && post.youtube_video_id && (
        <div style={{ position: "relative", paddingBottom: "56.25%", backgroundColor: "#111" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youtubeThumbnail(post.youtube_video_id)}
            alt={post.song_title ?? post.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "rgba(192,57,43,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#fff" }}>
              ▶
            </span>
          </div>
        </div>
      )}

      {post.type === "link" && post.og_image && (
        <div style={{ height: 160, overflow: "hidden", backgroundColor: "#eee" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.og_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {post.type === "book" && post.book_cover_url && (
        <div style={{ height: 200, overflow: "hidden", backgroundColor: "#f0eeea", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.book_cover_url} alt={post.title} style={{ height: "100%", objectFit: "contain" }} />
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Type badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--accent)", fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          }}>
            {TYPE_GLYPH[post.type]} {TYPE_LABEL[post.type]}
          </span>
          {post.type === "movie" && post.movie_rating && (
            <span style={{
              fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)",
              border: "1px solid var(--accent)", padding: "0.1rem 0.5rem",
            }}>
              {post.movie_rating}/10
            </span>
          )}
          {post.type === "link" && post.og_domain && (
            <span style={{ fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.06em" }}>
              {post.og_domain}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "1.1rem", fontWeight: 500, lineHeight: 1.3,
          color: "var(--ink)", margin: 0,
        }}>
          {post.type === "music"
            ? `${post.song_title ?? post.title}${post.artist ? ` — ${post.artist}` : ""}`
            : post.type === "movie"
            ? `${post.title}${post.movie_year ? ` (${post.movie_year})` : ""}`
            : post.og_title ?? post.title}
        </h3>

        {/* Excerpt / description */}
        {(post.excerpt || post.og_desc) && (
          <p style={{
            fontSize: "0.82rem", fontWeight: 300, lineHeight: 1.7,
            color: "var(--muted)", margin: 0,
            display: "-webkit-box", WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {post.excerpt ?? post.og_desc}
          </p>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "auto", paddingTop: "0.75rem",
          borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "0.62rem", letterSpacing: "0.08em", color: "var(--muted)" }}>
            {formatDate(post.created_at)}
          </span>
          {post.type === "article" && post.content && (
            <span style={{ fontSize: "0.62rem", color: "var(--muted)" }}>
              {readingTime(post.content)} min read
            </span>
          )}
          {post.type === "book" && post.book_amazon_url && (
            <span style={{ fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.08em" }}>
              Amazon ↗
            </span>
          )}
          {external && (
            <span style={{ fontSize: "0.62rem", color: "var(--accent)" }}>Open ↗</span>
          )}
        </div>
      </div>
    </a>
  );
}
