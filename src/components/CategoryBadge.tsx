type Props = {
  category: string;
};

const categoryStyles: Record<string, string> = {
  Alpint: "bg-forest/90 text-white",
  "Alpint & Topptur": "bg-forest/90 text-white",
  Klatring: "bg-amber-700/90 text-white",
  Sykkel: "bg-blue-700/90 text-white",
  "Løping & Ski": "bg-purple-700/90 text-white",
  Friluftsliv: "bg-emerald-700/90 text-white",
  Treningsklær: "bg-rose-700/90 text-white",
};

export function CategoryBadge({ category }: Props) {
  const style = categoryStyles[category] ?? "bg-gray-700/90 text-white";

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {category}
    </span>
  );
}
