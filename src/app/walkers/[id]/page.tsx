import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCircleCheck,
  faBriefcase,
  faPaw,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { getWalkerById } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewList } from "@/components/walkers/ReviewList";
import { ReviewForm } from "@/components/walkers/ReviewForm";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const walker = await getWalkerById(params.id);
  return {
    title: walker ? `${walker.name} | Paseo Feliz` : "Paseador | Paseo Feliz",
  };
}

export default async function WalkerDetailPage({ params }: { params: { id: string } }) {
  const walker = await getWalkerById(params.id);
  if (!walker) notFound();

  const user = await getSessionUser();
  const canReview = user?.role === "OWNER";

  return (
    <div className="container-px py-10">
      <Link href="/walkers" className="text-sm font-semibold text-primary hover:underline">
        ← Volver a paseadores
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Columna principal */}
        <div>
          <div className="card overflow-hidden">
            <div className="relative h-64 w-full sm:h-80">
              <Image
                src={walker.avatarUrl}
                alt={walker.name}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold text-ink">
                    {walker.name}
                    {walker.verified && (
                      <FontAwesomeIcon icon={faCircleCheck} className="text-primary" title="Verificado" />
                    )}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-ink/60">
                    <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
                    {walker.neighborhood}, {walker.city}
                  </p>
                </div>
                <StarRating rating={walker.rating} size="lg" reviewsCount={walker.reviews.length} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-ink/70">
                <span className="chip">
                  <FontAwesomeIcon icon={faBriefcase} />
                  {walker.experience} años de experiencia
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    walker.available ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${walker.available ? "bg-primary" : "bg-gray-400"}`} />
                  {walker.available ? "Disponible ahora" : "No disponible"}
                </span>
              </div>

              <h2 className="mt-7 font-display text-lg font-bold text-ink">Sobre mí</h2>
              <p className="mt-2 leading-relaxed text-ink/75">{walker.bio}</p>

              <h2 className="mt-7 font-display text-lg font-bold text-ink">Especialidades</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {walker.specialties.map((s) => (
                  <span key={s} className="chip">
                    <FontAwesomeIcon icon={faPaw} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reseñas */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-ink">
                Reseñas ({walker.reviews.length})
              </h2>
              <StarRating rating={walker.rating} size="md" />
            </div>
            {canReview && (
              <div className="mt-5">
                <ReviewForm walkerId={walker.id} />
              </div>
            )}
            <div className="mt-5">
              <ReviewList reviews={walker.reviews} />
            </div>
          </section>
        </div>

        {/* Sidebar de reserva */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-ink">
              <span className="font-display text-3xl font-extrabold text-primary">
                ${walker.pricePerHour}
              </span>
              <span className="text-ink/50"> /hora</span>
            </p>
            <Link
              href={`/booking/new?walker=${walker.id}`}
              className="btn-primary mt-5 w-full"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              Reservar paseo
            </Link>
            <p className="mt-3 text-center text-xs text-ink/50">
              No se te cobrará hasta que {walker.name} acepte la reserva.
            </p>

            <ul className="mt-6 space-y-3 border-t border-black/5 pt-6 text-sm text-ink/70">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-primary" />
                Identidad verificada
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
                Rastreo GPS durante el paseo
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPaw} className="text-primary" />
                Fotos y reporte al finalizar
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
