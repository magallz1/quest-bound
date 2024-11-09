import { dbClient, supabaseClient } from '@/database';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { UserRole } from '@/infrastructure/graphql';
import { addCreatorTag } from '../email/add-creator-tag';
import { subscribeToEmailList } from '../email/subscribe';
import { getCache } from '@/infrastructure/cache';

const mode = process.env.MODE;
const live_stripe_secret = process.env.STRIPE_SECRET;
const local_stripe_secret = process.env.LOCAL_STRIPE_SECRET;
const live_webhook_secret = process.env.STRIPE_WEBHOOK_SECRET;
const local_webhook_secret = process.env.LOCAL_STRIPE_WEBHOOK_SECRET;

const creatorMonthlySub =
  mode === 'local' ? 'price_1PGidQBuVgaXqHr9gPMAN31L' : process.env.CREATOR_MONTHLY_SUB;
const creatorAnnualSub =
  mode === 'local' ? 'price_1PGidjBuVgaXqHr9k0l1o5VB' : process.env.CREATOR_ANNUAL_SUB;

const STRIPE_SECRET = mode === 'local' ? local_stripe_secret : live_stripe_secret;
const WEBHOOK_SECRET = mode === 'local' ? local_webhook_secret : live_webhook_secret;

const stripe = require('stripe')(STRIPE_SECRET);

const DOMAIN = mode === 'local' ? 'http://localhost:5173' : 'https://questbound.com';

export const initializePaymentEndpoints = (app: Express) => {
  /**
   * Signs up a user for a free account
   */
  app.post('/signup', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).send({
        message: 'Email is required',
      });
    }

    const db = dbClient();
    const supabase = supabaseClient();

    try {
      const existingUser = await db.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });

      if (existingUser) {
        res.status(409).send({
          message: 'User already exists',
        });
        return;
      }

      // Attempt to create new auth user. If user already exists in auth, this will simply return a null user.
      const { data } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        email_confirm: true,
        password: uuid(), // Not used. Create UUID so it's not predictable
      });

      // Auth user was just created, create a new user in DB
      if (data.user !== null) {
        const customer = await stripe.customers.create({
          email: email.toLowerCase(),
        });

        // Add custom to free subscription

        await db.user.create({
          data: {
            id: data.user.id,
            authId: data.user.id,
            email: email.toLowerCase(),
            username: email.split('@')[0] + Math.floor(Math.random() * 1000),
            role: UserRole.PUBLISHER,
            stripeId: customer.id,
            metadata: {
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            },
            preferences: {
              emailUnsubscribe: false,
              emailUpdates: false,
              emailShares: true,
            },
          },
        });
      }

      await subscribeToEmailList({ email: email.toLowerCase() });

      res.status(200).send({
        message: 'User created',
      });
    } catch (e) {
      res.status(500).send({
        message: 'An error occurred. Please try again or contact support@questbound.com',
      });
    }
  });

  /**
   * Builds the checkout page and returns the URL
   */
  app.post('/checkout', async (req, res) => {
    const { email, isAnnual } = req.body;

    if (!email) {
      res.status(400).send({
        message: 'Email is required',
      });
    }

    const db = dbClient();

    try {
      const existingUser = await db.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });

      if (!existingUser) {
        res.status(403).send({
          message:
            'There must be a free user account with this email before creating a subscription.',
        });
        return;
      }

      let stripeId = existingUser.stripeId;

      if (!stripeId) {
        const res = await stripe.customers.create({
          email: existingUser.email,
        });

        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            stripeId: res.id,
          },
        });

        stripeId = res.id;
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: isAnnual ? creatorAnnualSub : creatorMonthlySub,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer: stripeId,
        success_url: DOMAIN,
        cancel_url: DOMAIN,
        allow_promotion_codes: true,
      });

      res.send({
        url: session.url,
      });
    } catch (error: any) {
      console.log(error.message);
      res.status(500).send({
        message: 'An error occurred',
      });
    }
  });

  app.post('/manage', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).send({
        message: 'Email is required',
      });
    }

    const db = dbClient();

    try {
      const existingUser = await db.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });

      if (!existingUser) {
        res.status(403).send({
          message:
            'There must be a free user account with this email before managing a subscription.',
        });
        return;
      }

      let stripeId = existingUser.stripeId;

      if (!stripeId) {
        const res = await stripe.customers.create({
          email: existingUser.email,
        });

        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            stripeId: res.id,
          },
        });

        stripeId = res.id;
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeId,
        return_url: DOMAIN,
      });

      res.send({
        url: session.url,
      });
    } catch (error: any) {
      console.log(error.message);
      res.status(500).send({
        message: 'An error occurred',
      });
    }
  });

  /**
   * On Successful payment, create a license key
   *
   * When running locally, webhook events need to be forwarded from the Stripe CLI
   * npm run forwardWebhook
   */
  app.post('/payment-webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const db = dbClient();
    const cache = getCache();

    try {
      const membershipExpiration = event.data.object.current_period_end;
      const stripeId = event.data.object.customer;

      // Update user role and add creator flag to email member
      const user = await db.user.findFirst({
        where: {
          stripeId: {
            equals: stripeId,
          },
        },
      });

      // Handle the event
      switch (event.type) {
        case 'customer.subscription.updated':
          if (user) {
            await db.user.update({
              where: {
                id: user?.id,
              },
              data: {
                stripeId,
                role: UserRole.CREATOR,
                membershipExpiration: new Date(membershipExpiration * 1000).toISOString(),
              },
            });
            await addCreatorTag({ email: user.email });
            cache.del(user.id);
          }
      }
    } catch (e: any) {
      // Swallow
      console.log('payment webhook: ', e.message);
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  });
};
