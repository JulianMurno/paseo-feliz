import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCircleCheck,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { StarRating } from "@/components/ui/StarRating";
import type { Walker } from "@/lib/types";

// Tarjeta de perfil de paseador reutilizable.
export function WalkerCard({ walker }: { walker: Walker }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative h-52 w-full">
        <Image
          src={walker.avatarUrl}
          alt={walker.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {walker.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-primary shadow-sm">
              <FontAwesomeIcon icon={faCircleCheck} />
              Verificado
            </span>
          )}
        </div>
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
            walker.available
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${walker.available ? "bg-white" : "bg-gray-500"}`} />
          {walker.available ? "Disponible" : "Ocupado"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-ink">{walker.name}</h3>
          <StarRating rating={walker.rating} size="sm" reviewsCount={walker.reviews.length} />
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
          <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
          {walker.neighborhood}, {walker.city}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
          <FontAwesomeIcon icon={faBriefcase} className="text-primary" />
          {walker.experience} años de experiencia
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {walker.specialties.slice(0, 2).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-ink">
            <span className="font-display text-xl font-extrabold text-primary">
              ${walker.pricePerHour}
            </span>
            <span className="text-sm text-ink/50"> /hora</span>
          </p>
          <Link href={`/walkers/${walker.id}`} className="btn-outline px-5 py-2.5">
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
