"use server";

export interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
  domain: string;
}

export async function fetchOG(url: string): Promise<OGData> {
  const domain = new URL(url).hostname.replace("www.", "");
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
      next: { revalidate: 86400 },
    });
    const html = await res.text();

    const get = (prop: string) => {
      const r1 = new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']+)["']`, "i");
      const r2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${prop}["']`, "i");
      const r3 = new RegExp(`<meta[^>]*name=["']${prop.replace("og:", "")}["'][^>]*content=["']([^"']+)["']`, "i");
      return (html.match(r1) || html.match(r2) || html.match(r3))?.[1] ?? null;
    };

    return {
      title:       get("og:title")       ?? get("twitter:title"),
      description: get("og:description") ?? get("twitter:description"),
      image:       get("og:image")       ?? get("twitter:image"),
      domain,
    };
  } catch {
    return { title: null, description: null, image: null, domain };
  }
}
