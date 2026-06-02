"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Post } from "@/lib/types";

type PostInput = Omit<Post, "id" | "created_at" | "updated_at">;

export async function createPost(data: PostInput) {
  const db = createAdminClient();
  const { error } = await db.from("posts").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/the-lab");
  revalidatePath("/admin/posts");
}

export async function updatePost(id: string, data: Partial<PostInput>) {
  const db = createAdminClient();
  const { error } = await db.from("posts").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/the-lab");
  revalidatePath(`/the-lab/${data.slug ?? ""}`);
  revalidatePath("/admin/posts");
}

export async function deletePost(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/the-lab");
  revalidatePath("/admin/posts");
}

export async function togglePublish(id: string, published: boolean) {
  const db = createAdminClient();
  const { error } = await db.from("posts").update({ published }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/the-lab");
  revalidatePath("/admin/posts");
}
