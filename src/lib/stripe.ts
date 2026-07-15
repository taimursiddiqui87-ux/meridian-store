import Stripe from "stripe";

// Null when STRIPE_SECRET_KEY isn't set yet — callers degrade gracefully.
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
