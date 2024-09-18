import { z } from 'zod'
import {
  loginUserPropsSchema,
  registerUserPropsSchema,
  serviciosPropsSchema,
} from '@/schemas/form'

export type RegisterUserProps = z.infer<typeof registerUserPropsSchema>

export type LoginUserProps = z.infer<typeof loginUserPropsSchema>

export type ServiciosFormProps = z.infer<typeof serviciosPropsSchema>
