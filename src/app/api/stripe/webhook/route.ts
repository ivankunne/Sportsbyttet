import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

const admin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const listingId = Number(session.metadata?.listing_id);
      if (!listingId) break;

      // Mark listing as sold
      await admin.from("listings").update({ is_sold: true }).eq("id", listingId);

      // Increment seller's total_sold
      const { data: listing } = await admin
        .from("listings")
        .select("seller_id")
        .eq("id", listingId)
        .single();
      if (listing) {
        const { data: profile } = await admin
          .from("profiles")
          .select("total_sold")
          .eq("id", listing.seller_id)
          .single();
        if (profile) {
          await admin
            .from("profiles")
            .update({ total_sold: profile.total_sold + 1 })
            .eq("id", listing.seller_id);
        }
      }
      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      if (account.charges_enabled && account.details_submitted) {
        await admin
          .from("profiles")
          .update({ stripe_onboarding_complete: true })
          .eq("stripe_account_id", account.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
