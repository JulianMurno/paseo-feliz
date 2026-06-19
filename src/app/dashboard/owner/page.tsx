import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faDog,
  faStar,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { ownerBookings } from "@/lib/bookings";
import { getSessionUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingRow } from "@/components/dashboard/BookingRow";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";

export const metadata: Metadata = { title: "Panel del dueño | Paseo Feliz" };

const pets = [
  { name: "Toby", breed: "Labrador", img: "https://i.pravatar.cc/100?img=64" },
];

export default async function OwnerDashboard() {
  const user = await getSessionUser();

  // Con Supabase activo, exige sesión y rol elegido.
  if (isSupabaseConfigured) {
    if (!user) redirect("/login");
    if (!user.role) redirect("/onboarding");
    if (user.role === "WALKER") redirect("/dashboard/walker");
  }

  const bookings = ownerBookings();
  const active = bookings.filter((b) => b.status === "PENDING" || b.status === "ACCEPTED").length;

  return (
    <div className="container-px py-10">
      {!user && <DemoBanner />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">Panel del dueño</span>
          <h1 className="section-title mt-3">
            Hola, {user?.name ?? "Lucía"} 👋
          </h1>
          <p className="mt-1 text-ink/60">Gestiona tus paseos, mascotas y reseñas.</p>
        </div>
        <Link href="/booking/new" className="btn-primary">
          <FontAwesomeIcon icon={faPlus} />
          Nueva reserva
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={faCalendarCheck} value={active} label="Paseos activos" />
        <StatCard icon={faDog} value={pets.length} label="Mascotas" />
        <StatCard icon={faStar} value={2} label="Reseñas escritas" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Reservas */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Mis reservas</h2>
          <div className="mt-4 space-y-4">
            {bookings.map((b) => (
              <BookingRow key={b.id} booking={b} perspective="owner" />
            ))}
            {bookings.length === 0 && (
              <p className="card p-8 text-center text-ink/60">
                Aún no tienes reservas.{" "}
                <Link href="/walkers" className="font-semibold text-primary">
                  Encuentra un paseador
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        {/* Mascotas */}
        <aside>
          <h2 className="font-display text-xl font-bold text-ink">Mis mascotas</h2>
          <div className="mt-4 space-y-3">
            {pets.map((p) => (
              <div key={p.name} className="card flex items-center gap-3 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-ink">{p.name}</p>
                  <p className="text-sm text-ink/60">{p.breed}</p>
                </div>
              </div>
            ))}
            <button className="btn-outline w-full">
              <FontAwesomeIcon icon={faPlus} />
              Añadir mascota
            </button>
          </div>
        </aside>
      </div>

      <DeleteAccountButton />
    </div>
  );
}
