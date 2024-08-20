import { z } from 'zod'

export const registerUserPropsSchema = z.object({
  legajo: z.number(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const loginUserPropsSchema = z.object({
  legajo: z.string().optional(),
  password: z.string().optional(),
  dni: z.string().optional(),
})

// export const radioOPFormSchema = z.object({
//   id: z.number(),
//   legajo: z.number(),
//   nombre: z.string(),
//   ht: z.string(),
//   puntaje: z.number(),
//   asistencia: z.boolean(),
//   estado: z.string(),
//   movil: z.number(),
//   qth: z.string(),
//   novedades: z.string().optional(),
// })

// export const radioMovilFormSchema = z.object({
//   movil: z.number(),
//   estado: z.string(),
//   novedades: z.string().optional(),
// })

// export const estadoMovilSchema = z.object({
//   id_estado: z.number(),
//   estado: z.string(),
// })

// export const estadoOperarioSchema = z.object({
//   id_estado: z.number(),
//   estado: z.string(),
// })

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
})
