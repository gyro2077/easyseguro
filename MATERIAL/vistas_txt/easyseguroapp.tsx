import React, { useState } from 'react';
import { 
  ShieldCheck, ChevronLeft, Star, FileText, CheckCircle2, XCircle, 
  CreditCard, Lock, Home, MessageCircle, User, Shield, AlertTriangle, 
  ChevronRight, Phone, MapPin, Building, Info, HeartPulse
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('bienvenida');
  const [userData, setUserData] = useState({ nombre: '', apellido: '', correo: '', telefono: '', cedula: '', ciudad: '' });
  const [selectedPlan, setSelectedPlan] = useState('popular');
  const [paymentMethod, setPaymentMethod] = useState('debit');

  const navigate = (screen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(screen);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const plans = {
    basico: { id: 'basico', name: 'Vida Protegida', price: 8, cover: 30000, desc: 'Cobertura básica por fallecimiento', icon: <Shield className="text-[#001e40]" size={32} /> },
    popular: { id: 'popular', name: 'Amparo Plus', price: 28, cover: 50000, desc: 'Fallecimiento + invalidez', icon: <Star className="text-[#001e40]" size={32} /> },
    completo: { id: 'completo', name: 'Amparo Seguro', price: 55, cover: 100000, desc: 'Cobertura completa + enf. graves', icon: <HeartPulse className="text-[#001e40]" size={32} /> }
  };

  // --- COMPONENTES COMPARTIDOS ---
  const Header = ({ title, backTo, showProgress, progressStep }) => (
    <header className="bg-[#001e40] text-white pt-8 pb-4 px-5 sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between mb-4">
        {backTo ? (
          <button onClick={() => navigate(backTo)} className="p-2 -ml-2 rounded-full hover:bg-[#003366] transition-colors">
            <ChevronLeft size={24} />
          </button>
        ) : <div className="w-10" />}
        <h1 className="text-lg font-bold truncate">{title}</h1>
        <div className="w-10" />
      </div>
      {showProgress && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#799dd6]">Paso {progressStep} de 3</span>
          </div>
          <div className="h-2 w-full bg-[#003366] rounded-full overflow-hidden">
            <div className="h-full bg-[#fcd400] transition-all duration-300" style={{ width: `${(progressStep / 3) * 100}%` }} />
          </div>
        </div>
      )}
    </header>
  );

  const BottomNav = ({ active }) => (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-[72px] pb-safe bg-white border-t border-gray-200 shadow-[0px_-4px_20px_rgba(0,51,102,0.08)] z-50">
      <button onClick={() => navigate('dashboard')} className={`flex flex-col items-center justify-center w-16 h-full ${active === 'inicio' ? 'text-[#001e40] font-bold' : 'text-gray-500 hover:text-[#001e40]'}`}>
        <Home size={24} className="mb-1" />
        <span className="text-[10px]">Inicio</span>
      </button>
      <button onClick={() => navigate('mi_seguro')} className={`flex flex-col items-center justify-center w-16 h-full ${active === 'seguros' ? 'text-[#001e40] font-bold bg-blue-50 rounded-xl py-1' : 'text-gray-500 hover:text-[#001e40]'}`}>
        <ShieldCheck size={24} className="mb-1" />
        <span className="text-[10px]">Seguros</span>
      </button>
      <button onClick={() => navigate('ayuda')} className={`flex flex-col items-center justify-center w-16 h-full ${active === 'ayuda' ? 'text-[#001e40] font-bold' : 'text-gray-500 hover:text-[#001e40]'}`}>
        <MessageCircle size={24} className="mb-1" />
        <span className="text-[10px]">Chat</span>
      </button>
      <button onClick={() => navigate('perfil')} className={`flex flex-col items-center justify-center w-16 h-full ${active === 'perfil' ? 'text-[#001e40] font-bold' : 'text-gray-500 hover:text-[#001e40]'}`}>
        <User size={24} className="mb-1" />
        <span className="text-[10px]">Perfil</span>
      </button>
    </nav>
  );

  // --- PANTALLAS ---

  // 1. Bienvenida
  const ScreenBienvenida = () => (
    <div className="flex flex-col min-h-screen bg-[#001e40] text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-12">
        <div className="relative w-24 h-24 mb-6 bg-[#003366] rounded-3xl flex items-center justify-center shadow-lg transform rotate-12">
          <ShieldCheck size={56} className="text-[#fcd400] transform -rotate-12" />
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Easy</h1>
        <div className="w-16 h-1 bg-[#fcd400] mb-2 rounded-full"></div>
        <p className="text-sm text-[#fcd400] tracking-[0.2em] uppercase text-center font-semibold">Seguro</p>
      </div>
      <div className="bg-[#fcf9f8] rounded-t-[32px] px-6 py-10 flex flex-col items-center shadow-[0px_-8px_30px_rgba(0,51,102,0.15)] flex-1 justify-center">
        <p className="text-lg text-gray-600 text-center mb-8 italic font-light">Tu seguro, simple y digital</p>
        <div className="w-full flex flex-col gap-4">
          <button className="w-full bg-[#003366] text-white font-semibold rounded-full py-4 px-6 shadow-md hover:bg-[#001e40] active:scale-95 transition-all">
            Iniciar sesión
          </button>
          <button onClick={() => navigate('crear_cuenta')} className="w-full bg-white text-[#001e40] border-2 border-[#fcd400] font-semibold rounded-full py-4 px-6 hover:bg-yellow-50 active:scale-95 transition-all">
            Crear cuenta
          </button>
        </div>
        <div className="mt-8">
          <button onClick={() => navigate('ayuda')} className="text-sm text-gray-500 hover:text-[#001e40] flex items-center gap-1">
            ¿Necesitas ayuda? <span className="text-[#001e40] underline font-semibold">Habla con nosotros</span>
          </button>
        </div>
      </div>
    </div>
  );

  // 2. Crear Cuenta
  const ScreenCrearCuenta = () => (
    <div className="min-h-screen bg-[#fcf9f8] pb-10">
      <Header title="Crear Cuenta" backTo="bienvenida" showProgress progressStep={1} />
      <main className="px-5 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold text-[#001e40] mb-2">Tus Datos</h2>
          <p className="text-gray-500 mb-6">Ingresa tu información esencial.</p>
          
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700">Nombre</label>
                <input name="nombre" onChange={handleInputChange} value={userData.nombre} className="mt-1 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none" placeholder="Ej. Andrés" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700">Apellido</label>
                <input name="apellido" onChange={handleInputChange} value={userData.apellido} className="mt-1 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none" placeholder="Ej. Báez" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
              <input name="correo" type="email" onChange={handleInputChange} value={userData.correo} className="mt-1 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none" placeholder="correo@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Teléfono celular</label>
              <input name="telefono" type="tel" onChange={handleInputChange} value={userData.telefono} className="mt-1 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none" placeholder="09XXXXXXXX" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Número de cédula</label>
              <input name="cedula" type="text" onChange={handleInputChange} value={userData.cedula} className="mt-1 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none" placeholder="1700000000" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Ciudad</label>
              <select name="ciudad" onChange={handleInputChange} value={userData.ciudad} className="mt-1 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none bg-white">
                <option value="">Selecciona tu ciudad</option>
                <option value="Quito">Quito</option>
                <option value="Guayaquil">Guayaquil</option>
                <option value="Cuenca">Cuenca</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('elegir_seguro')} className="w-full h-14 bg-[#fcd400] text-[#001e40] font-bold rounded-full shadow-md hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2">
          Registrarme <ChevronRight size={20} />
        </button>
      </main>
    </div>
  );

  // 3. Elegir Seguro
  const ScreenElegirSeguro = () => (
    <div className="min-h-screen bg-[#fcf9f8] pb-10">
      <Header title="Elige tu seguro" backTo="crear_cuenta" showProgress progressStep={2} />
      <main className="px-5 py-6">
        <p className="text-center text-lg text-gray-500 mb-6 italic">¿Cuál se adapta mejor a ti?</p>
        <div className="flex flex-col gap-4">
          {Object.values(plans).map((plan) => (
            <div 
              key={plan.id} 
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all ${selectedPlan === plan.id ? 'border-[#001e40] bg-[#e6f0fa] shadow-md' : 'border-gray-200 bg-white shadow-sm hover:border-gray-300'}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-[#001e40]' : 'border-gray-300'}`}>
                    {selectedPlan === plan.id && <div className="w-3 h-3 rounded-full bg-[#001e40]" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    {plan.icon}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPlan === plan.id ? 'bg-[#001e40] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {plan.id.charAt(0).toUpperCase() + plan.id.slice(1)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  <div className="text-2xl font-bold text-[#001e40] my-1">${plan.price}<span className="text-sm text-gray-500 font-normal">/mes</span></div>
                  <p className="text-sm text-gray-600">{plan.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button onClick={() => navigate('detalle_plan')} className="w-full bg-[#001e40] text-white font-bold h-14 rounded-full shadow-md hover:bg-[#003366] active:scale-95 transition-all flex justify-center items-center gap-2">
            Ver detalles y contratar <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );

  // 4. Detalle del Plan
  const ScreenDetallePlan = () => {
    const plan = plans[selectedPlan];
    return (
      <div className="min-h-screen bg-[#fcf9f8] pb-10">
        <Header title={plan.name} backTo="elegir_seguro" />
        <main className="px-5 py-6">
          <div className="bg-[#001e40] rounded-3xl p-6 text-white text-center mb-6 shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#003366] rounded-full blur-2xl"></div>
            <h2 className="text-4xl font-bold mb-1 relative z-10">${plan.price} <span className="text-lg font-normal text-blue-200">/mes</span></h2>
            <p className="text-blue-100 relative z-10">Cobertura hasta <span className="font-bold text-[#fcd400]">${plan.cover.toLocaleString()}</span></p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">¿Qué incluye?</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
            <ul className="divide-y divide-gray-100">
              {[
                { icon: '💀', title: 'Fallecimiento', desc: 'Pago único a tu familia' },
                { icon: '🦽', title: 'Invalidez total', desc: 'Si no puedes trabajar' },
                { icon: '🏥', title: 'Enf. graves', desc: 'Diagnóstico cubierto' },
                { icon: '⚰️', title: 'Asist. funeraria', desc: 'Gastos incluidos' },
                { icon: '👨‍👩‍👧', title: 'Beneficiarios', desc: 'Hasta 3 personas' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 p-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#fcd400] flex items-center justify-center text-[#001e40]">
                    <CheckCircle2 size={16} className="fill-current text-[#fcd400]" />
                    <span className="absolute text-[#001e40] font-bold text-[10px]">✓</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <button onClick={() => navigate('coberturas')} className="w-full mb-4 text-center text-[#001e40] font-bold underline text-sm py-2">
            Ver detalle completo de SÍ / NO cubre
          </button>

          <button onClick={() => navigate('opciones_pago')} className="w-full bg-[#fcd400] text-[#001e40] font-bold h-14 rounded-full shadow-md hover:bg-yellow-400 active:scale-95 transition-all flex justify-center items-center gap-2">
            Contratar ahora <ChevronRight size={20} />
          </button>
        </main>
      </div>
    );
  };

  // 5. Cobertura del Plan (Sí/No cubre)
  const ScreenCoberturas = () => {
    const [tab, setTab] = useState('si');
    const plan = plans[selectedPlan];
    
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Header title={plan.name} backTo="detalle_plan" />
        <div className="flex bg-white shadow-sm sticky top-[72px] z-40">
          <button onClick={() => setTab('si')} className={`flex-1 py-4 font-bold text-center border-b-4 transition-colors ${tab === 'si' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-gray-400'}`}>
            ✓ Sí cubre
          </button>
          <button onClick={() => setTab('no')} className={`flex-1 py-4 font-bold text-center border-b-4 transition-colors ${tab === 'no' ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-gray-400'}`}>
            ✕ No cubre
          </button>
        </div>
        <main className="px-5 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {tab === 'si' ? (
              <ul className="divide-y divide-gray-100">
                <li className="flex items-center gap-4 p-4">
                  <div className="text-2xl">💀</div>
                  <div className="flex-1 font-semibold text-gray-800">Fallecimiento por cualquier causa</div>
                  <CheckCircle2 className="text-[#10b981]" size={24} />
                </li>
                <li className="flex items-center gap-4 p-4">
                  <div className="text-2xl">🦽</div>
                  <div className="flex-1 font-semibold text-gray-800">Invalidez total y permanente</div>
                  <CheckCircle2 className="text-[#10b981]" size={24} />
                </li>
                <li className="flex items-center gap-4 p-4">
                  <div className="text-2xl">🏥</div>
                  <div className="flex-1 font-semibold text-gray-800">Enfermedades graves diagnosticadas</div>
                  <CheckCircle2 className="text-[#10b981]" size={24} />
                </li>
                <li className="flex items-center gap-4 p-4">
                  <div className="text-2xl">⚰️</div>
                  <div className="flex-1 font-semibold text-gray-800">Asistencia funeraria incluida</div>
                  <CheckCircle2 className="text-[#10b981]" size={24} />
                </li>
              </ul>
            ) : (
              <ul className="divide-y divide-gray-100">
                <li className="flex items-center gap-4 p-4 bg-red-50/30">
                  <div className="text-2xl">🏍️</div>
                  <div className="flex-1 font-semibold text-gray-800">Accidentes en moto sin licencia</div>
                  <XCircle className="text-[#ef4444]" size={24} />
                </li>
                <li className="flex items-center gap-4 p-4 bg-red-50/30">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1 font-semibold text-gray-800">Enfermedades preexistentes no declaradas</div>
                  <XCircle className="text-[#ef4444]" size={24} />
                </li>
                <li className="flex items-center gap-4 p-4 bg-red-50/30">
                  <div className="text-2xl">🌍</div>
                  <div className="flex-1 font-semibold text-gray-800">Fallecimiento fuera del territorio nacional</div>
                  <XCircle className="text-[#ef4444]" size={24} />
                </li>
              </ul>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6 px-4">Sin letra pequeña. Tienes 15 días para cancelar si cambias de opinión.</p>
        </main>
      </div>
    );
  };

  // 6. Opciones de pago
  const ScreenOpcionesPago = () => {
    const plan = plans[selectedPlan];
    return (
      <div className="min-h-screen bg-[#fcf9f8] pb-24">
        <Header title="Opciones de pago" backTo="detalle_plan" showProgress progressStep={3} />
        
        <div className="bg-[#e6f0fa] p-5 border-b border-[#cce0f5]">
          <h2 className="text-[#001e40] font-bold text-lg">{plan.name} 🛡️</h2>
          <div className="mt-1 text-[#003366] text-sm flex items-center">
            <span className="font-bold">${plan.price} / mes</span>
            <span className="mx-2 opacity-50">•</span>
            <span className="underline decoration-[#a7c8ff]">Cobertura hasta ${plan.cover.toLocaleString()}</span>
          </div>
        </div>

        <main className="px-5 py-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo quieres pagar?</h3>
          
          <div className="flex flex-col gap-4">
            <label className={`relative flex items-center p-4 rounded-2xl cursor-pointer transition-colors border-2 ${paymentMethod === 'credit' ? 'border-[#001e40] bg-[#e6f0fa]' : 'border-gray-200 bg-white'}`}>
              <input type="radio" name="payment" className="w-5 h-5 accent-[#001e40] mr-4" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} />
              <CreditCard className="text-[#001e40] mr-4" size={28} />
              <div className="flex-1">
                <div className={`font-bold ${paymentMethod === 'credit' ? 'text-[#001e40]' : 'text-gray-700'}`}>Tarjeta de crédito</div>
                <div className="text-xs text-gray-500 mt-1">Visa, Mastercard, Amex</div>
              </div>
            </label>

            <label className={`relative flex items-center p-4 rounded-2xl cursor-pointer transition-colors border-2 ${paymentMethod === 'debit' ? 'border-[#001e40] bg-[#e6f0fa]' : 'border-gray-200 bg-white'}`}>
              <input type="radio" name="payment" className="w-5 h-5 accent-[#001e40] mr-4" checked={paymentMethod === 'debit'} onChange={() => setPaymentMethod('debit')} />
              <CreditCard className="text-[#001e40] mr-4" size={28} />
              <div className="flex-1 relative">
                <div className={`font-bold ${paymentMethod === 'debit' ? 'text-[#001e40]' : 'text-gray-700'}`}>Tarjeta de débito</div>
                <div className="text-xs text-gray-500 mt-1">Cualquier banco del Ecuador</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#fcd400] text-[#001e40] text-[10px] uppercase font-bold px-2 py-1 rounded-md">
                  Recomendado
                </div>
              </div>
            </label>

            <label className={`relative flex items-center p-4 rounded-2xl cursor-pointer transition-colors border-2 ${paymentMethod === 'account' ? 'border-[#001e40] bg-[#e6f0fa]' : 'border-gray-200 bg-white'}`}>
              <input type="radio" name="payment" className="w-5 h-5 accent-[#001e40] mr-4" checked={paymentMethod === 'account'} onChange={() => setPaymentMethod('account')} />
              <Building className="text-[#001e40] mr-4" size={28} />
              <div className="flex-1">
                <div className={`font-bold ${paymentMethod === 'account' ? 'text-[#001e40]' : 'text-gray-700'}`}>Cuenta Pichincha</div>
                <div className="text-xs text-gray-500 mt-1">Débito automático mes a mes</div>
              </div>
            </label>
          </div>

          <div className="flex justify-center items-center gap-2 py-6 opacity-70 mt-4">
            <Lock size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">Pago 100% seguro y encriptado</span>
          </div>

          <div className="fixed bottom-0 left-0 w-full p-5 bg-white border-t border-gray-100 z-50">
            <button onClick={() => navigate('confirmacion')} className="w-full h-14 bg-[#fcd400] text-[#001e40] font-bold rounded-full shadow-lg hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2">
              Confirmar y pagar <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    );
  };

  // 7. Confirmación
  const ScreenConfirmacion = () => {
    const plan = plans[selectedPlan];
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex flex-col">
        <div className="bg-[#001e40] pt-16 pb-12 px-6 flex flex-col items-center text-white rounded-b-[40px] shadow-lg relative overflow-hidden z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
            <CheckCircle2 size={48} className="text-[#10b981]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Listo!</h1>
          <p className="text-blue-200 text-lg">Tu seguro está activo</p>
        </div>

        <div className="px-5 pt-8 pb-10 flex-1 flex flex-col">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🛡️</span>
              <h2 className="text-xl font-bold text-[#001e40]">{plan.name}</h2>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">N° de póliza</span>
                <span className="font-semibold text-gray-800">VP-2026-004821</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Prima mensual</span>
                <span className="font-semibold text-gray-800">${plan.price}.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Cobertura máxima</span>
                <span className="font-semibold text-gray-800">${plan.cover.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 mt-2 bg-blue-50 -mx-4 rounded-xl">
                <span className="text-[#001e40]">Próximo pago</span>
                <span className="text-[#001e40] font-bold">15 Jun 2026</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-3 rounded-full">
              <MessageCircle size={16} />
              <span>Enviamos el resumen a tu correo</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <button onClick={() => navigate('dashboard')} className="w-full h-14 bg-[#fcd400] text-[#001e40] font-bold rounded-full shadow-md hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2">
              Ir a Mi seguro <ChevronRight size={20} />
            </button>
            <button className="w-full h-14 bg-transparent border-2 border-[#001e40] text-[#001e40] font-bold rounded-full hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-2">
              <FileText size={20} /> Descargar póliza PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 8. Dashboard (Inicio)
  const ScreenDashboard = () => {
    const plan = plans[selectedPlan];
    return (
      <div className="min-h-screen bg-[#fcf9f8] pb-[90px]">
        <header className="bg-[#001e40] px-5 pt-12 pb-6 rounded-b-[32px] text-white shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-blue-200 text-sm mb-1">Hola, {userData.nombre || 'Andrés'} 👋</p>
              <h1 className="text-2xl font-bold">Bienvenido a Easy Seguro</h1>
            </div>
            <div onClick={() => navigate('perfil')} className="w-12 h-12 rounded-full bg-[#fcd400] flex items-center justify-center text-[#001e40] font-bold text-xl cursor-pointer">
              {(userData.nombre || 'A')[0]}
            </div>
          </div>

          <div onClick={() => navigate('mi_seguro')} className="bg-white rounded-2xl p-5 text-gray-800 shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Shield className="text-[#001e40]" size={20} />
                <h3 className="font-bold text-[#001e40] text-lg">{plan.name}</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Activo
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 mb-1">Próximo pago: 15 Jun</p>
                <p className="text-xl font-bold text-[#001e40]">${plan.price}.00 <span className="text-sm font-normal text-gray-500">/mes</span></p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="px-5 pt-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-4 gap-3 mb-8">
            <button className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-[#001e40]">
                <CreditCard size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Pagar</span>
            </button>
            <button onClick={() => navigate('ayuda')} className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Reportar</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-[#001e40]">
                <FileText size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Póliza</span>
            </button>
            <button onClick={() => navigate('ayuda')} className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-[#001e40]">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Chat</span>
            </button>
          </div>

          <h2 className="font-bold text-gray-800 text-lg mb-4">Novedades</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">🎁</div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">¡Nuevo! Amparo Plus con 10% off</h4>
              <p className="text-xs text-gray-500">Mejora tu cobertura este mes.</p>
            </div>
          </div>
        </main>
        <BottomNav active="inicio" />
      </div>
    );
  };

  // 9. Mi Seguro Activo
  const ScreenMiSeguro = () => {
    const plan = plans[selectedPlan];
    return (
      <div className="min-h-screen bg-[#fcf9f8] pb-[90px]">
        <header className="bg-[#001e40] text-white pt-8 sticky top-0 z-40 shadow-md">
          <div className="flex items-center px-5 h-16 w-full mb-2">
            <h1 className="text-xl font-bold flex-1">{plan.name}</h1>
          </div>
          <div className="flex w-full">
            <button className="flex-1 py-4 text-center text-sm font-bold border-b-4 border-[#fcd400] text-white bg-[#003366]/40">Mi seguro</button>
            <button className="flex-1 py-4 text-center text-sm text-blue-200 hover:bg-[#003366]/20">Complementario</button>
          </div>
        </header>

        <main className="px-5 pt-6">
          <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activo
              </span>
              <span className="font-semibold text-gray-700">${plan.price}/mes</span>
            </div>
            <div className="text-sm text-gray-500">Vence: <span className="font-semibold text-gray-800">Jun 2026</span></div>
          </div>

          <h2 className="text-lg font-bold mb-4 text-[#001e40] flex items-center gap-2 border-b border-gray-200 pb-2">
            Beneficios incluidos <ShieldCheck size={20} className="text-[#001e40]" />
          </h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#e6f0fa] flex items-center justify-center mt-1"><CheckCircle2 size={16} className="text-[#001e40]" /></div>
              <div><h3 className="font-bold text-gray-900">Fallecimiento</h3><p className="text-sm text-gray-500">Cobertura principal designada.</p></div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#e6f0fa] flex items-center justify-center mt-1"><CheckCircle2 size={16} className="text-[#001e40]" /></div>
              <div><h3 className="font-bold text-gray-900">Invalidez total</h3><p className="text-sm text-gray-500">Soporte financiero completo.</p></div>
            </li>
          </ul>

          <h2 className="text-lg font-bold mb-4 text-[#001e40] flex items-center justify-between border-b border-gray-200 pb-2">
            Centros médicos afiliados <span className="text-xs font-normal bg-blue-50 text-[#001e40] px-3 py-1 rounded-full">Ver todos</span>
          </h2>
          <div className="space-y-4 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold mb-2">Hospital Metropolitano</h3>
              <div className="flex gap-4">
                <a href="#" className="flex items-center gap-1 text-sm text-[#001e40] bg-blue-50 px-3 py-1.5 rounded-lg"><Phone size={14}/> 02-226-1520</a>
                <a href="#" className="flex items-center gap-1 text-sm text-[#001e40] bg-blue-50 px-3 py-1.5 rounded-lg"><MapPin size={14}/> Mapa</a>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold mb-2">Clínica Pichincha</h3>
              <div className="flex gap-4">
                <a href="#" className="flex items-center gap-1 text-sm text-[#001e40] bg-blue-50 px-3 py-1.5 rounded-lg"><Phone size={14}/> 02-299-7400</a>
                <a href="#" className="flex items-center gap-1 text-sm text-[#001e40] bg-blue-50 px-3 py-1.5 rounded-lg"><MapPin size={14}/> Mapa</a>
              </div>
            </div>
          </div>
        </main>
        <BottomNav active="seguros" />
      </div>
    );
  };

  // 10. Ayuda
  const ScreenAyuda = () => (
    <div className="min-h-screen bg-[#fcf9f8] pb-[90px]">
      <header className="bg-[#001e40] text-white pt-10 pb-6 px-5 rounded-b-[32px] shadow-md">
        <h1 className="text-2xl font-bold mb-6">Centro de ayuda</h1>
        <div className="bg-white rounded-2xl p-5 shadow-lg flex items-center gap-4 cursor-text border-2 border-transparent focus-within:border-[#fcd400]">
          <div className="w-12 h-12 bg-[#e6f0fa] rounded-full flex items-center justify-center text-[#001e40]">🤖</div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Asistente virtual 24/7</p>
            <input type="text" placeholder="Pregúntame lo que necesites..." className="w-full text-sm text-gray-800 outline-none" />
          </div>
          <Search size={20} className="text-[#001e40]" />
        </div>
      </header>
      
      <main className="px-5 pt-8">
        <h2 className="font-bold text-gray-800 text-lg mb-4">¿En qué te podemos ayudar?</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {[
            { icon: '🚨', title: '¿Cómo reportar un siniestro?', desc: 'Accidente, fallecimiento u otro evento' },
            { icon: '⚰️', title: '¿Asistencia exequial?', desc: 'Cómo activar el servicio funerario' },
            { icon: '📅', title: '¿Cómo agendo una cita?', desc: 'Centros médicos afiliados' },
            { icon: '❓', title: 'Preguntas frecuentes', desc: 'Dudas sobre tu póliza y coberturas' }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 text-left">
              <div className="text-2xl w-10">{item.icon}</div>
              <div className="flex-1 ml-2">
                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>
        <button className="w-full bg-white border-2 border-[#001e40] text-[#001e40] font-bold h-14 rounded-full flex justify-center items-center gap-2 hover:bg-blue-50 transition-all shadow-sm">
          <Phone size={18} /> Llamar a un asesor
        </button>
      </main>
      <BottomNav active="ayuda" />
    </div>
  );

  // 11. Perfil
  const ScreenPerfil = () => (
    <div className="min-h-screen bg-[#fcf9f8] pb-[90px]">
      <section className="bg-[#001e40] pt-12 pb-16 px-5 flex flex-col items-center justify-center relative rounded-b-[32px] shadow-md z-10">
        <div className="w-24 h-24 rounded-full border-4 border-[#fcd400] bg-white flex items-center justify-center text-4xl font-bold text-[#001e40] mb-4 shadow-lg">
          {(userData.nombre || 'A')[0]}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{userData.nombre || 'Andrés'} {userData.apellido || 'Báez'}</h1>
        <div className="flex items-center space-x-1 text-[#fcd400] bg-[#003366] px-3 py-1 rounded-full">
          <Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" />
          <span className="text-xs text-white ml-1 font-bold">5.0</span>
        </div>
      </section>

      <section className="px-5 -mt-6 relative z-20 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 text-left">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4"><User size={20} className="text-[#001e40]"/></div>
            <div className="flex-1"><h3 className="font-bold text-gray-900 text-sm">Datos personales</h3><p className="text-xs text-gray-500 mt-0.5">Editar información</p></div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center p-4 hover:bg-gray-50 text-left">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4"><CreditCard size={20} className="text-[#001e40]"/></div>
            <div className="flex-1"><h3 className="font-bold text-gray-900 text-sm">Método de pago</h3><p className="text-xs text-gray-500 mt-0.5">{paymentMethod === 'debit' ? 'Débito Pichincha' : 'Tarjeta'}</p></div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        <h2 className="font-bold text-gray-800 text-lg px-2 mt-6">Historial y Docs</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 text-left">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4"><FileText size={20} className="text-[#001e40]"/></div>
            <div className="flex-1"><h3 className="font-bold text-gray-900 text-sm">Mis recibos</h3><p className="text-xs text-gray-500 mt-0.5">Pagos y movimientos</p></div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center p-4 hover:bg-gray-50 text-left">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4"><Info size={20} className="text-[#001e40]"/></div>
            <div className="flex-1"><h3 className="font-bold text-gray-900 text-sm">Términos y condiciones</h3><p className="text-xs text-gray-500 mt-0.5">Legales</p></div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </section>
      <BottomNav active="perfil" />
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'bienvenida': return <ScreenBienvenida />;
      case 'crear_cuenta': return <ScreenCrearCuenta />;
      case 'elegir_seguro': return <ScreenElegirSeguro />;
      case 'detalle_plan': return <ScreenDetallePlan />;
      case 'coberturas': return <ScreenCoberturas />;
      case 'opciones_pago': return <ScreenOpcionesPago />;
      case 'confirmacion': return <ScreenConfirmacion />;
      case 'dashboard': return <ScreenDashboard />;
      case 'mi_seguro': return <ScreenMiSeguro />;
      case 'ayuda': return <ScreenAyuda />;
      case 'perfil': return <ScreenPerfil />;
      default: return <ScreenBienvenida />;
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
        {renderScreen()}
      </div>
    </div>
  );
}