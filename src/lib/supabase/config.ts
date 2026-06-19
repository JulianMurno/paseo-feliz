// Configuración compartida de Supabase.
// La app entra en "modo demo" si no hay claves configuradas, de modo que
// puedas ver toda la UI sin tener un proyecto de Supabase todavía.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY,
);
