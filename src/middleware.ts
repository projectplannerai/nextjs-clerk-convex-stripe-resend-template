import { NextRequest, NextResponse } from 'next/server';

import {
  clerkMiddleware,
  createRouteMatcher,
  redirectToSignIn,
} from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, req) => {
  const userId = auth().userId;
  const pathname = req.nextUrl.pathname;
  const sessionClaims = auth().sessionClaims;

  // For user visiting /onboarding, don't try and redirect
  if (userId && pathname === '/onboarding') {
    return NextResponse.next();
  }

  // User isn't signed in and the route is private -- redirect to sign-in
  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // Catch users who doesn't have `onboardingComplete: true` in PublicMetata
  // Redirect them to the /onboading out to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // User is logged in and the route is protected - let them view.
  if (userId && !isPublicRoute(req)) return NextResponse.next();

  // Protect all routes that are not public
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
