"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocationDot,
  faDog,
  faCheck,
  faXmark,
  faFlagCheckered,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { updateBookingStatus, cancelBooking } from "@/app/booking/actions";
import type { BookingView, BookingStatus } from "@/lib/types";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Fila de reserva con acciones reales (persisten en BD) y fallback demo.
export function BookingRow({
  booking,
  perspective,
}: {
  booking: BookingView;
  perspective: "owner" | "walker";
}) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const person =
    perspective === "owner"
      ? { name: booking.walkerName, avatar: booking.walkerAvatar, label: "Paseador" }
      : { name: booking.ownerName, avatar: booking.ownerAvatar, label: "Dueño" };

  const run = (next: BookingStatus, fn: () => Promise<{ error?: string; demo?: boolean }>) => {
    setError(null);
    const prev = status;
    setStatus(next); // optimista
    startTransition(async () => {
      const res = await fn();
      if (res?.error) {
        setStatus(prev); // revertir
        setError(res.error);
      }
    });
  };

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={person.avatar}
            alt={person.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
              {person.label}
            </p>
            <p className="font-bold text-ink">{person.name}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-primary" />
          {formatDateTime(booking.date)} · {booking.duration} min
        </p>
        <p className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDog} className="text-primary" />
          {booking.petName} · {booking.petBreed}
        </p>
        <p className="flex items-center gap-2 sm:col-span-2">
          <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
          {booking.location}
        </p>
      </div>

      {booking.notes && (
        <p className="mt-3 rounded-lg bg-primary/5 p-3 text-sm text-ink/70">
          “{booking.notes}”
        </p>
      )}

      {/* Acciones del Walker */}
      {perspective === "walker" && status === "PENDING" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => run("ACCEPTED", () => updateBookingStatus(booking.id, "ACCEPTED"))}
            disabled={pending}
            className="btn-primary px-4 py-2 text-xs"
          >
            <FontAwesomeIcon icon={faCheck} />
            Aceptar
          </button>
          <button
            onClick={() => run("REJECTED", () => updateBookingStatus(booking.id, "REJECTED"))}
            disabled={pending}
            className="btn border-2 border-red-200 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
          >
            <FontAwesomeIcon icon={faXmark} />
            Rechazar
          </button>
        </div>
      )}
      {perspective === "walker" && status === "ACCEPTED" && (
        <div className="mt-4">
          <button
            onClick={() => run("COMPLETED", () => updateBookingStatus(booking.id, "COMPLETED"))}
            disabled={pending}
            className="btn-outline px-4 py-2 text-xs"
          >
            <FontAwesomeIcon icon={faFlagCheckered} />
            Marcar como completada
          </button>
        </div>
      )}

      {/* Acción del Owner: cancelar */}
      {perspective === "owner" && (status === "PENDING" || status === "ACCEPTED") && (
        <div className="mt-4">
          <button
            onClick={() => run("CANCELLED", () => cancelBooking(booking.id))}
            disabled={pending}
            className="btn border-2 border-red-200 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
          >
            <FontAwesomeIcon icon={faBan} />
            Cancelar reserva
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
