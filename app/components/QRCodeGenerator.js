// app/components/QRCodeGenerator.js
'use client'

import { useState, useRef, useEffect } from 'react'

export default function QRCodeGenerator() {
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [qrCode, setQrCode] = useState('')
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Slowing down the video
    }
  }, [])

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
    <div className="min-h-screen bg-gray-900 text-yellow-500 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-500">
        <div className="relative h-64 overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
          >
            <source src="https://cdn.headshot.dev/qr-code-generator/assets/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
          <h1 className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-yellow-400 text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>ದಿ QR Generator</h1>
        </div>
        <form onSubmit={generateQRCode} className="p-8 bg-gray-800">
          <div className="mb-6">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter a link"
              className="w-full p-3 bg-gray-900 border-b-2 border-yellow-500 focus:border-yellow-400 transition-colors duration-300 text-yellow-300 placeholder-yellow-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex-1 mr-4 cursor-pointer bg-yellow-500 text-gray-900 rounded-full px-4 py-2 hover:bg-yellow-400 transition-colors duration-300 text-center">
              <span>Choose File</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full transition-colors duration-300"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
      {qrCode && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-center border-2 border-yellow-500">
          <img src={qrCode} alt="Generated QR Code" className="mx-auto mb-4 max-w-full h-auto" />
          <button
            onClick={downloadQRCode}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full transition-colors duration-300"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  )
}