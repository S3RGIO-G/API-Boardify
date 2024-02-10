import { z } from "zod";

const boardSchema = z.object({
  idUser: z.string({ required_error: "IdUser is required" }),
  name: z.string({ required_error: "IdUser is required" }).min(1, "Min 1 character"),
  created: z.number({ required_error: "Created is required" }),
  updated: z.number({ required_error: "Updated is required" }),
  fav: z.boolean({ required_error: "Fav is required" })
});

export function validateBoard(object, partial = false) {
  if (partial) return boardSchema.partial().safeParse(object);
  else return boardSchema.safeParse(object);
}