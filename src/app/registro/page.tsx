import { ProgressBar } from "@/components/ProgressBar"
import { createUser } from "@/lib/actions"

export default function RegistroPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 px-6 py-8 max-w-sm mx-auto w-full">
        <div className="mb-8">
          <ProgressBar step={1} total={4} />
          <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-1">
            Crear cuenta
          </h1>
          <p className="text-zinc-500 text-sm">
            Completa tus datos para empezar
          </p>
        </div>

        <form action={createUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 mb-1">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Juan"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-zinc-700 mb-1">
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-zinc-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="juan@email.com"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-zinc-700 mb-1">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="0991234567"
            />
          </div>

          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-zinc-700 mb-1">
              Cédula
            </label>
            <input
              id="cedula"
              name="cedula"
              required
              pattern="[0-9]{10}"
              title="10 dígitos numéricos"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-zinc-700 mb-1">
              Ciudad
            </label>
            <input
              id="ciudad"
              name="ciudad"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="Quito"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors mt-4"
          >
            Continuar
          </button>
        </form>
      </main>
    </div>
  )
}
