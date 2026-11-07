import { describe, expect, it } from "vitest"

import { SignInSchema, SignUpSchema } from "../schemas"

describe("password rules", () => {
  const signUp = (password: string) =>
    SignUpSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password,
      confirmPassword: password,
    }).success

  it("asks for 8+ characters on sign-up", () => {
    expect(signUp("1234567")).toBe(false)
    expect(signUp("12345678")).toBe(true)
  })

  it("does not lock out an older, shorter password at sign-in", () => {
    expect(
      SignInSchema.safeParse({ email: "ada@example.com", password: "abc123" })
        .success
    ).toBe(true)
    expect(
      SignInSchema.safeParse({ email: "ada@example.com", password: "" }).success
    ).toBe(false)
  })
})
