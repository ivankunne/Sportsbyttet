type Props = {
  condition: string;
  size?: "sm" | "md";
};

const conditionStyles: Record<string, string> = {
  "Som ny": "bg-emerald-100 text-emerald-800",
  "Pent brukt": "bg-blue-100 text-blue-800",
  "Godt brukt": "bg-amber-100 text-amber-800",
  "Mye brukt": "bg-gray-100 text-gray-700",
};

export function ConditionBadge({ condition, size = "sm" }: Props) {
  const style = conditionStyles[condition] ?? "bg-gray-100 text-gray-700";
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span className={`inline-block rounded-full font-medium ${style} ${sizeClass}`}>
      {condition}
    </span>
  );
}
