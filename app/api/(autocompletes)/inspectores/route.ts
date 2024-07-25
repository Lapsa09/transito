import { inspectoresDTO } from '@/DTO/user'
import { NextResponse } from 'next/server'

export async function GET() {
  const inspectores = await inspectoresDTO()

  return NextResponse.json(inspectores)
}
