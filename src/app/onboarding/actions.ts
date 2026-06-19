"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { syncUserToDb } from "@/lib/sync-user";
import type { Role } from "@/lib/types";

// Server Action: guarda el rol elegido en los metadatos de Supabase y crea el
// perfil (Owner/Walker) en la base de datos. Luego redirige al panel correcto.
export async function completeOnboarding(role: Role) {
  if (role !== "OWNER" && role !== "WALKER") {
    return { error: "Rol inválido" };
  }

  if (!isSupabaseConfigured) {
    return { error: "demo" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sin sesión. Inicia sesión de nuevo." };
  }

  // Guarda el rol en los metadatos del usuario (fuente de verdad para la UI).
  const { error } = await supabase.auth.updateUser({ data: { role } });
  if (error) return { error: error.message };

  // Crea/actualiza la cuenta y su perfil en la base de datos (best-effort).
  await syncUserToDb(user, role);

  redirect(role === "WALKER" ? "/dashboard/walker" : "/dashboard/owner");
}
