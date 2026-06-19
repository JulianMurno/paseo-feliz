"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { isDatabaseConfigured } from "@/lib/db-config";
import { prisma } from "@/lib/prisma";

export interface DeleteAccountResult {
  ok?: boolean;
  demo?: boolean;
  authDeleted?: boolean;
  error?: string;
}

// Elimina la cuenta del usuario: borra sus datos de la base de datos (en
// cascada: perfiles, mascotas, bookings y reseñas) y la cuenta de Supabase Auth.
export async function deleteAccount(): Promise<DeleteAccountResult> {
  // Modo demo: no hay cuenta real que borrar.
  if (!isSupabaseConfigured) {
    return { demo: true };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No hay sesión activa. Inicia sesión de nuevo." };
  }

  // 1) Borra los datos de la base de datos (best-effort).
  if (isDatabaseConfigured && user.email) {
    try {
      await prisma.user.deleteMany({ where: { email: user.email } });
    } catch (err) {
      console.error("[deleteAccount] error borrando de la BD:", err);
    }
  }

  // 2) Borra la cuenta de Supabase Auth (requiere service role key).
  let authDeleted = false;
  if (hasServiceRole) {
    try {
      const admin = createAdminClient();
      const { error } = await admin.auth.admin.deleteUser(user.id);
      authDeleted = !error;
      if (error) console.error("[deleteAccount] error borrando de Auth:", error);
    } catch (err) {
      console.error("[deleteAccount] excepción borrando de Auth:", err);
    }
  }

  // 3) Cierra la sesión en este dispositivo.
  await supabase.auth.signOut();

  return { ok: true, authDeleted };
}
