import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { buildEmail, p, FROM, SITE_URL } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json() as { name: string; email: string };

  if (!name || !email) {
    return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
  }

  const html = buildEmail({
    heading: `Velkommen til Sportsbytte, ${name}!`,
    kicker: "Konto opprettet",
    body: `
      ${p(`Hei ${name},`)}
      ${p("Kontoen din er klar. Sportsbytte er Norges markedsplass for brukt sportsutstyr — organisert rundt idrettsklubbene dine.")}
      ${p("Her er hva du kan gjøre nå:")}
      <ul style="margin:0 0 20px;padding-left:20px;line-height:2;">
        <li>Finn og bli med i din idrettsklubb</li>
        <li>Utforsk brukt utstyr fra klubbmedlemmer</li>
        <li>Legg ut utstyr du ikke lenger bruker</li>
        <li>Betal trygt med Vipps og send med Bring</li>
      </ul>
    `,
    cta: { href: `${SITE_URL}/klubber`, label: "Finn din klubb" },
    footerNote: "Du mottar denne e-posten fordi du nettopp opprettet en konto på Sportsbytte.",
  });

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Velkommen til Sportsbytte, ${name}!`,
    html,
  });

  if (error) {
    console.error("notify-welcome Resend error:", error);
    // Non-blocking — signup succeeded even if email fails
  }

  return NextResponse.json({ ok: true });
}
