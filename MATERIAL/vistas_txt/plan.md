¡Hola! Como experto Full Stack y diseñador de interfaces, he analizado detalladamente los documentos, mockups y requerimientos que me has compartido.

La propuesta visual y de UX ("Tu seguro, en simple") es excelente: reduce la fricción, elimina tecnicismos y empodera al usuario mediante la autogestión.

Para lograr esto rápidamente y poder previsualizar el MVP interactivo **ahora mismo**, he adaptado la estrategia:

1. **Plan de Implementación en Producción (Next.js + PostgreSQL)**: Te detallaré paso a paso la arquitectura, la configuración de la base de datos que me pasaste y cómo estructurar el proyecto real.
2. **Artefacto MVP Interactivo (React SPA)**: Generaré el código completo de la aplicación en un solo archivo interactivo que podrás probar aquí mismo. Simulará la navegación de las 11 pantallas y la experiencia móvil fluida (usando `switch/case` para la navegación y estado en memoria), siguiendo al pie de la letra tu paleta de colores y lineamientos UI/UX.

---

### 🚀 Plan de Implementación para Producción (Next.js + PostgreSQL)

Para llevar este MVP a producción usando **Next.js (App Router)**, **Tailwind CSS**, **Prisma (ORM)** y tu base de datos en **Railway**, sigue esta arquitectura:

#### Paso 1: Inicialización del Proyecto

En tu terminal (Linux/macOS), ejecuta:

```bash
# 1. Crear el proyecto Next.js usando pnpm (como solicitaste)
pnpm create next-app@latest easy-seguro --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Entrar al directorio
cd easy-seguro

# 3. Instalar dependencias clave (Prisma, Lucide para íconos, next-pwa)
pnpm add lucide-react @prisma/client next-pwa
pnpm add -D prisma

```

#### Paso 2: Configuración de la Base de Datos (PostgreSQL en Railway)

Inicializa Prisma para conectar tu base de datos relacional:

```bash
npx prisma init

```

En tu archivo `.env`, coloca las credenciales proporcionadas:

```env
DATABASE_URL="postgresql://postgres:WsAEtjUepTfUPehiSzdzLQCnDZbiNaUp@zephyr.proxy.rlwy.net:25716/railway"

```

Modifica `prisma/schema.prisma` para crear el modelo relacional básico de cuentas y pólizas:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  nombre    String
  apellido  String
  correo    String   @unique
  telefono  String
  cedula    String   @unique
  ciudad    String
  createdAt DateTime @default(now())
  policies  Policy[]
}

model Policy {
  id            String   @id @default(uuid())
  userId        String
  planName      String   // "Vida Protegida", "Amparo Plus", etc.
  price         Float
  status        String   @default("ACTIVE") // ACTIVE, CANCELLED
  paymentMethod String
  nextPayment   DateTime
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
}

```

Sincroniza la base de datos: `npx prisma db push`.

#### Paso 3: Configuración PWA (Progressive Web App)

Para que los usuarios puedan instalar la app en su inicio, configura `next-pwa`.
Edita `next.config.mjs`:

```javascript
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desactivar en dev para evitar logs molestos
});

export default withPWA({
  // tus otras configuraciones de next
});

```

Crea un archivo `public/manifest.json` con los metadatos de "Easy Seguro" y asegúrate de añadir íconos de 192x192 y 512x512.

#### Paso 4: Estructura de Rutas (App Router)

Organiza tus vistas separando los flujos de "Onboarding/Ventas" y "Autogestión":

* `src/app/page.tsx` -> (Pantalla 1: Bienvenida)
* `src/app/registro/page.tsx` -> (Pantalla 2: Crear Cuenta)
* `src/app/cotizar/page.tsx` -> (Pantalla 3, 4, 5: Elegir seguro, Detalle, Coberturas)
* `src/app/pago/page.tsx` -> (Pantalla 6 y 7: Opciones de pago y Confirmación)
* `src/app/dashboard/page.tsx` -> (Pantalla 8: Inicio / Dashboard)
* `src/app/dashboard/seguro/page.tsx` -> (Pantalla 9: Mi seguro activo)
* `src/app/dashboard/ayuda/page.tsx` -> (Pantalla 10: Centro de Ayuda)
* `src/app/dashboard/perfil/page.tsx` -> (Pantalla 11: Mi perfil)

---

### 🎨 Prototipo MVP Interactivo (React App)

A continuación, genero el código completo del MVP interactivo. He compilado las 11 pantallas en un flujo SPA (Single Page Application) para que puedas previsualizar la experiencia de usuario y la UI responsiva **ahora mismo en el panel derecho**.

El diseño utiliza fondo `Trust Blue` (`#001e40`), botones amarillo brillante (`#fcd400`), diseño en tarjetas limpias, tipografía moderna y la navegación requerida sin fricciones.

### 📋 Siguientes pasos para el despliegue

1. Puedes visualizar el prototipo directamente en esta plataforma (gracias al código generado arriba).
2. Para la base de datos real, te recomiendo usar **Prisma Studio** (`npx prisma studio`) localmente; te permitirá ver cómo se insertan los usuarios desde Next.js a Railway.
3. El código generado utiliza Tailwind directamente; al llevarlo a Next.js, simplemente extrae cada componente (por ejemplo, `ScreenBienvenida`) a su propia ruta (`/src/app/page.tsx`), reemplazando la función simulada `Maps` por el componente `<Link>` de `next/link` o el hook `useRouter()`.

¿Hay alguna vista en particular de la que desees ver la conexión backend con PostgreSQL a detalle?