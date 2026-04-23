import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrer din klubb på Sportsbytte",
  description: "Gi klubbmedlemmene din en egen markedsplass for brukt sportsutstyr. Gratis oppstart, klar på minutter.",
  openGraph: {
    title: "Registrer din klubb på Sportsbytte",
    description: "Gi klubbmedlemmene din en egen markedsplass for brukt sportsutstyr. Gratis oppstart, klar på minutter.",
    siteName: "Sportsbytte",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Registrer din klubb på Sportsbytte",
    description: "Gi klubbmedlemmene din en egen markedsplass for brukt sportsutstyr. Gratis oppstart, klar på minutter.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
