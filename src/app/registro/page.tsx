"use client"

import { useState, useActionState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { ProgressBar } from "@/components/ProgressBar"
import DocumentScanner from "@/components/DocumentScanner"
import { createUser } from "@/lib/actions"

const ECUADOR_PROVINCES: Record<string, string[]> = {
  "Azuay": ["Cuenca", "Gualaceo", "Girón", "Paute", "Santa Isabel", "Sigsig"],
  "Bolívar": ["Guaranda", "San Miguel", "Caluma", "Chillanes", "Echeandía"],
  "Cañar": ["Azogues", "Biblián", "La Troncal", "El Tambo", "Déleg"],
  "Carchi": ["Tulcán", "Huaca", "El Ángel", "San Gabriel", "Bolívar"],
  "Chimborazo": ["Riobamba", "Alausí", "Chambo", "Guano", "Pallatanga"],
  "Cotopaxi": ["Latacunga", "La Maná", "Pujilí", "Salcedo", "Saquisilí"],
  "El Oro": ["Machala", "Pasaje", "Santa Rosa", "Huaquillas", "Piñas", "Arenillas"],
  "Esmeraldas": ["Esmeraldas", "Atacames", "Muisne", "Rosa Zárate", "San Lorenzo"],
  "Galápagos": ["Puerto Baquerizo Moreno", "Puerto Ayora", "Puerto Villamil"],
  "Guayas": ["Guayaquil", "Daule", "Samborondón", "Durán", "Milagro", "Salinas", "Santa Elena", "La Libertad", "Nobol", "Pedro Carbo"],
  "Imbabura": ["Ibarra", "Otavalo", "Cotacachi", "Atuntaqui", "Pimampiro"],
  "Loja": ["Loja", "Catamayo", "Macará", "Cariamanga", "Zamora"],
  "Los Ríos": ["Babahoyo", "Quevedo", "Ventanas", "Vinces", "Puebloviejo"],
  "Manabí": ["Portoviejo", "Manta", "Chone", "Jipijapa", "Bahía de Caráquez", "El Carmen", "Rocafuerte", "Flavio Alfaro"],
  "Morona Santiago": ["Macas", "Gualaquiza", "Palora", "Sucúa", "Taisha"],
  "Napo": ["Tena", "Archidona", "El Chaco", "Quijos", "Baeza"],
  "Orellana": ["Francisco de Orellana (Coca)", "La Joya de los Sachas", "Loreto"],
  "Pastaza": ["Puyo", "Mera", "Santa Clara", "Arajuno"],
  "Pichincha": ["Quito", "Cayambe", "Rumiñahui", "Mejía", "Pedro Moncayo", "Puerto Quito", "San Miguel de los Bancos"],
  "Santa Elena": ["Santa Elena", "Salinas", "La Libertad"],
  "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia"],
  "Sucumbíos": ["Nueva Loja", "Lago Agrio", "Cuyabeno", "Shushufindi"],
  "Tungurahua": ["Ambato", "Baños", "Pelileo", "Píllaro", "Patate"],
  "Zamora Chinchipe": ["Zamora", "Yantzaza", "El Pangui", "Centinela del Cóndor"],
}

function validateCedula(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false
  const provincia = parseInt(cedula.substring(0, 2))
  if (provincia < 1 || provincia > 24) return false
  const digitoVerificador = parseInt(cedula[9])
  let suma = 0
  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i])
    if (i % 2 === 0) {
      digito *= 2
      if (digito > 9) digito -= 9
    }
    suma += digito
  }
  return (10 - (suma % 10)) % 10 === digitoVerificador
}

export default function RegistroPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [state, formAction, isPending] = useActionState(createUser, null)

  useEffect(() => {
    if (state?.ok) router.push("/cotizar")
  }, [state, router])

  const sessionSynced = useRef(false)
  const [step, setStep] = useState<"method" | "scan" | "form">("method")
  const [isGoogle, setIsGoogle] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [scannerError, setScannerError] = useState<string | null>(null)
  const [selectedProvincia, setSelectedProvincia] = useState("")
  const [showOtraCiudad, setShowOtraCiudad] = useState(false)
  const [otraCiudad, setOtraCiudad] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    cedula: "",
    ciudad: "",
    password: "",
  })

  useEffect(() => {
    if (status === "authenticated" && session?.user && !sessionSynced.current) {
      sessionSynced.current = true
      setForm((p) => ({
        ...p,
        nombre: p.nombre || session.user.name?.split(" ")[0] || "",
        apellido: p.apellido || session.user.name?.split(" ").slice(1).join(" ") || "",
        correo: p.correo || session.user.email || "",
      }))
      setIsGoogle(true)
      setStep("scan")
    }
  }, [status, session])

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    try {
      await signIn("google")
    } finally {
      setGoogleLoading(false)
    }
  }

  const provincias = useMemo(() => Object.keys(ECUADOR_PROVINCES).sort(), [])
  const ciudades = useMemo(
    () => (selectedProvincia ? ECUADOR_PROVINCES[selectedProvincia] : []),
    [selectedProvincia],
  )

  function handleProvinciaChange(value: string) {
    setSelectedProvincia(value)
    setShowOtraCiudad(false)
    setOtraCiudad("")
    setForm((p) => ({ ...p, ciudad: value ? `${value} - ` : "" }))
  }

  function handleCiudadSelect(value: string) {
    setShowOtraCiudad(false)
    setOtraCiudad("")
    setForm((p) => ({ ...p, ciudad: `${selectedProvincia} - ${value}` }))
  }

  function handleScanResult(data: { nombres: string; apellidos: string; cedula: string }) {
    setForm((p) => ({
      ...p,
      nombre: data.nombres || p.nombre,
      apellido: data.apellidos || p.apellido,
      cedula: data.cedula || p.cedula,
    }))
    setStep("form")
    setScannerError(null)
  }

  const cedulaValida = form.cedula.length === 10 && validateCedula(form.cedula)
  const cedulaError = form.cedula.length === 10 && !cedulaValida

  if (step === "method") {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 px-6 py-8 max-w-sm mx-auto w-full flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-zinc-900 mb-1 text-center">
              Crear cuenta
            </h1>
            <p className="text-zinc-500 text-sm text-center">
              Elegí cómo querés registrarte
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-4 bg-white border-2 border-zinc-200 rounded-xl font-semibold text-zinc-700 hover:border-zinc-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continuar con Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-sm text-zinc-400">o</span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            <button
              onClick={() => setStep("scan")}
              className="w-full py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors"
            >
              Registro Manual
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (step === "scan") {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 px-6 py-8 max-w-sm mx-auto w-full">
          <div className="mb-8">
            <ProgressBar step={2} total={3} />
            <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-1">
              Escaneá tu cédula
            </h1>
            <p className="text-zinc-500 text-sm">
              Enfocá tu cédula frontal. Asegurate de tener buena iluminación.
            </p>
          </div>

          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-black">
            <DocumentScanner
              onResult={handleScanResult}
              onError={(msg) => setScannerError(msg)}
              onClose={() => {}}
            />
          </div>

          {scannerError && (
            <p className="text-red-500 text-sm text-center mt-4">{scannerError}</p>
          )}

          <button
            onClick={() => setStep("form")}
            className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-zinc-300 text-sm text-zinc-500 hover:border-brand-blue hover:text-brand-blue transition-all"
          >
            O completá tus datos manualmente
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 px-6 py-8 max-w-sm mx-auto w-full">
        <div className="mb-8">
          <ProgressBar step={3} total={3} />
          <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-1">
            Confirmá tus datos
          </h1>
          <div className="flex justify-between items-end">
            <p className="text-zinc-500 text-sm">
              Revisá que toda la información sea correcta
            </p>
            <button
              type="button"
              onClick={() => setStep("scan")}
              className="text-sm text-brand-blue font-semibold hover:underline"
            >
              ↻ Re-escanear
            </button>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
              <input id="nombre" name="nombre" value={form.nombre} readOnly
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-zinc-700 mb-1">Apellido</label>
              <input id="apellido" name="apellido" value={form.apellido} readOnly
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-zinc-700 mb-1">Correo electrónico</label>
            <input id="correo" name="correo" type="email" value={form.correo}
              onChange={(e) => setForm((p) => ({ ...p, correo: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="juan@email.com"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
            <input id="telefono" name="telefono" type="tel" value={form.telefono}
              onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="0991234567"
            />
          </div>

          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-zinc-700 mb-1">Cédula</label>
            <input id="cedula" name="cedula" value={form.cedula}
              onChange={(e) => setForm((p) => ({ ...p, cedula: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              required
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                cedulaError ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : form.cedula.length === 10 && cedulaValida ? "border-green-400"
                : "border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              }`}
              placeholder="1234567890"
            />
            {cedulaError && <p className="text-xs text-red-500 mt-1">Cédula inválida</p>}
            {form.cedula.length === 10 && cedulaValida && <p className="text-xs text-green-600 mt-1">Cédula válida</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Provincia</label>
            <select value={selectedProvincia} onChange={(e) => handleProvinciaChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-white text-zinc-900"
            >
              <option value="">Selecciona una provincia</option>
              {provincias.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Ciudad</label>
            <input type="hidden" name="ciudad" value={form.ciudad} />
            {selectedProvincia ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {ciudades.map((c) => (
                    <button key={c} type="button" onClick={() => handleCiudadSelect(c)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        form.ciudad === `${selectedProvincia} - ${c}`
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >{c}</button>
                  ))}
                  <button type="button" onClick={() => { setShowOtraCiudad(true); setForm((p) => ({ ...p, ciudad: p.ciudad })) }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      showOtraCiudad ? "bg-brand-blue text-white border-brand-blue"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >Otra</button>
                </div>
                {showOtraCiudad && (
                  <input type="text" value={otraCiudad}
                    onChange={(e) => { setOtraCiudad(e.target.value); setForm((p) => ({ ...p, ciudad: `${selectedProvincia} - ${e.target.value}` })) }}
                    placeholder="Escribe tu ciudad"
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                  />
                )}
              </>
            ) : (
              <p className="text-sm text-zinc-400 py-2">Selecciona una provincia primero</p>
            )}
          </div>

          {!isGoogle && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
              <input id="password" name="password" type="password" value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
              />
              <ul className="mt-2 space-y-1">
                {[
                  { label: "Mínimo 6 caracteres", pass: form.password.length >= 6 },
                  { label: "Al menos 1 mayúscula", pass: /[A-Z]/.test(form.password) },
                  { label: "Al menos 1 minúscula", pass: /[a-z]/.test(form.password) },
                ].map((t) => (
                  <li key={t.label}
                    className={`text-xs flex items-center gap-1.5 transition-colors ${
                      form.password.length === 0 ? "text-zinc-400" : t.pass ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <span>{form.password.length === 0 ? "○" : t.pass ? "✓" : "✗"}</span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isGoogle && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-xl px-4 py-3">
              Al usar Google no necesitás crear una contraseña. Iniciás sesión con un clic.
            </div>
          )}

          {state && !state.ok && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {state.error}
            </div>
          )}

          <button type="submit" disabled={isPending}
            className="w-full py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando..." : "Finalizar"}
          </button>
        </form>
      </main>
    </div>
  )
}
