import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const plan = await prisma.plan.findUnique({ where: { slug } })
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }
  return NextResponse.json(plan)
}
