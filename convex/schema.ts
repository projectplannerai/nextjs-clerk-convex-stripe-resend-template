import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    endsOn: v.optional(v.number()),
    onboardingCompleted: v.boolean(),
  })
    .index('by_userId', ['userId'])
    .index('by_email', ['email'])
    .index('by_subscriptionId', ['subscriptionId']),
  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    expires: v.number(),
  }).index('by_key', ['key']),
});
