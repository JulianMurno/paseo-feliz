import "server-only";
import { prisma } from "./prisma";
import { isDatabaseConfigured } from "./db-config";
import { getSessionUser, type SessionUser } from "./auth";

// Garantiza que exista la fila `User` para el usuario autenticado.
// Necesario porque alguien pudo haber iniciado sesión (y elegido rol) ANTES de
// conectar la base de datos, por lo que su `User` aún no existe. Sin esto, crear
// el perfil Owner/Walker fallaría por la clave foránea.
async function ensureUserRow(user: SessionUser) {
  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      // Mantén el email/nombre/avatar al día sin pisar el rol existente.
      name: user.name ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
    },
    create: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role ?? undefined,
    },
  });
}

// Devuelve el perfil de Owner del usuario autenticado (creándolo si falta).
export async function getCurrentOwner() {
  if (!isDatabaseConfigured) return null;
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") return null;

  await ensureUserRow(user);

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

  await ensureUserRow(user);

  return prisma.walker.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
}
