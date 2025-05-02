import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  

  

  revalidateTag('products')

  return NextResponse.json({ revalidated: true })
}
