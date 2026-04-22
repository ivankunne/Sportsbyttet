import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Søk",
  description: "Søk etter utstyr, klubber og selgere på Sportsbytte.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
