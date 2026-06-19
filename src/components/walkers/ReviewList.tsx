import Image from "next/image";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl bg-primary/5 p-6 text-ink/60">
        Este paseador aún no tiene reseñas. ¡Sé el primero en dejar una! 🐾
      </p>
    );
  }

  return (
    <ul className="space-y-5">
      {reviews.map((r) => (
        <li key={r.id} className="card p-6">
          <div className="flex items-start gap-4">
            <Image
              src={r.authorAvatar}
              alt={r.authorName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-ink">{r.authorName}</p>
                  {r.dogName && (
                    <p className="text-sm text-ink/50">
                      Dueño de {r.dogName}
                      {r.dogBreed ? ` · ${r.dogBreed}` : ""}
                    </p>
                  )}
                </div>
                <StarRating rating={r.rating} showValue={false} size="sm" />
              </div>
              <p className="mt-3 text-ink/80">{r.comment}</p>
              <p className="mt-2 text-xs text-ink/40">{formatDate(r.createdAt)}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
