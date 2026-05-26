"use client"

import { useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"

interface ScanResult {
  nombres: string
  apellidos: string
  cedula: string
}

interface DocumentScannerProps {
  onResult: (data: ScanResult) => void
  onError?: (error: string) => void
  onClose: () => void
}

export default function DocumentScanner({ onResult, onError, onClose }: DocumentScannerProps) {
  const webcamRef = useRef<Webcam>(null)
  const [loading, setLoading] = useState(false)

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return

    setLoading(true)
    try {
      const res = await fetch("/api/ocr-cedula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      })
      const data = await res.json()
      if (data.ok) {
        onResult(data as ScanResult)
      } else {
        onError?.(data.error || "Error al leer la cédula")
      }
    } catch {
      onError?.("Error de conexión al procesar la imagen")
    } finally {
      setLoading(false)
    }
  }, [onResult, onError])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center px-6">
      <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-2xl bg-black">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="absolute inset-0 w-full h-full object-cover"
          videoConstraints={{ facingMode: "environment" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4/5 aspect-[1.6/1] border-2 border-white/70 rounded-lg" />
        </div>
      </div>

      <p className="text-white/60 text-sm mt-4 mb-6 text-center">
        Coloca tu cédula dentro del rectángulo
      </p>

      <button
        onClick={capture}
        disabled={loading}
        className="w-16 h-16 rounded-full bg-white flex items-center justify-center disabled:opacity-50 transition-opacity"
        aria-label="Tomar foto"
      >
        {loading ? (
          <div className="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="w-12 h-12 rounded-full border-4 border-brand-blue" />
        )}
      </button>

      <button
        onClick={onClose}
        className="mt-6 text-white/50 text-sm underline underline-offset-2 hover:text-white/80 transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}
