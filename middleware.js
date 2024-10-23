import { NextResponse } from 'next/server';
import {  clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/events(.*)",
  "/meetings(.*)",
  "/availability(.*)",

])

export default clerkMiddleware((auth, req) => {
  // Check if the user is authenticated and if the route is protected
  if (!auth().userId && isProtectedRoute(req)) {
    return NextResponse.redirect(auth().redirectToSignIn());
  }

  // Allow access if authenticated or the route is not protected
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
