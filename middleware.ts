import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// mailto: and tel: shortlinks (next.config redirects only support http/https)
const PROTOCOL_SHORTLINKS: Record<string, string> = {
  "/email":   "mailto:sayandeepgiri14@gmail.com",
  "/mail":    "mailto:sayandeepgiri14@gmail.com",
  "/gmail":   "mailto:sayandeepgiri14@gmail.com",
  "/hotmail": "mailto:neel.ju14@hotmail.com",
  "/phone":   "tel:+919748281590",
  "/call":    "tel:+919748281590",
  "/phone2":  "tel:+918250247128",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Resolve mailto/tel shortlinks before any auth logic
  const proto = PROTOCOL_SHORTLINKS[pathname];
  if (proto) return NextResponse.redirect(proto);

  // If Supabase env vars aren't configured yet, just protect /admin routes
  // without crashing the rest of the site
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginPage  = pathname === "/admin/login";
    if (isAdminRoute && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage  = pathname === "/admin/login";
  const adminEmail   = process.env.ADMIN_EMAIL ?? "";

  if (isAdminRoute && !isLoginPage) {
    if (!user || user.email !== adminEmail) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isLoginPage && user?.email === adminEmail) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
