import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  let url = req.nextUrl;
  const session = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });


  if (!session) {
    // If there is no JWT cookie and user is on profile page, redirect to login page
    if(url.pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } else {
    // If there is a JWT cookie and user is on login and such pages, redirect to home page
    if (
      url.pathname === "/login" ||
      url.pathname === "/register" ||
      url.pathname === "/forgot-password" ||
      url.pathname === "/reset-password"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all req paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
