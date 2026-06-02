import { createAdminClient } from "@/lib/supabase/admin";
import { togglePublish, deletePost } from "@/app/actions/posts";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Post } from "@/lib/types";

export default async function AdminPosts() {
  const db = createAdminClient();
  const { data } = await db.from("posts").select("*").order("created_at", { ascending: false });
  const posts = (data ?? []) as Post[];

  const TYPE_COLOR: Record<string, string> = {
    article: "#2d6a4f", link: "#1d3557", movie: "#7b2d8b", music: "#c0392b", book: "#b07d35",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 500, color: "var(--ink)" }}>Posts</h1>
        <Link href="/admin/posts/new" style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--accent)", color: "#fff", textDecoration: "none", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No posts yet. Create your first one!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {posts.map((post) => (
            <div key={post.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid var(--border)", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                <span style={{ fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.15rem 0.5rem", backgroundColor: TYPE_COLOR[post.type] ?? "#666", color: "#fff", whiteSpace: "nowrap" }}>
                  {post.type}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: "0.88rem", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</p>
                  <p style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.15rem" }}>{formatDate(post.created_at)} · /{post.slug}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <span style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: post.published ? "var(--accent)" : "var(--muted)", border: `1px solid ${post.published ? "var(--accent)" : "var(--border)"}`, padding: "0.18rem 0.55rem" }}>
                  {post.published ? "Live" : "Draft"}
                </span>
                <form action={async () => { "use server"; await togglePublish(post.id, !post.published); }}>
                  <button type="submit" style={{ fontSize: "0.65rem", background: "none", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.22rem 0.6rem", cursor: "pointer" }}>
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <Link href={`/admin/posts/${post.id}/edit`} style={{ fontSize: "0.65rem", color: "var(--ink)", textDecoration: "none", border: "1px solid var(--border)", padding: "0.22rem 0.6rem" }}>
                  Edit
                </Link>
                <form action={async () => { "use server"; await deletePost(post.id); }}>
                  <button type="submit" style={{ fontSize: "0.65rem", background: "none", border: "1px solid var(--border)", color: "var(--accent)", padding: "0.22rem 0.6rem", cursor: "pointer" }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
