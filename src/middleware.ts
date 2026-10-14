import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files, internal next paths, and api routes through
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read NextAuth JWT session token
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isAdmin = token?.role === "admin";

  // RULE 1: Admin CANNOT go to the storefront while logged in as admin.
  // Storefront logged in people are ONLY customers.
  // Admin is strictly confined to the separate Admin Portal (/admin/*).
  if (isAdmin) {
    if (!pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // RULE 2: Customers and unauthenticated users CANNOT access /admin/*
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images and public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
