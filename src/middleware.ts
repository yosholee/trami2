import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale, locales } from "@/i18n/config";

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (pathnameHasLocale(pathname)) {
    const segment = pathname.split("/")[1];
    if (isLocale(segment)) {
      const res = NextResponse.next();
      res.cookies.set("NEXT_LOCALE", segment, { path: "/" });
      res.headers.set("x-locale", segment);
      return res;
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
