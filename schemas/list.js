import { z } from "zod";

const listSchema = z.object({
  position: z.number({ required_error: "Position is required" }).min(0, "Min value 0"),
  name: z.string({ required_error: "Name is required" }).min(1, "Min 1 character"),
  idUser: z.string({ required_error: "IdUser is required" }),
  idBoard: z.string({ required_error: "IdBoard is required" })
})

export function validateList(object, partial = false) {
  if (partial) return listSchema.partial().safeParse(object);
  else return listSchema.safeParse(object);
}