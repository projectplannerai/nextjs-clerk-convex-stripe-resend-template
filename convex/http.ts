import { httpRouter } from 'convex/server';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';
import { formatName } from './util';

const http = httpRouter();

http.route({
  path: '/stripe',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const signature: string = request.headers.get('stripe-signature') as string;

    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response('Webhook Error', {
        status: 400,
      });
    }
  }),
});

http.route({
  path: '/stripe/authorize',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const signature: string = request.headers.get('stripe-signature') as string;

    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response('Webhook Error', {
        status: 400,
      });
    }
  }),
});

http.route({
  path: '/clerk',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          'svix-id': headerPayload.get('svix-id')!,
          'svix-timestamp': headerPayload.get('svix-timestamp')!,
          'svix-signature': headerPayload.get('svix-signature')!,
        },
      });

      switch (result.type) {
        case 'user.created':
          await ctx.runMutation(internal.users.createUser, {
            userId: result.data.id,
            email: result.data.email_addresses[0]?.email_address,
            name: formatName(result.data.first_name, result.data.last_name),
            profileImage: result.data.image_url,
            onboardingCompleted: false,
          });
          break;
        case 'user.updated':
          await ctx.runMutation(internal.users.updateUser, {
            userId: result.data.id,
            profileImage: result.data.image_url,
          });
          break;
        case 'user.deleted':
          await ctx.runMutation(internal.users.deleteUser, {
            userId: result.data.id!,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new Response('Webhook Error', {
        status: 400,
      });
    }
  }),
});

export default http;
