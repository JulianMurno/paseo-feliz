import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faShieldDog, faLock } from "@fortawesome/free-solid-svg-icons";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Iniciar sesión | Paseo Feliz",
};

export default async function LoginPage() {
  // Si ya hay sesión, salta directo a onboarding o al panel.
  const user = await getSessionUser();
  if (user) {
    if (!user.role) redirect("/onboarding");
    redirect(user.role === "WALKER" ? "/dashboard/walker" : "/dashboard/owner");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-primary/5 to-white px-5 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-white">
            <FontAwesomeIcon icon={faPaw} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
            Bienvenido a Paseo Feliz
          </h1>
          <p className="mt-2 text-ink/60">
            Inicia sesión o crea tu cuenta para reservar paseos y cuidar a tu
            mejor amigo. 🐾
          </p>

          <div className="mt-8">
            <GoogleSignInButton configured={isSupabaseConfigured} />
          </div>

          <div className="mt-6 space-y-2 text-left text-sm text-ink/60">
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldDog} className="text-primary" />
              Solo acceso con Google. Sin contraseñas que recordar.
            </p>
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} className="text-primary" />
              Tus datos están protegidos y nunca se comparten.
            </p>
          </div>

          <p className="mt-8 text-xs text-ink/40">
            Al continuar aceptas nuestros{" "}
            <Link href="#" className="underline">Términos</Link> y{" "}
            <Link href="#" className="underline">Política de privacidad</Link>.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-800">
            <strong>Modo demo activo.</strong> Configura Supabase en{" "}
            <code className="rounded bg-amber-100 px-1">.env</code> para habilitar
            el login real con Google.
          </p>
        )}
      </div>
    </div>
  );
}
