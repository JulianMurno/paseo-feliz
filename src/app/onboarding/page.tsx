import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Elige tu cuenta | Paseo Feliz",
};

export default async function OnboardingPage() {
  // Con Supabase activo: exige sesión; si ya tiene rol, va a su panel.
  if (isSupabaseConfigured) {
    const user = await getSessionUser();
    if (!user) redirect("/login");
    if (user.role) {
      redirect(user.role === "WALKER" ? "/dashboard/walker" : "/dashboard/owner");
    }
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 to-white">
      <div className="container-px flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center">
            <span className="chip">Último paso</span>
            <h1 className="section-title mt-4">¿Cómo quieres usar Paseo Feliz?</h1>
            <p className="mt-3 text-ink/70">
              Elige tu tipo de cuenta. Esto determina las funciones que verás.
              Podrás cambiarlo más adelante.
            </p>
          </div>
          <div className="mt-10">
            <RoleSelector configured={isSupabaseConfigured} />
          </div>
        </div>
      </div>
    </div>
  );
}
