'use client'

import { useState } from 'react'
import QRCodeGenerator from './components/QRCodeGenerator'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">QR Code Generator</h1>
      <QRCodeGenerator />
    </main>
  )
}