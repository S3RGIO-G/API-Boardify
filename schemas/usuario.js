import z from 'zod';

const userSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Email format is not allowed"
  }),
  password: z.string({ required_error: "Password is required" }),
  userName: z.string({ required_error: "UserName is required" }),
  photo: z.string({ required_error: "Photo is required" }),
})

export function validateUser(object, partial = false) {
  if (partial) return userSchema.partial().safeParse(object);
  else return userSchema.safeParse(object);
}