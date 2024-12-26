import db from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
    const signature = (await headers()).get("stripe-signature");
    if (!signature) return new Response("Invalid signature.", { status: 400 });

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId } = session.metadata || { userId: '' };
    if(!userId) return new Response('No user id found', { status: 400 });

    await db.user.update({
      where: { id: userId },
      data: { plan: 'PRO' },
    })
    return new Response('Success', { status: 201 });
  } else {
    return new Response('Event not supported', { status: 400 });
  }
}
