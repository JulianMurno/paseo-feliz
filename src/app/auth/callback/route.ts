import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/sync-user";
import type { Role } from "@/lib/types";

// Callback de OAuth de Google (vía Supabase). Intercambia el `code` por una
// sesión, crea/sincroniza la cuenta en la base de datos y redirige según si el
// usuario ya eligió su rol (onboarding) o ya tiene panel.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const role = (user?.user_metadata?.role as Role | undefined) ?? undefined;

      // Crea la cuenta en nuestra tabla User (best-effort si hay BD configurada).
      if (user) await syncUserToDb(user, role);

      // Si venía con un destino explícito, respétalo.
      if (next) return NextResponse.redirect(`${origin}${next}`);

      // Primer login (sin rol) -> onboarding. Si ya tiene rol -> su panel.
      const dest = role
        ? role === "WALKER"
          ? "/dashboard/walker"
          : "/dashboard/owner"
        : "/onboarding";

      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
