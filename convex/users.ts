import { ConvexError, v } from 'convex/values';

import { api, internal } from './_generated/api';
import { Doc, Id } from './_generated/dataModel';
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server';
import { getUserId } from './util';

export const updateUser = internalMutation({
  args: {
    userId: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    let user = await getUserByUserId(ctx, args.userId);

    if (!user) {
      throw new ConvexError('user with id not found');
    }

    await ctx.db.patch(user._id, {
      profileImage: args.profileImage,
    });
  },
});

export const createUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    profileImage: v.string(),
    onboardingCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!user) {
      await ctx.db.insert('users', {
        name: args.name,
        userId: args.userId,
        email: args.email,
        profileImage: args.profileImage,
        onboardingCompleted: args.onboardingCompleted,
      });
    }
  },
});

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

export const getUserMetadata = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!user) {
      return null;
    }

    return {
      profileImage: user?.profileImage,
      name: user.name,
    };
  },
});

export const getMyUser = query({
  args: {},
  async handler(ctx) {
    const userId = await getUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!user) {
      return null;
    }

    return user;
  },
});

export const updateMyUser = mutation({
  args: { name: v.string() },
  async handler(ctx, args) {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new ConvexError('You must be logged in.');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!user) {
      throw new ConvexError('user not found');
    }

    await ctx.db.patch(user._id, {
      name: args.name,
    });
  },
});

export const getUserByIdInternal = internalQuery({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    return user;
  },
});

export const deleteUser = internalMutation({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await getUserByUserId(ctx, args.userId);
    if (!user) {
      throw new ConvexError('could not find user');
    }
    await ctx.db.delete(user._id);
  },
});

export const getUserByUserId = (
  ctx: MutationCtx | QueryCtx,
  userId: string,
) => {
  return ctx.db
    .query('users')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .first();
};

export const updateSubscription = internalMutation({
  args: { subscriptionId: v.string(), userId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await getUserByUserId(ctx, args.userId);

    if (!user) {
      throw new Error('no user found with that user id');
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      endsOn: args.endsOn,
    });
  },
});

export const updateSubscriptionBySubId = internalMutation({
  args: { subscriptionId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_subscriptionId', (q) =>
        q.eq('subscriptionId', args.subscriptionId),
      )
      .first();

    if (!user) {
      throw new Error('no user found with that user id');
    }

    await ctx.db.patch(user._id, {
      endsOn: args.endsOn,
    });
  },
});

export const isUserPremium = async (user: Doc<'users'>) => {
  return (user?.endsOn ?? 0) > Date.now();
};

export const isPremium = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return false;
    }

    const user = await getUserByUserId(ctx, userId);

    if (!user) {
      return false;
    }

    return isUserPremium(user);
  },
});

export const updateUserOnboardingCompleted = mutation({
  args: {},
  async handler(ctx, args) {
    // Get the userId of the current user
    const userId = await getUserId(ctx);
    console.log('userId', userId);
    // Check if there is a userId
    if (!userId) {
      throw new ConvexError('You must be logged in.');
    }

    // Check if the user exists in the database
    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    // If the user doesn't exist, throw an error
    if (!user) {
      throw new ConvexError('User not found');
    }

    // The update the onboardingCompleted field to true
    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
    });
  },
});
