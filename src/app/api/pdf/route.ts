import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const policyId = searchParams.get("policyId")

  if (!policyId) {
    return NextResponse.json({ error: "policyId required" }, { status: 400 })
  }

  const policy = await prisma.policy.findUnique({
    where: { id: policyId },
    include: { user: true, plan: true },
  })

  if (!policy) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 })
  }

  const name = `${policy.user.nombre} ${policy.user.apellido}`
  const cedula = policy.user.cedula
  const planName = policy.plan.name
  const price = policy.price.toFixed(2)
  const status = policy.status
  const method = policy.paymentMethod
  const created = new Date(policy.createdAt).toLocaleDateString("es-EC")
  const nextPay = new Date(policy.nextPayment).toLocaleDateString("es-EC")

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
  h1 { color: #003366; font-size: 24px; border-bottom: 3px solid #FFD700; padding-bottom: 8px; }
  .section { margin: 24px 0; }
  .label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; }
  .value { font-size: 18px; margin: 4px 0 16px; }
  .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; }
  .footer { margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 12px; }
</style></head><body>
  <h1>EASYSEGURO — Póliza</h1>
  <div class="section">
    <div class="label">Asegurado</div>
    <div class="value">${name}</div>
    <div class="label">Cédula</div>
    <div class="value">${cedula}</div>
  </div>
  <div class="section">
    <div class="label">Plan</div>
    <div class="value">${planName}</div>
    <div class="label">Prima mensual</div>
    <div class="value">$${price}</div>
    <div class="label">Estado</div>
    <div class="value"><span class="badge">${status}</span></div>
  </div>
  <div class="section">
    <div class="label">Método de pago</div>
    <div class="value">${method}</div>
    <div class="label">Próximo pago</div>
    <div class="value">${nextPay}</div>
    <div class="label">Vigencia desde</div>
    <div class="value">${created}</div>
  </div>
  <div class="footer">Documento generado por EASYSEGURO — ${new Date().toLocaleDateString("es-EC")}</div>
</body></html>`

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
