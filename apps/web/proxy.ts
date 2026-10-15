import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { PROTECTED_PREFIXES, SIGN_IN_PATH } from "@/config/routes"
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
  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
