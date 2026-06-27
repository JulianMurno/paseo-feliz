import "server-only";
import { prisma } from "./prisma";
import { isDatabaseConfigured } from "./db-config";
import { getSessionUser } from "./auth";

// Devuelve el perfil de Owner del usuario autenticado (creándolo si falta).
export async function getCurrentOwner() {
  if (!isDatabaseConfigured) return null;
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") return null;

  return prisma.owner.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
}

// Devuelve el perfil de Walker del usuario autenticado (creándolo si falta).
export async function getCurrentWalker() {
  if (!isDatabaseConfigured) return null;
  const user = await getSessionUser();
  if (!user || user.role !== "WALKER") return null;

  return prisma.walker.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
}
