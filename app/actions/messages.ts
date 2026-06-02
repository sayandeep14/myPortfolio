"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

interface MessageInput {
  is_anonymous: boolean;
  name?: string;
  email?: string;
  hint?: string;
  message: string;
}

export async function sendMessage(data: MessageInput) {
  const db = createAdminClient();
  const { error } = await db.from("messages").insert(data);
  if (error) throw new Error(error.message);

  // Email notification — instantiate lazily so build doesn't fail without the key
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from    = data.is_anonymous ? "Anonymous" : `${data.name} <${data.email}>`;
  const hintStr = data.hint ? `\nHint: ${data.hint}` : "";
  const body    = `${from}${hintStr}\n\n${data.message}`;

  await resend.emails.send({
    from:    "The Lab <onboarding@resend.dev>",
    to:      process.env.ADMIN_EMAIL!,
    subject: data.is_anonymous ? "Anonymous message from The Lab" : `Message from ${data.name}`,
    text:    body,
  });
}

export async function markRead(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("messages").update({ read: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
