"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { setSession, clearSession } from "@/lib/session"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function createUser(prev: unknown, formData: FormData) {
  const raw = {
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    correo: formData.get("correo") as string,
    telefono: formData.get("telefono") as string,
    cedula: formData.get("cedula") as string,
    ciudad: formData.get("ciudad") as string,
    password: formData.get("password") as string,
  }

  if (!raw.nombre || !raw.apellido || !raw.correo || !raw.telefono || !raw.cedula || !raw.ciudad) {
    return { ok: false, error: "Todos los campos son obligatorios." }
  }

  // Check if there's an active NextAuth session (Google user completing profile)
  const nextAuthSession = await auth()
  if (nextAuthSession?.user?.id) {
    const existing = await prisma.user.findUnique({ where: { id: nextAuthSession.user.id } })
    if (!existing) return { ok: false, error: "Usuario no encontrado." }

    if (!raw.cedula || raw.cedula.length < 10) {
      return { ok: false, error: "Cédula inválida." }
    }

    const cedulaTaken = await prisma.user.findFirst({
      where: { cedula: raw.cedula, id: { not: existing.id } },
    })
    if (cedulaTaken) {
      return { ok: false, error: "Esta cédula ya está registrada." }
    }

    await prisma.user.update({
      where: { id: existing.id },
      data: {
        nombre: raw.nombre,
        apellido: raw.apellido,
        telefono: raw.telefono,
        cedula: raw.cedula,
        ciudad: raw.ciudad,
      },
    })

    await setSession(existing.id)
    revalidatePath("/cotizar")
    return { ok: true }
  }

  // Manual registration
  if (!raw.password) {
    return { ok: false, error: "La contraseña es obligatoria." }
  }

  if (raw.password.length < 6 || !/[A-Z]/.test(raw.password) || !/[a-z]/.test(raw.password)) {
    return { ok: false, error: "La contraseña no cumple los requisitos de seguridad." }
  }

  const existingUser = await prisma.user.findUnique({ where: { cedula: raw.cedula } })
  if (existingUser) {
    return { ok: false, error: "Esta cédula ya tiene una cuenta registrada. Intenta iniciar sesión." }
  }

  const existingEmail = await prisma.user.findUnique({ where: { correo: raw.correo } })
  if (existingEmail) {
    return { ok: false, error: "Este correo ya está registrado." }
  }

  const hashedPassword = await bcrypt.hash(raw.password, 10)

  const user = await prisma.user.create({
    data: { ...raw, password: hashedPassword },
  })

  await setSession(user.id)
  revalidatePath("/cotizar")
  return { ok: true }
}

export async function loginUser(formData: FormData) {
  const cedula = formData.get("cedula") as string
  const password = formData.get("password") as string

  const user = await prisma.user.findUnique({ where: { cedula } })
  if (!user) {
    return { ok: false, error: "Usuario no encontrado. Verifica tu cédula." }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { ok: false, error: "Contraseña incorrecta." }
  }

  await setSession(user.id)
  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function logoutUser() {
  await clearSession()
  redirect("/")
}

export async function updateProfileImage(formData: FormData) {
  const userId = formData.get("userId") as string
  const imageUrl = formData.get("imageUrl") as string

  await prisma.user.update({
    where: { id: userId },
    data: { profileImage: imageUrl },
  })

  revalidatePath("/dashboard/perfil")
  return { ok: true }
}

export async function createPolicy(formData: FormData) {
  const userId = formData.get("userId") as string
  const planId = formData.get("planId") as string
  const paymentMethod = formData.get("paymentMethod") as string

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan) throw new Error("Plan not found")

  const nextPayment = new Date()
  nextPayment.setMonth(nextPayment.getMonth() + 1)

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

  revalidatePath("/dashboard")
  return { ok: true, policyId: policy.id, planName: plan.name }
}
