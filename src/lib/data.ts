"use server"

import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getActivePlans() {
  "use cache"
  cacheLife("hours")
  cacheTag("plans")
  return prisma.plan.findMany({ orderBy: { price: "asc" } })
}

export async function getPlanBySlug(slug: string) {
  "use cache"
  cacheLife("hours")
  cacheTag(`plan-${slug}`)
  return prisma.plan.findUnique({ where: { slug } })
}

export async function getUserWithPolicy(userId: string) {
  "use cache"
  cacheLife("minutes")
  cacheTag(`user-${userId}`)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { policies: { include: { plan: true } } },
  })

  return user
}

export async function getPolicyById(policyId: string) {
  "use cache"
  cacheLife("minutes")
  cacheTag(`policy-${policyId}`)

  return prisma.policy.findUnique({
    where: { id: policyId },
    include: { user: true, plan: true },
  })
}

export async function getUserPolicies(userId: string) {
  "use cache"
  cacheLife("minutes")
  cacheTag(`policies-${userId}`)

  return prisma.policy.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  })
}
