import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const plans = [
    {
      name: "Básico",
      slug: "basico",
      price: 9.99,
      description: "Protección esencial",
      features: [
        "Asistencia médica telefónica 24/7",
        "Descuentos en farmacias afiliadas",
        "Cobertura por accidentes personales básicos",
        "Orientación médica virtual",
      ],
      recommended: false,
    },
    {
      name: "Vida Protegida",
      slug: "vida-protegida",
      price: 19.99,
      description: "La opción más completa",
      features: [
        "Todo lo del plan Básico",
        "Cobertura de hospitalización",
        "Indemnización por fallecimiento",
        "Asistencia funeraria",
        "Traslado médico de emergencia",
      ],
      recommended: true,
    },
    {
      name: "Premium",
      slug: "premium",
      price: 34.99,
      description: "Protección total",
      features: [
        "Todo lo del plan Vida Protegida",
        "Cobertura internacional",
        "Chequeo médico anual completo",
        "Asistencia jurídica",
        "Cirugía mayor",
        "Cobertura dental básica",
      ],
      recommended: false,
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    })
  }

  console.log(`✅ Seeded ${plans.length} plans`)

  if (process.env.SEED_USER_PASSWORD) {
    const hash = await bcrypt.hash(process.env.SEED_USER_PASSWORD, 10)
    const existingUser = await prisma.user.findFirst()
    if (existingUser && !existingUser.password) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hash },
      })
      console.log(`✅ Updated existing user with password`)
    }
  }

  console.log("✅ Seed complete")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
