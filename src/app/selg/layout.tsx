import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selg utstyr",
  description: "Legg ut ditt brukte sportsutstyr for salg på Sportsbytte. Nå hundrevis av sportsentusiaster i din klubb.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
