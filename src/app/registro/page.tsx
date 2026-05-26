"use client"

import { useState, useActionState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
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
  const [state, formAction, isPending] = useActionState(createUser, null)

  useEffect(() => {
    if (state?.ok) router.push("/cotizar")
  }, [state, router])

  const [step, setStep] = useState<"scan" | "form">("scan")
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
              <input id="nombre" name="nombre" value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-zinc-700 mb-1">Apellido</label>
              <input id="apellido" name="apellido" value={form.apellido}
                onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Tu apellido"
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
