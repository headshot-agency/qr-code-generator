// app/components/QRCodeGenerator.js
'use client'

import { useState } from 'react'

export default function QRCodeGenerator() {
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [qrCode, setQrCode] = useState('')

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const generateQRCode = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (input) {
      formData.append('input', input)
    } else if (file) {
      formData.append('file', file)
    }

    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setQrCode(url)
      } else {
        const errorData = await response.json()
        console.error('Error:', errorData.error)
        alert('Error generating QR code. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error generating QR code. Please try again.')
    }
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <form onSubmit={generateQRCode}>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a link"
          className="border p-2 mr-2"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Generate
        </button>
      </div>
      {qrCode && (
        <div>
          <img src={qrCode} alt="Generated QR Code" className="mb-4" />
          <button
            onClick={downloadQRCode}
            className="bg-green-500 text-white p-2 rounded"
          >
            Download QR Code
          </button>
        </div>
      )}
    </form>
  )
}