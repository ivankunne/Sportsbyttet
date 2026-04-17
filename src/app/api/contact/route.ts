import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Manglende felt." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Sportsbyttet <onboarding@resend.dev>",
    to: "ivan@frameflow.no",
    replyTo: email,
    subject: subject ? `Kontaktskjema: ${subject}` : `Kontaktskjema fra ${name}`,
    html: `
      <p><strong>Fra:</strong> ${name} (${email})</p>
      ${subject ? `<p><strong>Emne:</strong> ${subject}</p>` : ""}
      <p><strong>Melding:</strong></p>
      <p style="white-space:pre-wrap">${message}</p>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
