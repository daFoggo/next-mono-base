import { z } from "zod"

// Sign-in only checks the shape: a rule raised later must not lock out accounts created under the old one.
export const SignInSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .max(128, "Password must be at most 128 characters"),
})

export type SignInInput = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter your name").max(255),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpFormInput = z.infer<typeof SignUpSchema>
