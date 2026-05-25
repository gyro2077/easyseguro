import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl font-black text-white">ES</span>
        </div>
        <h1 className="text-3xl font-bold text-center text-zinc-900 mb-2">
          EASYSEGURO
        </h1>
        <p className="text-zinc-500 text-center max-w-xs mb-12">
          Tu seguro, simple y digital. Protege lo que importa en minutos.
        </p>
        <div className="w-full max-w-sm space-y-3">
          <Link
            href="/registro"
            className="block w-full text-center py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors"
          >
            Crear cuenta
          </Link>
          <Link
            href="/login"
            className="block w-full text-center py-4 bg-zinc-100 text-zinc-700 rounded-xl font-semibold text-lg hover:bg-zinc-200 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>
      <footer className="text-center text-xs text-zinc-400 pb-8">
        Al continuar, aceptas nuestros Términos y Condiciones
      </footer>
    </div>
  )
}
