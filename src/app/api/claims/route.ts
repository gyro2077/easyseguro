import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/lib/session"


export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value

  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 })
  }

  const { policyId, description, features } = await request.json()

  if (!policyId || !description) {
    return NextResponse.json({ ok: false, error: "Faltan parámetros" }, { status: 400 })
  }

  const policy = await prisma.policy.findUnique({ where: { id: policyId } })

  if (!policy || policy.userId !== userId) {
    return NextResponse.json({ ok: false, error: "Póliza no encontrada" }, { status: 404 })
  }

  try {
    const claim = await prisma.claim.create({
      data: {
        userId,
        policyId,
        description,
        features: features || [],
        status: "EN REVISIÓN",
      },
    })

    return NextResponse.json({ ok: true, claim })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get(SESSION_COOKIE)?.value

    if (!userId) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 })
    }

    const claims = await prisma.claim.findMany({
      where: { userId },
      include: { policy: { include: { plan: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ ok: true, claims })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
