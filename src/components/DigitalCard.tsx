"use client"

import { useEffect, useRef } from "react"

interface DigitalCardProps {
  open: boolean
  onClose: () => void
  userName: string
  userCedula: string
  planName: string
  policyId: string
}

export function DigitalCard({
  open,
  onClose,
  userName,
  userCedula,
  planName,
  policyId,
}: DigitalCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) el.showModal()
    else el.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto inset-0 fixed w-[90vw] max-w-sm rounded-3xl bg-transparent backdrop:bg-black/60 p-0"
    >
      <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-3xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <span className="text-lg font-black">EASYSEGURO</span>
          <span className="text-xs opacity-80">DIGITAL</span>
        </div>

        <div className="text-center mb-6">
          <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-3">
            <rect x="5" y="5" width="90" height="90" rx="8" fill="white" opacity="0.15" />
            <g opacity="0.9" fill="white">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const row = Math.floor(i / 3)
                const col = i % 3
                return (
                  <rect
                    key={i}
                    x={20 + col * 22}
                    y={20 + row * 22}
                    width="8"
                    height="8"
                    rx="1"
                    opacity={i % 2 === 0 ? 0.8 : 0.4}
                  />
                )
              })}
            </g>
          </svg>
          <p className="text-sm opacity-80 mb-1">Carnet Digital</p>
          <p className="text-lg font-bold">{userName}</p>
        </div>

        <div className="text-xs space-y-1 opacity-80">
          <div className="flex justify-between">
            <span>Cédula</span>
            <span className="font-mono">{userCedula}</span>
          </div>
          <div className="flex justify-between">
            <span>Plan</span>
            <span>{planName}</span>
          </div>
          <div className="flex justify-between">
            <span>Póliza</span>
            <span className="font-mono text-[10px]">{policyId.slice(0, 13)}...</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </dialog>
  )
}
