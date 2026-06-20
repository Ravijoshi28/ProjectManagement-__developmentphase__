import { NextRequest, NextResponse } from "next/server";

export function middleware(
  req: NextRequest
) {
  const token =
    req.cookies.get("token")?.value;

  const isAuthPage =
    req.nextUrl.pathname.startsWith(
      "/auth"
    );

  const isDashboard =
    req.nextUrl.pathname.startsWith(
      "/main/dashboard"
    );

  if (!token && isDashboard) {
    return NextResponse.redirect(
      new URL("/auth", req.url)
    );
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/main/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/main/:path*"],
};