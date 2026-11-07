import { publicEnv } from "@/lib/env.public"

/** Absolute link into the dashboard app (apps/dashboard), which owns sign-in and every signed-in page. */
export function dashboardHref(path: string): string {
  return new URL(path, publicEnv.NEXT_PUBLIC_DASHBOARD_URL).toString()
}

export const REPO_URL = "https://github.com/daFoggo/next-mono-base"

export const SIGN_IN_HREF = dashboardHref("/sign-in")
