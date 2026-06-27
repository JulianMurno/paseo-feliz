"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faPaperPlane, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { createReview } from "@/app/walkers/actions";

// Formulario para que un Owner deje una reseña a un Walker.
export function ReviewForm({ walkerId }: { walkerId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Selecciona una calificación.");
      return;
    }
    startTransition(async () => {
      const res = await createReview(walkerId, rating, comment);
      if (res.error) return setError(res.error);
      setDone(true);
    });
  };

  if (done) {
    return (
      <div className="card flex items-center gap-3 p-5 text-primary">
        <FontAwesomeIcon icon={faCircleCheck} />
        <p className="font-semibold">¡Gracias! Tu reseña se publicó correctamente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <h3 className="font-display text-lg font-bold text-ink">Deja tu reseña</h3>

      <div className="mt-3 flex items-center gap-1 text-2xl text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const filled = (hover || rating) >= value;
          return (
            <button
              key={value}
              type="button"
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(value)}
              aria-label={`${value} estrellas`}
            >
              <FontAwesomeIcon icon={filled ? faStarSolid : faStarRegular} />
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Cuéntanos cómo fue tu experiencia..."
        className="mt-4 w-full resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pending} className="btn-primary mt-4">
        <FontAwesomeIcon icon={faPaperPlane} />
        {pending ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
}
