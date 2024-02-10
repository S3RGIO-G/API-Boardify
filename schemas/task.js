import z from 'zod';

const taskSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, "Min 1 character"),
  description: z.string({ required_error: "Description is required" }),
  hasDescription: z.boolean({ invalid_type_error: "hasDescription must be a boolean" }),
  position: z.number({ required_error: "Position is required" }).min(0, { message: "Min value 0" }),
  created: z.number({ required_error: "Created is required" }),
  updated: z.number({ required_error: "Updated is required" }),
  idList: z.string({ required_error: "IdList is required", invalid_type_error: "IdList must be an string" }),
  idUser: z.string({ required_error: "IdUser is required", invalid_type_error: "IdUser must be an string" }),
  activity: z.array(z.object({
    from: z.string({ required_error: "Activity From is required" }),
    to: z.string({ required_error: "Activity To is required" }),
    time: z.number({ required_error: "Activity Time is required" }).min(0, "Min value 0")
  }))
})

export function validateTask(object, partial = false) {
  if (partial) return taskSchema.partial().safeParse(object);
  else return taskSchema.safeParse(object);
}