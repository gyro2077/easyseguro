export default function PerfilPage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Mi Perfil</h1>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-2xl font-bold text-white">
          JP
        </div>
        <div>
          <p className="font-semibold text-zinc-900">Juan Pérez</p>
          <p className="text-sm text-zinc-400">juan@email.com</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="bg-white rounded-2xl border border-zinc-100 p-5">
          <h2 className="font-semibold text-zinc-900 mb-3">Historial de seguros</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700">Vida Protegida</p>
                <p className="text-xs text-zinc-400">Desde may 2026</p>
              </div>
              <span className="text-xs bg-brand-green/10 text-brand-green font-medium px-2 py-1 rounded-full">
                ACTIVO
              </span>
            </div>
          </div>
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

        <section className="bg-white rounded-2xl border border-zinc-100 p-5">
          <h2 className="font-semibold text-zinc-900 mb-3">Documentos</h2>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-brand-blue hover:text-blue-700 transition-colors">
              📄 Ver carnet digital
            </button>
            <button className="w-full text-left text-sm text-brand-blue hover:text-blue-700 transition-colors">
              📄 Descargar póliza PDF
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
