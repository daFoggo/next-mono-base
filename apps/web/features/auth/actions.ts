"use server"

import { redirect } from "next/navigation"

import {
  DASHBOARD_PATH,
  OAUTH_CALLBACK_PATH,
  SIGN_IN_PATH,
} from "@/config/routes"
import { getAuthProvider } from "@/lib/auth"
import { getErrorMessage } from "@/lib/errors"
import { publicEnv } from "@/lib/env.public"

import { SignInSchema } from "./schemas"

export type SignInState = { error?: string }

export async function signInAction(
  _previous: SignInState,
  formData: FormData
): Promise<SignInState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    const provider = await getAuthProvider()
    await provider.signIn(parsed.data)
  } catch (error) {
    return { error: getErrorMessage(error, "Unable to sign in") }
  }

  // redirect() throws, so it must stay outside the try/catch.
  redirect(DASHBOARD_PATH)
}

export async function signInWithGoogleAction(): Promise<void> {
  let url: string | undefined
  try {
    const provider = await getAuthProvider()
    url = await provider.oauth?.start(
      "google",
      `${publicEnv.NEXT_PUBLIC_APP_URL}${OAUTH_CALLBACK_PATH}`
    )
  } catch {
    url = undefined
  }
  redirect(url ?? `${SIGN_IN_PATH}?error=oauth`)
}

export async function signOutAction(): Promise<void> {
  const provider = await getAuthProvider()
  await provider.signOut()
  redirect(SIGN_IN_PATH)
}
