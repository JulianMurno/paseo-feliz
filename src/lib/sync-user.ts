import "server-only";
import { prisma } from "./prisma";
import { isDatabaseConfigured } from "./db-config";
import type { Role } from "./types";

interface SupabaseUserLike {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
    [k: string]: unknown;
  } | null;
}

// Crea/actualiza la cuenta del usuario en nuestra base de datos (tabla User) y,
// si ya eligió rol, su perfil de Owner o Walker. Best-effort: si la BD no está
// configurada o falla, NO interrumpe el login (Supabase Auth ya creó la cuenta).
export async function syncUserToDb(
  user: SupabaseUserLike,
  role?: Role,
): Promise<void> {
  if (!isDatabaseConfigured || !user.email) return;

  const name =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  try {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name, avatarUrl, ...(role ? { role } : {}) },
      create: {
        id: user.id,
        email: user.email,
        name,
        avatarUrl,
        role: role ?? null,
      },
    });

    if (role === "OWNER") {
      await prisma.owner.upsert({
        where: { userId: dbUser.id },
        update: {},
        create: { userId: dbUser.id },
      });
    } else if (role === "WALKER") {
      await prisma.walker.upsert({
        where: { userId: dbUser.id },
        update: {},
        create: { userId: dbUser.id },
      });
    }
  } catch (err) {
    console.error("[syncUserToDb] no se pudo sincronizar el usuario:", err);
  }
}
