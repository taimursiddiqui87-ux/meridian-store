# MERIDIAN — Phase 2 Setup (payments, login, emails)

The code is fully built. To switch it on you need **three free accounts** and their keys.
Only you can create these — your keys never get committed (`.env` is gitignored).

Total time: ~15 minutes.

---

## What you'll set up

| Service | Purpose | Free? |
|---------|---------|-------|
| **Neon** | Postgres database (users + orders) | Yes |
| **Stripe** | Card payments (test mode = no real charges) | Yes |
| **Resend** | Order-confirmation emails | Yes |

Copy `.env.example` to `.env` first, then fill it in as you go:

```bash
cp .env.example .env
```

---

## 1 · Database — Neon (Postgres)

1. Go to **https://neon.tech** and sign up (free, no card).
2. Create a project → it gives you a **connection string** that looks like:
   `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`
3. Paste it into `.env` as `DATABASE_URL`.
4. Create the tables:
   ```bash
   npm run db:push
   ```
   You should see "Your database is now in sync with your Prisma schema."

## 2 · Auth secret

Generate a random signing key for login sessions:

```bash
# macOS/Linux/Git Bash
openssl rand -base64 32
# …or with Node (any OS)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Paste the result into `.env` as `AUTH_SECRET`.

## 3 · Payments — Stripe (test mode)

1. Sign up at **https://stripe.com** (stay in **Test mode** — toggle top-right).
2. **https://dashboard.stripe.com/test/apikeys** → copy:
   - **Secret key** (`sk_test_…`) → `.env` `STRIPE_SECRET_KEY`
   - **Publishable key** (`pk_test_…`) → `.env` `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. **Webhook** (this is how paid orders + emails get confirmed):
   - **Local testing** — install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:
     ```bash
     stripe login
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
     It prints a `whsec_…` secret → `.env` `STRIPE_WEBHOOK_SECRET`. Keep it running while you test.
   - **Production** — Dashboard → Developers → Webhooks → *Add endpoint*:
     URL `https://<your-domain>/api/webhooks/stripe`, event `checkout.session.completed`.
     Copy its `whsec_…` into your **Vercel** env vars.

## 4 · Emails — Resend

1. Sign up at **https://resend.com**.
2. **https://resend.com/api-keys** → create a key (`re_…`) → `.env` `RESEND_API_KEY`.
3. For testing, leave `EMAIL_FROM="MERIDIAN <onboarding@resend.dev>"`.
   To send from your own domain later, verify it in Resend and update `EMAIL_FROM`.

---

## Run it locally

```bash
npm run dev
```

Then test the full flow:
1. **Sign up** at `/account/signup` → you land on your account dashboard.
2. Add a watch to the cart → **Checkout** → you're sent to Stripe.
3. Pay with the test card **`4242 4242 4242 4242`**, any future expiry, any CVC, any ZIP.
4. You're returned to the **confirmation page**, the order shows in **/account/orders**, and a
   confirmation **email** arrives (check the Resend dashboard's "Emails" log too).

> Tip: `npm run db:studio` opens a visual browser of your database (users, orders).

---

## Deploy to production (Vercel)

1. In **Vercel → your project → Settings → Environment Variables**, add every key from your `.env`
   (`DATABASE_URL`, `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`) and set
   `NEXT_PUBLIC_APP_URL` to your live URL.
2. Add the **production** Stripe webhook (step 3) pointing at your live domain.
3. Redeploy (any `git push`, or "Redeploy" in the Vercel dashboard).

## Going live for real money

When you're ready to accept real payments: complete Stripe business verification, then swap the
`sk_test_…` / `pk_test_…` keys for the **live** ones and re-create the webhook in live mode.
