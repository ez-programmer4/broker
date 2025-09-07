import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token || (token as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect broker routes
  if (pathname.startsWith("/broker")) {
    if (!token || ((token as any).role !== "BROKER" && (token as any).role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/broker/:path*"],
};