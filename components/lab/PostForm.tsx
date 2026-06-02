"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/posts";
import { fetchOG } from "@/app/actions/og";
import { slugify, extractYouTubeId } from "@/lib/utils";
import type { Post, PostType } from "@/lib/types";

const PostEditor = dynamic(() => import("./PostEditor"), { ssr: false });

type PostDraft = Partial<Omit<Post, "id" | "created_at" | "updated_at">>;

const TYPES: { value: PostType; label: string; glyph: string }[] = [
  { value: "article", label: "Article",          glyph: "◈" },
  { value: "link",    label: "Link / Blog",       glyph: "↗" },
  { value: "movie",   label: "Movie Review",      glyph: "★" },
  { value: "music",   label: "Music of Today",    glyph: "♩" },
  { value: "book",    label: "Book of the Month", glyph: "◉" },
];

const field: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.85rem",
  border: "1px solid var(--border)", background: "var(--bg)",
  color: "var(--ink)", fontSize: "0.875rem",
  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
  outline: "none",
};
const label: React.CSSProperties = {
  display: "block", fontSize: "0.62rem", letterSpacing: "0.14em",
  textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.35rem",
};

export default function PostForm({ existing }: { existing?: Post }) {
  const router  = useRouter();
  const [pend, start] = useTransition();
  const [err, setErr] = useState("");

  const [draft, setDraft] = useState<PostDraft>(() => existing
    ? { ...existing }
    : { type: "article", title: "", slug: "", tags: [], published: false, content: "" }
  );

  const set = <K extends keyof PostDraft>(k: K, v: PostDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const [ogFetching, setOgFetching] = useState(false);

  function handleTitle(v: string) {
    set("title", v);
    if (!existing) set("slug", slugify(v));
  }

  async function handleFetchOG() {
    if (!draft.link_url) return;
    setOgFetching(true);
    try {
      const og = await fetchOG(draft.link_url);
      setDraft((d) => ({
        ...d,
        og_title: og.title ?? d.og_title,
        og_desc:  og.description ?? d.og_desc,
        og_image: og.image ?? d.og_image,
        og_domain: og.domain,
        title: d.title || og.title || d.title || "",
        slug:  d.slug  || slugify(og.title ?? ""),
      }));
    } finally { setOgFetching(false); }
  }

  function handleYouTubeUrl(url: string) {
    set("youtube_url", url);
    const id = extractYouTubeId(url);
    if (id) set("youtube_video_id", id);
  }

  async function handleSubmit(publish: boolean) {
    setErr("");
    if (!draft.title || !draft.slug || !draft.type) { setErr("Title and slug are required."); return; }
    const data = {
      type:      draft.type!,
      title:     draft.title!,
      slug:      draft.slug!,
      content:   draft.content,
      excerpt:   draft.excerpt,
      link_url:  draft.link_url,
      og_title:  draft.og_title,
      og_desc:   draft.og_desc,
      og_image:  draft.og_image,
      og_domain: draft.og_domain,
      youtube_url:      draft.youtube_url,
      youtube_video_id: draft.youtube_video_id,
      artist:           draft.artist,
      song_title:       draft.song_title,
      book_author:      draft.book_author,
      book_amazon_url:  draft.book_amazon_url,
      book_cover_url:   draft.book_cover_url,
      movie_year:       draft.movie_year,
      movie_rating:     draft.movie_rating,
      movie_genre:      draft.movie_genre,
      tags:      draft.tags ?? [],
      published: publish,
    };

    start(async () => {
      try {
        if (existing) await updatePost(existing.id, data);
        else await createPost(data);
        router.push("/admin/posts");
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  const t = draft.type!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Type selector */}
      <div>
        <p style={label}>Post type</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {TYPES.map(({ value, label: lbl, glyph }) => (
            <button
              key={value} type="button"
              onClick={() => set("type", value)}
              style={{
                padding: "0.45rem 1rem", border: "1px solid",
                borderColor: t === value ? "var(--accent)" : "var(--border)",
                background: t === value ? "var(--accent)" : "transparent",
                color: t === value ? "#fff" : "var(--ink)",
                fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer",
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
              }}
            >
              {glyph} {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Common fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <p style={label}>Title *</p>
          <input style={field} value={draft.title ?? ""} onChange={(e) => handleTitle(e.target.value)} placeholder="Post title" />
        </div>
        <div>
          <p style={label}>Slug *</p>
          <input style={field} value={draft.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="url-friendly-slug" />
        </div>
      </div>

      <div>
        <p style={label}>Excerpt (shown on card)</p>
        <textarea style={{ ...field, resize: "vertical" }} rows={2} value={draft.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short description shown on the card..." />
      </div>

      {/* ── Article ── */}
      {t === "article" && (
        <div>
          <p style={label}>Content</p>
          <PostEditor content={draft.content ?? ""} onChange={(html) => set("content", html)} />
        </div>
      )}

      {/* ── Link ── */}
      {t === "link" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input style={{ ...field, flex: 1 }} value={draft.link_url ?? ""} onChange={(e) => set("link_url", e.target.value)} placeholder="https://hashnode.com/your-post" />
            <button type="button" onClick={handleFetchOG} disabled={ogFetching}
              style={{ padding: "0 1.25rem", border: "1px solid var(--accent)", background: "var(--accent)", color: "#fff", cursor: "pointer", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
              {ogFetching ? "Fetching…" : "Fetch preview"}
            </button>
          </div>
          {draft.og_image && (
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1rem", border: "1px solid var(--border)", background: "#faf9f6" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={draft.og_image} alt="" style={{ width: 120, height: 80, objectFit: "cover", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.3rem" }}>{draft.og_title}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 300, lineHeight: 1.5 }}>{draft.og_desc}</p>
                <p style={{ fontSize: "0.65rem", color: "var(--accent)", marginTop: "0.3rem" }}>{draft.og_domain}</p>
              </div>
            </div>
          )}
          <input style={field} value={draft.og_title ?? ""} onChange={(e) => set("og_title", e.target.value)} placeholder="Override OG title (optional)" />
          <input style={field} value={draft.og_image ?? ""} onChange={(e) => set("og_image", e.target.value)} placeholder="OG image URL (auto-fetched)" />
        </div>
      )}

      {/* ── Music ── */}
      {t === "music" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <p style={label}>YouTube URL</p>
            <input style={field} value={draft.youtube_url ?? ""} onChange={(e) => handleYouTubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            {draft.youtube_video_id && (
              <p style={{ marginTop: "0.35rem", fontSize: "0.68rem", color: "var(--accent)" }}>Video ID: {draft.youtube_video_id} ✓</p>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={label}>Song title</p>
              <input style={field} value={draft.song_title ?? ""} onChange={(e) => set("song_title", e.target.value)} placeholder="Song name" />
            </div>
            <div>
              <p style={label}>Artist</p>
              <input style={field} value={draft.artist ?? ""} onChange={(e) => set("artist", e.target.value)} placeholder="Artist / band name" />
            </div>
          </div>
        </div>
      )}

      {/* ── Book ── */}
      {t === "book" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <p style={label}>Author</p>
            <input style={field} value={draft.book_author ?? ""} onChange={(e) => set("book_author", e.target.value)} placeholder="Author name" />
          </div>
          <div>
            <p style={label}>Amazon link</p>
            <input style={field} value={draft.book_amazon_url ?? ""} onChange={(e) => set("book_amazon_url", e.target.value)} placeholder="https://amazon.in/..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={label}>Book cover image URL</p>
            <input style={field} value={draft.book_cover_url ?? ""} onChange={(e) => set("book_cover_url", e.target.value)} placeholder="https://..." />
          </div>
        </div>
      )}

      {/* ── Movie ── */}
      {t === "movie" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <p style={label}>Year</p>
            <input type="number" style={field} value={draft.movie_year ?? ""} onChange={(e) => set("movie_year", Number(e.target.value))} placeholder="2024" />
          </div>
          <div>
            <p style={label}>Rating (1–10)</p>
            <input type="number" min={1} max={10} style={field} value={draft.movie_rating ?? ""} onChange={(e) => set("movie_rating", Number(e.target.value))} placeholder="8" />
          </div>
          <div>
            <p style={label}>Genre</p>
            <input style={field} value={draft.movie_genre ?? ""} onChange={(e) => set("movie_genre", e.target.value)} placeholder="Drama, Sci-fi…" />
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <p style={label}>Tags (comma-separated)</p>
        <input
          style={field}
          value={(draft.tags ?? []).join(", ")}
          onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          placeholder="music, kolkata, thoughts"
        />
      </div>

      {err && <p style={{ color: "var(--accent)", fontSize: "0.82rem" }}>{err}</p>}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
        <button type="button" disabled={pend} onClick={() => handleSubmit(false)}
          style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--border)", background: "transparent", color: "var(--ink)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: pend ? "not-allowed" : "pointer" }}>
          Save draft
        </button>
        <button type="button" disabled={pend} onClick={() => handleSubmit(true)}
          style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--accent)", background: "var(--accent)", color: "#fff", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: pend ? "not-allowed" : "pointer" }}>
          {pend ? "Saving…" : "Publish"}
        </button>
        <button type="button" onClick={() => router.push("/admin/posts")}
          style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", marginLeft: "auto" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
