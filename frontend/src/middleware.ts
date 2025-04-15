import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isHomeRoute = createRouteMatcher(["/"]);
const isPublicRoute = createRouteMatcher(["/apply"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  // Allow public access to the apply page
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // if there is user and home route is accessed, redirect to dashboard or any other protected route
  if (userId && isHomeRoute(req)) {
    return NextResponse.rewrite(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
