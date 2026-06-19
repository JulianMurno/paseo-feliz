"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faDog,
  faLocationDot,
  faNoteSticky,
  faCircleCheck,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import type { Walker } from "@/lib/types";

const durations = [20, 30, 45, 60, 90];

export function BookingForm({ walkers, initialWalkerId }: { walkers: Walker[]; initialWalkerId?: string }) {
  const [walkerId, setWalkerId] = useState(initialWalkerId ?? walkers[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(45);
  const [pet, setPet] = useState("Toby");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const walker = walkers.find((w) => w.id === walkerId);
  const estimate = walker ? Math.round((walker.pricePerHour * duration) / 60) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En modo demo solo mostramos confirmación. Con Supabase conectado, aquí
    // se crearía el Booking (status PENDING) que llega al walker seleccionado.
    setSubmitted(true);
  };

  if (submitted && walker) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
          <FontAwesomeIcon icon={faCircleCheck} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">
          ¡Solicitud enviada! 🐾
        </h2>
        <p className="mt-2 text-ink/70">
          Tu solicitud de paseo con <strong>{walker.name}</strong> está{" "}
          <strong>pendiente de confirmación</strong>. Te avisaremos en cuanto la
          acepte.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/owner" className="btn-primary">
            Ver mis reservas
          </Link>
          <button onClick={() => setSubmitted(false)} className="btn-outline">
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="card space-y-6 p-7">
        {/* Walker */}
        <Field label="Paseador" icon={faPaw}>
          <select
            value={walkerId}
            onChange={(e) => setWalkerId(e.target.value)}
            className="input"
            required
          >
            {walkers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} — {w.neighborhood} (${w.pricePerHour}/h)
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Fecha" icon={faCalendarDay}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Hora" icon={faClock}>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input"
              required
            />
          </Field>
        </div>

        {/* Duración */}
        <Field label="Duración" icon={faClock}>
          <div className="flex flex-wrap gap-2">
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  duration === d
                    ? "border-primary bg-primary text-white"
                    : "border-black/10 text-ink/70 hover:border-primary/40"
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Mascota" icon={faDog}>
            <select value={pet} onChange={(e) => setPet(e.target.value)} className="input">
              <option value="Toby">Toby (Labrador)</option>
              <option value="Otro">Otra mascota...</option>
            </select>
          </Field>
          <Field label="Ubicación de recogida" icon={faLocationDot}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Parque México, Condesa"
              className="input"
              required
            />
          </Field>
        </div>

        <Field label="Notas para el paseador" icon={faNoteSticky}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Cuéntale algo sobre tu perro: temperamento, indicaciones, etc."
            className="input resize-none"
          />
        </Field>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-ink">Resumen</h3>
          {walker && (
            <div className="mt-4 flex items-center gap-3 border-b border-black/5 pb-4">
              <Image
                src={walker.avatarUrl}
                alt={walker.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-ink">{walker.name}</p>
                <p className="text-sm text-ink/60">{walker.neighborhood}</p>
              </div>
            </div>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Duración" value={`${duration} min`} />
            <Row label="Tarifa" value={`$${walker?.pricePerHour ?? 0}/h`} />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
            <span className="font-bold text-ink">Estimado</span>
            <span className="font-display text-2xl font-extrabold text-primary">${estimate}</span>
          </div>
          <button type="submit" className="btn-primary mt-5 w-full">
            <FontAwesomeIcon icon={faCircleCheck} />
            Enviar solicitud
          </button>
          <p className="mt-3 text-center text-xs text-ink/50">
            La solicitud llega al paseador, que puede aceptarla o rechazarla.
          </p>
        </div>
      </aside>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(0,0,0,0.1);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #2E7D32;
          box-shadow: 0 0 0 3px rgba(46,125,50,0.15);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: typeof faPaw;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
        <FontAwesomeIcon icon={icon} className="text-primary" />
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-ink/70">
      <dt>{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
