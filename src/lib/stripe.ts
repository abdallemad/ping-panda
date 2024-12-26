import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const createCheckoutSession = async ({
  userEmail,
  userId,
}: {
  userEmail: string;
  userId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    customer_email: userEmail,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: "price_1QZpF0E37wuSETWV7otY8sEX",
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
  });
  return session
};
