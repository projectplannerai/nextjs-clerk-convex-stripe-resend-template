'use node';

import { ConvexError, v } from 'convex/values';
import Stripe from 'stripe';

import { internal } from './_generated/api';
import { action, internalAction } from './_generated/server';

type Metadata = {
  userId: string;
};

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2024-04-10',
});

export const checkout = action({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    console.log(user);
    if (!user) {
      throw new ConvexError('you must be logged in to subscribe');
    }

    if (!user.emailVerified) {
      throw new ConvexError('you must have a verified email to subscribe');
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: process.env.SUBSCRIPTION_PRICE_ID!, quantity: 1 }],
      customer_email: user.email,
      metadata: {
        userId: user.subject,
      },
      mode: 'subscription',
      success_url: `${process.env.HOST_NAME}/success`,
      cancel_url: `${process.env.HOST_NAME}`,
    });

    return session;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET!;
    try {
      const event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret,
      );

      console.log(event);

      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string,
        );

        const userId = completedEvent.metadata.userId;

        console.log({
          type: event.type,
          userId,
        });

        await ctx.runMutation(internal.users.updateSubscription, {
          userId,
          subscriptionId: subscription.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string,
        );

        const subscriptionId = subscription.items.data[0]?.price.id;

        console.log({
          type: event.type,
          subscriptionId,
        });

        await ctx.runMutation(internal.users.updateSubscriptionBySubId, {
          subscriptionId,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
