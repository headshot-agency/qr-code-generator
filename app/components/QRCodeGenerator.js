// app/components/QRCodeGenerator.js
'use client'

import { useState, useRef, useEffect } from 'react'

export default function QRCodeGenerator() {
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [qrCode, setQrCode] = useState('')
  const [fileName, setFileName] = useState('')
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, [])

  const handleInputChange = (e) => setInput(e.target.value)
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
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
      <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-500">
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
          <h1 className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 text-center px-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Vault-Tec QR Generator</h1>
        </div>
        <form onSubmit={generateQRCode} className="p-4 sm:p-6 md:p-8 bg-gray-800">
          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter a link"
              className="w-full p-3 bg-gray-700 border-b-2 border-yellow-500 focus:border-yellow-400 transition-colors duration-300 text-yellow-100 placeholder-yellow-700"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="w-full sm:w-auto mb-4 sm:mb-0 relative">
              <label className="cursor-pointer w-full sm:w-auto bg-yellow-600 text-gray-900 rounded-full px-4 py-2 hover:bg-yellow-400 transition-colors duration-300 inline-block">
                <span>Choose File</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileName && (
                <span className="ml-2 text-yellow-400 break-all">{fileName}</span>
              )}
              {fileName && (
                <span className="absolute w-10 h-10 grid place-items-center top-0 bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full transition-colors duration-300"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
      {qrCode && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-center border-2 border-yellow-500">
          <img src={qrCode} alt="Generated QR Code" className="mx-auto mb-4 max-w-full h-auto" />
          <p className="text-yellow-400 mb-4">This QR Code includes the Vault-Tec logo at its center.</p>
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