"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/client";

// Botón de inicio de sesión con Google (vía Supabase OAuth).
// Si Supabase no está configurado, muestra un aviso de "modo demo".
export function GoogleSignInButton({ configured }: { configured: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    if (!configured) {
      setError(
        "Modo demo: configura tus claves de Supabase en .env para activar el login con Google.",
      );
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={signIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-black/10 bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-sm transition-all hover:border-primary hover:shadow-soft disabled:opacity-60"
      >
        <FontAwesomeIcon icon={faGoogle} className="text-lg text-[#EA4335]" />
        {loading ? "Conectando..." : "Continuar con Google"}
      </button>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}
