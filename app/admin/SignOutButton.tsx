"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }
  return (
    <button onClick={signOut} style={{ width: "100%", padding: "0.6rem", background: "none", border: "1px solid rgba(245,244,240,0.1)", color: "rgba(245,244,240,0.35)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", marginTop: "1rem", transition: "border-color 0.2s, color 0.2s" }}>
      Sign out
    </button>
  );
}
