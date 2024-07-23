import prisma from '@/lib/prismadb'
import { RegisterUserProps } from '@/types'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

const validLegajo = (legajo: any) => {
  return /^[0-9]{5}$/.test(legajo)
}

function checkPasswordValidation(value: string) {
  const isWhitespace = /^(?=.*\s)/
  if (isWhitespace.test(value)) {
    return 'No puede haber espacios en la contraseña'
  }

  const isContainsUppercase = /^(?=.*[A-Z])/
  if (!isContainsUppercase.test(value)) {
    return 'La contraseña debe tener al menos UNA letra mayuscula'
  }

  const isContainsLowercase = /^(?=.*[a-z])/
  if (!isContainsLowercase.test(value)) {
    return 'La contraseña debe tener al menos UNA letra minuscula'
  }

  const isContainsNumber = /^(?=.*[0-9])/
  if (!isContainsNumber.test(value)) {
    return 'La contraseña debe tener al menos UN numero'
  }

  const isValidLength = /^.{8,16}$/
  if (!isValidLength.test(value)) {
    return 'La contraseña debe tener entre 8 y 16 caracteres'
  }
  return null
}

export async function POST(req: Request) {
  try {
    const body: RegisterUserProps = await req.json()
    const { legajo, password } = body
    const isRegistered = await prisma.user.findUnique({
      where: { legajo: +legajo, user_password: { not: null } },
    })

    if (isRegistered) {
      return NextResponse.json(
        'El legajo ingresado ya se encuentra registrado',
        { status: 409 },
      )
    }
    const isValidLegajo = validLegajo(legajo)

    if (!isValidLegajo)
      return NextResponse.json('Legajo Invalido', { status: 400 })

    const findLegajo = await prisma.user.findUnique({
      where: { legajo: +legajo },
    })

    if (!findLegajo)
      return NextResponse.json(
        'El legajo ingresado no corresponde con el de un empleado',
        { status: 404 },
      )

    const passwordError = checkPasswordValidation(password)

    if (passwordError) {
      return NextResponse.json(passwordError, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.update({
      where: { legajo: +legajo },
      data: {
        user_password: hashedPassword,
      },
    })
    return NextResponse.json(user)
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json('Server error', { status: 500 })
  }
}
