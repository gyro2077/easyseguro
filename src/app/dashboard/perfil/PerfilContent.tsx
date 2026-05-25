"use client"

import { useState } from "react"
import { DigitalCard } from "@/components/DigitalCard"
import { updateProfileImage } from "@/lib/actions"

interface PolicyBrief {
  id: string
  planName: string
  status: string
  createdAt: Date
}

export function PerfilContent({
  userId,
  userName,
  userEmail,
  userCedula,
  profileImage,
  initials,
  policies,
  activePolicyId,
  activePolicyPlan,
}: {
  userId: string
  userName: string
  userEmail: string
  userCedula: string
  profileImage: string | null
  initials: string
  policies: PolicyBrief[]
  activePolicyId?: string
  activePolicyPlan?: string
}) {
  const [showCard, setShowCard] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const fd = new FormData()
      fd.append("userId", userId)
      fd.append("imageUrl", dataUrl)
      await updateProfileImage(fd)
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Mi Perfil</h1>

      <div className="flex items-center gap-4 mb-8">
        <label className="relative cursor-pointer group">
          {profileImage ? (
            <img
              src={profileImage}
              alt={userName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-2xl font-bold text-white group-hover:opacity-80 transition-opacity">
              {initials}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-colors flex items-center justify-center">
            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Editar
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <div>
          <p className="font-semibold text-zinc-900">{userName}</p>
          <p className="text-sm text-zinc-400">{userEmail}</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="bg-white rounded-2xl border border-zinc-100 p-5">
          <h2 className="font-semibold text-zinc-900 mb-3">Historial de seguros</h2>
          {policies.length === 0 ? (
            <p className="text-sm text-zinc-400">Aún no has contratado ningún seguro.</p>
          ) : (
            <div className="space-y-3">
              {policies.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-700">{p.planName}</p>
                    <p className="text-xs text-zinc-400">
                      Desde {new Date(p.createdAt).toLocaleDateString("es-EC", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.status === "ACTIVE"
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-zinc-100 p-5">
          <h2 className="font-semibold text-zinc-900 mb-3">Métodos de pago</h2>
          <div className="flex items-center gap-3">
            <span className="text-lg">💳</span>
            <div>
              <p className="text-sm font-medium text-zinc-700">Tarjeta de débito</p>
              <p className="text-xs text-zinc-400">•••• 1234</p>
            </div>
          </div>
        </section>

        {activePolicyId && (
          <section className="bg-white rounded-2xl border border-zinc-100 p-5">
            <h2 className="font-semibold text-zinc-900 mb-3">Documentos</h2>
            <div className="space-y-2">
              <button
                onClick={() => setShowCard(true)}
                className="w-full text-left text-sm text-brand-blue hover:text-blue-700 transition-colors cursor-pointer"
              >
                📄 Ver carnet digital
              </button>
              <a
                href={`/api/pdf?policyId=${activePolicyId}`}
                target="_blank"
                className="block w-full text-left text-sm text-brand-blue hover:text-blue-700 transition-colors"
              >
                📄 Descargar póliza PDF
              </a>
            </div>
          </section>
        )}
      </div>

      <DigitalCard
        open={showCard}
        onClose={() => setShowCard(false)}
        userName={userName}
        userCedula={userCedula}
        planName={activePolicyPlan || ""}
        policyId={activePolicyId || ""}
      />
    </main>
  )
}
