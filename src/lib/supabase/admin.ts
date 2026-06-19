import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

// Cliente "admin" de Supabase usando la SERVICE ROLE KEY (solo servidor).
// Necesario para operaciones privilegiadas como borrar usuarios de Auth.
// NUNCA expongas esta clave al navegador (no lleva prefijo NEXT_PUBLIC_).
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const hasServiceRole = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

export function createAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
