import { filtersDTO } from '@/DTO/filters'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const filters = await filtersDTO()

    return NextResponse.json(filters)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
