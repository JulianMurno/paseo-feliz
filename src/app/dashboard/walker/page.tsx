import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInbox,
  faStar,
  faSackDollar,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";
import { walkerBookings } from "@/lib/bookings";
import { getSessionUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingRow } from "@/components/dashboard/BookingRow";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";

export const metadata: Metadata = { title: "Panel del paseador | Paseo Feliz" };

export default async function WalkerDashboard() {
  const user = await getSessionUser();

  // Con Supabase activo, exige sesión y rol elegido.
  if (isSupabaseConfigured) {
    if (!user) redirect("/login");
    if (!user.role) redirect("/onboarding");
    if (user.role === "OWNER") redirect("/dashboard/owner");
  }

  const bookings = walkerBookings();
  const pending = bookings.filter((b) => b.status === "PENDING");
  const others = bookings.filter((b) => b.status !== "PENDING");

  return (
    <div className="container-px py-10">
      {!user && <DemoBanner />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">Panel del paseador</span>
          <h1 className="section-title mt-3">Hola, {user?.name ?? "Carlos"} 👋</h1>
          <p className="mt-1 text-ink/60">
            Revisa las solicitudes de paseo y gestiona tu agenda.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
          <FontAwesomeIcon icon={faToggleOn} />
          Disponible
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={faInbox} value={pending.length} label="Solicitudes nuevas" />
        <StatCard icon={faStar} value="4.9" label="Valoración media" />
        <StatCard icon={faSackDollar} value="$3,450" label="Ganado este mes" />
      </div>

      {/* Solicitudes pendientes */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <FontAwesomeIcon icon={faInbox} className="text-primary" />
          Solicitudes pendientes
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {pending.map((b) => (
            <BookingRow key={b.id} booking={b} perspective="walker" />
          ))}
          {pending.length === 0 && (
            <p className="card p-8 text-center text-ink/60">
              No tienes solicitudes nuevas. ¡Te avisaremos cuando llegue una! 🐾
            </p>
          )}
        </div>
      </section>

      {/* Historial */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-ink">Historial de paseos</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {others.map((b) => (
            <BookingRow key={b.id} booking={b} perspective="walker" />
          ))}
          {others.length === 0 && (
            <p className="card p-8 text-center text-ink/60">Todavía no hay historial.</p>
          )}
        </div>
      </section>

      <DeleteAccountButton />
    </div>
  );
}
