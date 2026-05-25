import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/lib/session"

export async function POST(request: Request) {
  const formData = await request.formData()
  const planId = formData.get("planId") as string
  const paymentMethod = formData.get("paymentMethod") as string

  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value || (formData.get("userId") as string)

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan) {
    return NextResponse.json({ ok: false, error: "Plan not found" }, { status: 404 })
  }

  const nextPayment = new Date()
  nextPayment.setMonth(nextPayment.getMonth() + 1)

  try {
    const policy = await prisma.policy.create({
      data: {
        userId,
        planId,
        price: plan.price,
        paymentMethod,
        nextPayment,
        status: "ACTIVE",
      },
    })
    return NextResponse.json({ ok: true, policyId: policy.id, planName: plan.name })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
