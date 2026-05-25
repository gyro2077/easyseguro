import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { SESSION_COOKIE } from "@/lib/session"

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value

  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 })
  }

  const { policyId, newPlanId, confirmPayment, paymentMethod } = await request.json()

  if (!policyId || !newPlanId) {
    return NextResponse.json({ ok: false, error: "Faltan parámetros" }, { status: 400 })
  }

  const policy = await prisma.policy.findUnique({
    where: { id: policyId },
    include: { plan: true },
  })

  if (!policy || policy.userId !== userId) {
    return NextResponse.json({ ok: false, error: "Póliza no encontrada" }, { status: 404 })
  }

  const newPlan = await prisma.plan.findUnique({ where: { id: newPlanId } })

  if (!newPlan) {
    return NextResponse.json({ ok: false, error: "Plan no encontrado" }, { status: 404 })
  }

  const priceDiff = newPlan.price - policy.price

  if (priceDiff > 0 && !confirmPayment) {
    return NextResponse.json({
      ok: true,
      requiresPayment: true,
      priceDiff: Math.round(priceDiff * 100) / 100,
      currentPlan: policy.plan.name,
      newPlan: newPlan.name,
    })
  }

  const [, newPolicy] = await prisma.$transaction([
    prisma.policy.update({
      where: { id: policyId },
      data: { status: "CANCELED_UPGRADE" },
    }),
    prisma.policy.create({
      data: {
        userId: policy.userId,
        planId: newPlanId,
        price: newPlan.price,
        status: "ACTIVE",
        paymentMethod: paymentMethod || policy.paymentMethod,
        nextPayment: policy.nextPayment,
      },
    }),
  ])

  revalidatePath("/dashboard", "layout")

  return NextResponse.json({
    ok: true,
    requiresPayment: false,
    policyId: newPolicy.id,
    planName: newPlan.name,
    price: newPlan.price,
  })
}
