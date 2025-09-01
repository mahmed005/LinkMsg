import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().min(1, "Name must not be empty"),
    email: z.email("Enter a valid email address"),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, "Password must be atleast 8 characters long with alphanumeric and special characters"),
    image: z.string().optional()
});