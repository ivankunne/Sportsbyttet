import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ListingDetail } from "./ListingDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("listings")
    .select("title, description, images, price, category, clubs(name)")
    .eq("id", Number(id))
    .single();

  if (!data) return {};

  const club = data.clubs as { name: string } | null;
  const firstImage = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null;
  const title = `${data.title} — ${data.price.toLocaleString("nb-NO")} kr`;
  const description = data.description
    ? data.description.slice(0, 150)
    : `${data.category} til salgs${club ? ` fra ${club.name}` : ""} på Sportsbytte.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(firstImage ? { images: [{ url: firstImage, width: 1200, height: 900 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(firstImage ? { images: [firstImage] } : {}),
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
