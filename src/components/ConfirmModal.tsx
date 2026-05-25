"use client"

import { useEffect, useRef } from "react"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  confirmLabel?: string
  onConfirm?: () => void
}

export function ConfirmModal({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
}: ConfirmModalProps) {
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
      className="w-[85vw] max-w-sm rounded-2xl bg-white p-6 backdrop:bg-black/60"
    >
      <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-zinc-100 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-200 transition-colors"
        >
          Cerrar
        </button>
        {onConfirm && (
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 py-3 bg-brand-blue text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors"
          >
            {confirmLabel || "Aceptar"}
          </button>
        )}
      </div>
    </dialog>
  )
}
