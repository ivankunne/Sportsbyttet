import { supabase } from "./supabase";
import type { Tables } from "./database.types";

// Re-export row types for convenience
export type Club = Tables<"clubs">;
export type Profile = Tables<"profiles">;
export type Listing = Tables<"listings">;
export type Category = Tables<"categories">;
export type Review = Tables<"reviews">;

// Listing with joined club and seller data
export type ListingWithRelations = Listing & {
  clubs: Club;
  profiles: Profile;
};

// Profile with joined club
export type ProfileWithClub = Profile & {
  clubs: Club | null;
};

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function formatDaysAgo(dateStr: string): string {
  const d = daysAgo(dateStr);
  if (d === 0) return "I dag";
  if (d === 1) return "1 dag siden";
  return `${d} dager siden`;
}

// Helper to get the first image as a thumbnail (400x300)
export function thumbnailUrl(listing: Listing): string {
  const img = listing.images?.[0];
  if (!img) return "https://picsum.photos/seed/default/400/300";
  return img.replace(/\/\d+\/\d+$/, "/400/300");
}

// ─── Clubs ──────────────────────────────────────────────

export async function getAllClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("members", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// ─── Categories ─────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");
  if (error) throw error;
  return data;
}

// ─── Listings ───────────────────────────────────────────

export async function getFeaturedListings(
  limit = 6
): Promise<ListingWithRelations[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, clubs(*), profiles(*)")
    .eq("is_sold", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as ListingWithRelations[];
}

export async function getAllListings(): Promise<ListingWithRelations[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, clubs(*), profiles(*)")
    .eq("is_sold", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ListingWithRelations[];
}

export async function getListingsByClub(
  clubId: number
): Promise<ListingWithRelations[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, clubs(*), profiles(*)")
    .eq("club_id", clubId)
    .eq("is_sold", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ListingWithRelations[];
}

export async function getListingById(
  id: number
): Promise<ListingWithRelations | null> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, clubs(*), profiles(*)")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data as ListingWithRelations | null;
}

export async function getListingsBySeller(
  sellerId: number,
  excludeId?: number
): Promise<ListingWithRelations[]> {
  let query = supabase
    .from("listings")
    .select("*, clubs(*), profiles(*)")
    .eq("seller_id", sellerId)
    .eq("is_sold", false)
    .order("created_at", { ascending: false });

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw error;
  return data as ListingWithRelations[];
}

// ─── Profiles ───────────────────────────────────────────

export async function getProfileBySlug(
  slug: string
): Promise<ProfileWithClub | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, clubs(*)")
    .eq("slug", slug)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data as ProfileWithClub | null;
}

export async function getProfilesByClub(
  clubId: number
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("club_id", clubId)
    .order("total_sold", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data;
}

export async function getAllProfileSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("slug");
  if (error) throw error;
  return data.map((p) => p.slug);
}

// ─── Reviews ────────────────────────────────────────────

export async function getReviewsByProfile(
  profileId: number
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Search ─────────────────────────────────────────────

export type SearchResults = {
  listings: ListingWithRelations[];
  clubs: Club[];
  profiles: ProfileWithClub[];
  categories: Category[];
};

export async function searchAll(query: string): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return { listings: [], clubs: [], profiles: [], categories: [] };

  const pattern = `%${q}%`;

  const [listingsRes, clubsRes, profilesRes, categoriesRes] =
    await Promise.all([
      supabase
        .from("listings")
        .select("*, clubs(*), profiles(*)")
        .eq("is_sold", false)
        .or(`title.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("clubs")
        .select("*")
        .ilike("name", pattern)
        .order("members", { ascending: false })
        .limit(10),
      supabase
        .from("profiles")
        .select("*, clubs(*)")
        .or(`name.ilike.${pattern},bio.ilike.${pattern}`)
        .order("total_sold", { ascending: false })
        .limit(10),
      supabase
        .from("categories")
        .select("*")
        .ilike("name", pattern)
        .limit(6),
    ]);

  return {
    listings: (listingsRes.data ?? []) as ListingWithRelations[],
    clubs: clubsRes.data ?? [],
    profiles: (profilesRes.data ?? []) as ProfileWithClub[],
    categories: categoriesRes.data ?? [],
  };
}

export async function searchListings(
  query?: string,
  category?: string,
  sort?: string,
  clubId?: number
): Promise<ListingWithRelations[]> {
  let q = supabase
    .from("listings")
    .select("*, clubs(*), profiles(*)")
    .eq("is_sold", false);

  if (clubId) q = q.eq("club_id", clubId);

  if (query?.trim()) {
    const pattern = `%${query.trim()}%`;
    q = q.or(`title.ilike.${pattern},description.ilike.${pattern}`);
  }

  if (category) q = q.ilike("category", `%${category}%`);

  switch (sort) {
    case "pris-lav":
      q = q.order("price", { ascending: true });
      break;
    case "pris-hoy":
      q = q.order("price", { ascending: false });
      break;
    default:
      q = q.order("created_at", { ascending: false });
  }

  const { data, error } = await q;
  if (error) throw error;
  return data as ListingWithRelations[];
}
