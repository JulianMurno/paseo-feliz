import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { Role } from "./types";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: Role | null;
}

// Devuelve el usuario autenticado (o null). En modo demo siempre null.
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.full_name as string) ?? null,
    avatarUrl: (user.user_metadata?.avatar_url as string) ?? null,
    // El rol se guarda en metadata tras el onboarding.
    role: (user.user_metadata?.role as Role) ?? null,
  };
}
