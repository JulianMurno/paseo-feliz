"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { updateWalkerProfile } from "@/app/dashboard/walker/actions";

export interface WalkerProfileData {
  bio: string;
  pricePerHour: number;
  city: string;
  neighborhood: string;
  experience: number;
  available: boolean;
  specialties: string[];
  latitude: number | null;
  longitude: number | null;
}

// Formulario para que el Walker edite su perfil (datos que ven los dueños).
export function WalkerProfileForm({
  initial,
  configured,
}: {
  initial: WalkerProfileData;
  configured: boolean;
}) {
  const [bio, setBio] = useState(initial.bio);
  const [price, setPrice] = useState(String(initial.pricePerHour || ""));
  const [city, setCity] = useState(initial.city);
  const [neighborhood, setNeighborhood] = useState(initial.neighborhood);
  const [experience, setExperience] = useState(String(initial.experience || ""));
  const [available, setAvailable] = useState(initial.available);
  const [specialties, setSpecialties] = useState(initial.specialties.join(", "));
  const [lat, setLat] = useState(initial.latitude != null ? String(initial.latitude) : "");
  const [lng, setLng] = useState(initial.longitude != null ? String(initial.longitude) : "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!configured) {
      setSaved(true);
      return;
    }
    startTransition(async () => {
      const res = await updateWalkerProfile({
        bio,
        pricePerHour: parseFloat(price) || 0,
        city,
        neighborhood,
        experience: parseInt(experience, 10) || 0,
        available,
        specialties: specialties.split(",").map((s) => s.trim()).filter(Boolean),
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
      });
      if (res.error) return setError(res.error);
      setSaved(true);
    });
  };

  const field = "w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  const label = "mb-1 block text-sm font-bold text-ink";

  return (
    <form onSubmit={save} className="card space-y-4 p-6">
      <div>
        <label className={label}>Sobre mí</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={`${field} resize-none`} placeholder="Cuenta tu experiencia con perros..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Precio por hora ($)</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Años de experiencia</label>
          <input type="number" min="0" value={experience} onChange={(e) => setExperience(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Ciudad</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Zona / Colonia</label>
          <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className={field} />
        </div>
      </div>

      <div>
        <label className={label}>Especialidades (separadas por comas)</label>
        <input value={specialties} onChange={(e) => setSpecialties(e.target.value)} className={field} placeholder="Razas grandes, Alta energía, Cachorros" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Latitud (opcional)</label>
          <input value={lat} onChange={(e) => setLat(e.target.value)} className={field} placeholder="19.4116" />
        </div>
        <div>
          <label className={label}>Longitud (opcional)</label>
          <input value={lng} onChange={(e) => setLng(e.target.value)} className={field} placeholder="-99.1707" />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/80">
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary" />
        Disponible para nuevos paseos
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <FontAwesomeIcon icon={faCircleCheck} /> Perfil guardado correctamente.
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        <FontAwesomeIcon icon={faFloppyDisk} />
        {pending ? "Guardando..." : "Guardar perfil"}
      </button>
    </form>
  );
}
