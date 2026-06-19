"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog, faPersonWalking, faCheck } from "@fortawesome/free-solid-svg-icons";
import { completeOnboarding } from "@/app/onboarding/actions";
import type { Role } from "@/lib/types";

const options: {
  role: Role;
  icon: typeof faDog;
  title: string;
  desc: string;
  perks: string[];
}[] = [
  {
    role: "OWNER",
    icon: faDog,
    title: "Soy dueño de perro",
    desc: "Busco paseadores de confianza para mi mascota.",
    perks: ["Reservar paseos", "Seguir el paseo por GPS", "Dejar reseñas"],
  },
  {
    role: "WALKER",
    icon: faPersonWalking,
    title: "Soy paseador",
    desc: "Quiero ofrecer mis servicios y ganar dinero paseando perros.",
    perks: ["Recibir solicitudes", "Gestionar tu agenda", "Construir tu reputación"],
  },
];

export function RoleSelector({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);

    if (configured) {
      // Persiste el rol en Supabase + base de datos vía Server Action.
      // En caso de éxito, la acción hace redirect en el servidor.
      const result = await completeOnboarding(selected);
      if (result?.error) {
        setError(
          result.error === "demo"
            ? "Configura Supabase para guardar tu cuenta."
            : result.error,
        );
        setLoading(false);
        return;
      }
    }

    // Modo demo (o fallback): navegación en el cliente.
    const dest = selected === "WALKER" ? "/dashboard/walker" : "/dashboard/owner";
    router.push(dest);
    router.refresh();
  };

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        {options.map((o) => {
          const active = selected === o.role;
          return (
            <button
              key={o.role}
              onClick={() => setSelected(o.role)}
              className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                active
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-black/10 bg-white hover:border-primary/40"
              }`}
            >
              {active && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
              )}
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                <FontAwesomeIcon icon={o.icon} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{o.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{o.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {o.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-ink/70">
                    <FontAwesomeIcon icon={faCheck} className="text-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <button
        onClick={confirm}
        disabled={!selected || loading}
        className="btn-primary mt-8 w-full"
      >
        {loading ? "Configurando tu cuenta..." : "Continuar"}
      </button>

      {error && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">
          {error}
        </p>
      )}
    </div>
  );
}
