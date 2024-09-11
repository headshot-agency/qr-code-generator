import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request) {
  const formData = await request.formData()
  const input = formData.get('input')
  const file = formData.get('file')

  let qrInput = input

  if (!qrInput && file) {
    qrInput = file.name
  }

  if (!qrInput) {
    return NextResponse.json({ error: 'No input provided' }, { status: 400 })
  }

  try {
    const qrCodeBuffer = await QRCode.toBuffer(qrInput)
    return new NextResponse(qrCodeBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=qrcode.png',
      },
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json({ error: 'Error generating QR code' }, { status: 500 })
  }
}