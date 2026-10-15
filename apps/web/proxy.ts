import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  AUTH_PAGES,
  DASHBOARD_PATH,
  PROTECTED_PREFIXES,
  SIGN_IN_PATH,
} from "@/config/routes"
import { updateSession } from "@/lib/auth/proxy"

/**
 * 1) Refresh the session (provider-specific) so Server Components see fresh tokens.
 * 2) Optimistic redirect for protected paths. Real authorization is in the DAL.
 */
export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request)

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url))
  }
  if (isAuthenticated && (AUTH_PAGES as readonly string[]).includes(pathname)) {
    // Carry over refreshed session cookies: a redirect built from scratch would drop them,
    // and single-use refresh tokens (Supabase) would then be lost.
    const redirect = NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie)
    return redirect
  }
  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
