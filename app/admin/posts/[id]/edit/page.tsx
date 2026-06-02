import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import PostForm from "@/components/lab/PostForm";
import type { Post } from "@/lib/types";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();
  const { data } = await db.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 500, color: "var(--ink)", marginBottom: "2rem" }}>
        Edit Post
      </h1>
      <PostForm existing={data as Post} />
    </div>
  );
}
