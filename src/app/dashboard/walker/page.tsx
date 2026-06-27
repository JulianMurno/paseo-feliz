import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faStar, faSackDollar, faToggleOn, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { getSessionUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isDatabaseConfigured } from "@/lib/db-config";
import { getCurrentWalker } from "@/lib/identity";
import { getWalkerBookings } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingRow } from "@/components/dashboard/BookingRow";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";
import { WalkerProfileForm, type WalkerProfileData } from "@/components/dashboard/WalkerProfileForm";

export const metadata: Metadata = { title: "Panel del paseador | Paseo Feliz" };

const demoProfile: WalkerProfileData = {
  bio: "Educador canino con +6 años de experiencia.",
  pricePerHour: 150,
  city: "Ciudad de México",
  neighborhood: "Condesa",
  experience: 6,
  available: true,
  specialties: ["Razas grandes", "Alta energía"],
  latitude: 19.4116,
  longitude: -99.1707,
};

export default async function WalkerDashboard() {
  const user = await getSessionUser();

  if (isSupabaseConfigured) {
    if (!user) redirect("/login");
    if (!user.role) redirect("/onboarding");
    if (user.role === "OWNER") redirect("/dashboard/owner");
  }

  let bookings = await getWalkerBookings("");
  let profile = demoProfile;
  let avgRating = "4.9";
  let earned = "$3,450";

  if (isDatabaseConfigured) {
    const walker = await getCurrentWalker();
    if (walker) {
      bookings = await getWalkerBookings(walker.id);
      profile = {
        bio: walker.bio ?? "",
        pricePerHour: walker.pricePerHour ?? 0,
        city: walker.city ?? "",
        neighborhood: walker.neighborhood ?? "",
        experience: walker.experience ?? 0,
        available: walker.available,
        specialties: walker.specialties,
        latitude: walker.latitude,
        longitude: walker.longitude,
      };
      const agg = await prisma.review.aggregate({
        where: { walkerId: walker.id },
        _avg: { rating: true },
      });
      avgRating = agg._avg.rating ? agg._avg.rating.toFixed(1) : "—";
      const completed = bookings.filter((b) => b.status === "COMPLETED").length;
      earned = `$${completed * 150}`;
    } else {
      bookings = [];
    }
  }

  const pending = bookings.filter((b) => b.status === "PENDING");
  const others = bookings.filter((b) => b.status !== "PENDING");

  return (
    <div className="container-px py-10">
      {!isDatabaseConfigured && <DemoBanner />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">Panel del paseador</span>
          <h1 className="section-title mt-3">Hola, {user?.name ?? "Carlos"} 👋</h1>
          <p className="mt-1 text-ink/60">Revisa las solicitudes de paseo y gestiona tu agenda.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
          <FontAwesomeIcon icon={faToggleOn} />
          {profile.available ? "Disponible" : "No disponible"}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={faInbox} value={pending.length} label="Solicitudes nuevas" />
        <StatCard icon={faStar} value={avgRating} label="Valoración media" />
        <StatCard icon={faSackDollar} value={earned} label="Ganado (estimado)" />
      </div>

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

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <FontAwesomeIcon icon={faUserPen} className="text-primary" />
          Mi perfil público
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Esta información es la que ven los dueños en el listado y en tu perfil.
        </p>
        <div className="mt-4 max-w-2xl">
          <WalkerProfileForm initial={profile} configured={isDatabaseConfigured} />
        </div>
      </section>

      <DeleteAccountButton />
    </div>
  );
}
