"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type SoldItem = {
  id: number;
  title: string;
  price: number;
  category: string;
  updated_at: string;
};

const CATEGORY_EMOJI: Record<string, string> = {
  Alpint: "⛷️",
  Langrenn: "🎿",
  Fotball: "⚽",
  Ishockey: "🏒",
  Sykkel: "🚴",
  Håndball: "🤾",
  Topptur: "🏔️",
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "akkurat nå";
  if (diff < 3600) return `${Math.floor(diff / 60)} min siden`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} t siden`;
  return `${Math.floor(diff / 86400)} d siden`;
}

export function ActivityTicker() {
  const [items, setItems] = useState<SoldItem[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("listings")
      .select("id, title, price, category, updated_at")
      .eq("is_sold", true)
      .order("updated_at", { ascending: false })
      .limit(15)
      .then(({ data }) => setItems((data as SoldItem[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="bg-forest-light border-y border-forest-light overflow-hidden py-2.5">
      <div className="flex items-center gap-3 px-4 mb-0">
        <span className="shrink-0 text-xs font-semibold text-forest uppercase tracking-[0.08em]">
          Solgt nylig
        </span>
        <div className="flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-8 w-max animate-[ticker_40s_linear_infinite]"
          >
            {doubled.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-forest whitespace-nowrap">
                <span>{CATEGORY_EMOJI[item.category] ?? "🏅"}</span>
                <span className="font-medium">{item.title}</span>
                <span className="text-forest/60">solgt for</span>
                <span className="font-semibold">{item.price.toLocaleString("nb-NO")} kr</span>
                <span className="text-forest/50">· {timeAgo(item.updated_at)}</span>
                <span className="mx-2 text-forest/30">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
