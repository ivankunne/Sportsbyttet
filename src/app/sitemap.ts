import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://sportsbytte.no";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE_URL}/utforsk`, priority: 0.9, changeFrequency: "hourly" },
    { url: `${BASE_URL}/selg`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/klubber`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/for-klubber`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/for-lagledere`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/priser`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/om-oss`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/kontakt`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/personvern`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/vilkar`, priority: 0.3, changeFrequency: "yearly" },
  ];

  const [listingsRes, profilesRes, clubsRes] = await Promise.all([
    supabase
      .from("listings")
      .select("id, updated_at")
      .eq("is_sold", false)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("slug, updated_at"),
    supabase.from("clubs").select("slug, updated_at"),
  ]);

  const listingRoutes: MetadataRoute.Sitemap = (listingsRes.data ?? []).map((l) => ({
    url: `${BASE_URL}/annonse/${l.id}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : undefined,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const profileRoutes: MetadataRoute.Sitemap = (profilesRes.data ?? []).map((p) => ({
    url: `${BASE_URL}/profil/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const clubRoutes: MetadataRoute.Sitemap = (clubsRes.data ?? []).map((c) => ({
    url: `${BASE_URL}/klubb/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...listingRoutes, ...profileRoutes, ...clubRoutes];
}
