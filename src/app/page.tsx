import Image from "next/image"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">

      {/* Mitad Superior: Logo Horizontal Controlado */}
      <div className="flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-20">
            <Image
              src="/logo.png"
              alt="Easy Seguro"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center pt-2">
            <h1 className="text-4xl font-bold text-white tracking-wide leading-none">Easy</h1>
            <div className="border-t-2 border-brand-yellow mt-1 pt-1">
              <span className="text-brand-yellow tracking-[0.2em] font-medium text-xs ml-1">SEGURO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-12 pb-8 flex flex-col items-center w-full">
        <p className="text-zinc-500 italic text-center mb-8 text-sm">
          Tu <span className="font-semibold">seguro</span>, simple y digital
        </p>

        <div className="w-full max-w-sm space-y-4">
          <Link
            href="/login"
            className="flex items-center justify-center w-full py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="flex items-center justify-center w-full py-4 bg-white text-zinc-900 border-2 border-brand-yellow rounded-xl font-bold text-lg hover:bg-zinc-50 transition-colors"
          >
            Crear cuenta
          </Link>
        </div>

        <p className="mt-8 text-xs text-zinc-400">
          ¿Necesitas ayuda? <a href="https://wa.me/593993899178?text=Quiero%20informaci%C3%B3n%20de%20los%20servicios%20o%20contactarme%20con%20un%20asesor%20humano" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 cursor-pointer">Habla con nosotros</a>
        </p>
      </div>

    </div>
  )
}
