import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faDog, faStar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getSessionUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isDatabaseConfigured } from "@/lib/db-config";
import { getCurrentOwner } from "@/lib/identity";
import { getOwnerBookings } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingRow } from "@/components/dashboard/BookingRow";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";
import { PetsManager, type Pet } from "@/components/dashboard/PetsManager";

export const metadata: Metadata = { title: "Panel del dueño | Paseo Feliz" };

export default async function OwnerDashboard() {
  const user = await getSessionUser();

  if (isSupabaseConfigured) {
    if (!user) redirect("/login");
    if (!user.role) redirect("/onboarding");
    if (user.role === "WALKER") redirect("/dashboard/walker");
  }

  // Datos reales (o demo si no hay BD).
  let bookings = await getOwnerBookings("");
  let pets: Pet[] = [{ id: "demo-toby", name: "Toby", breed: "Labrador" }];
  let reviewsCount = 2;

  if (isDatabaseConfigured) {
    const owner = await getCurrentOwner();
    if (owner) {
      bookings = await getOwnerBookings(owner.id);
      const dbPets = await prisma.pet.findMany({ where: { ownerId: owner.id } });
      pets = dbPets.map((p) => ({ id: p.id, name: p.name, breed: p.breed ?? "" }));
      reviewsCount = await prisma.review.count({ where: { ownerId: owner.id } });
    } else {
      bookings = [];
      pets = [];
      reviewsCount = 0;
    }
  }

  const active = bookings.filter((b) => b.status === "PENDING" || b.status === "ACCEPTED").length;

  return (
    <div className="container-px py-10">
      {!isDatabaseConfigured && <DemoBanner />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">Panel del dueño</span>
          <h1 className="section-title mt-3">Hola, {user?.name ?? "Lucía"} 👋</h1>
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
        <StatCard icon={faStar} value={reviewsCount} label="Reseñas escritas" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
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

        <aside>
          <h2 className="font-display text-xl font-bold text-ink">Mis mascotas</h2>
          <PetsManager pets={pets} configured={isDatabaseConfigured} />
        </aside>
      </div>

      <DeleteAccountButton />
    </div>
  );
}
