"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationCrosshairs,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { WalkerCard } from "./WalkerCard";
import { WalkersMap } from "./WalkersMap";
import { haversineKm, type LatLng } from "@/lib/geo";
import type { Walker } from "@/lib/types";

type SortKey = "rating" | "price" | "proximity";

export function WalkersExplorer({ walkers }: { walkers: Walker[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSort("proximity");
        setLocating(false);
      },
      () => {
        // Fallback: usa el centro de CDMX como ubicación demo.
        setUserLocation({ lat: 19.4326, lng: -99.1332 });
        setSort("proximity");
        setLocating(false);
      },
      { timeout: 8000 },
    );
  };

  const filtered = useMemo(() => {
    let list = walkers.filter((w) => {
      const q = query.toLowerCase();
      const matches =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.neighborhood.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        w.specialties.some((s) => s.toLowerCase().includes(q));
      return matches && (!onlyAvailable || w.available);
    });

    list = [...list].sort((a, b) => {
      if (sort === "price") return a.pricePerHour - b.pricePerHour;
      if (sort === "proximity" && userLocation) {
        const da = haversineKm(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
        const db = haversineKm(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
        return da - db;
      }
      return b.rating - a.rating;
    });
    return list;
  }, [walkers, query, sort, onlyAvailable, userLocation]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      {/* Columna izquierda: filtros + tarjetas */}
      <div>
        {/* Controles */}
        <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, zona o especialidad..."
              className="w-full rounded-full border border-black/10 py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSliders} className="text-ink/40" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-black/10 py-2.5 pl-3 pr-8 text-sm font-semibold focus:border-primary focus:outline-none"
            >
              <option value="rating">Mejor valorados</option>
              <option value="price">Menor precio</option>
              <option value="proximity">Más cercanos</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={requestLocation} className="btn-outline px-4 py-2 text-xs" disabled={locating}>
            <FontAwesomeIcon icon={faLocationCrosshairs} />
            {locating ? "Localizando..." : "Usar mi ubicación"}
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/70">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
            />
            Solo disponibles ahora
          </label>
          <span className="ml-auto text-sm text-ink/50">
            {filtered.length} paseador{filtered.length !== 1 ? "es" : ""}
          </span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {filtered.map((w) => {
            const dist =
              userLocation &&
              haversineKm(userLocation.lat, userLocation.lng, w.latitude, w.longitude);
            return (
              <div
                key={w.id}
                onMouseEnter={() => setSelectedId(w.id)}
                className={selectedId === w.id ? "rounded-2xl ring-2 ring-primary/40" : ""}
              >
                <WalkerCard walker={w} />
                {dist != null && (
                  <p className="mt-1.5 text-center text-xs font-semibold text-primary">
                    📍 a {dist.toFixed(1)} km de ti
                  </p>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-2xl bg-primary/5 p-8 text-center text-ink/60">
              No encontramos paseadores con esos filtros. Prueba con otra
              búsqueda. 🐾
            </p>
          )}
        </div>
      </div>

      {/* Columna derecha: mapa sticky */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <WalkersMap
          walkers={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          userLocation={userLocation}
        />
        <p className="mt-3 text-center text-xs text-ink/50">
          Haz clic en un 🐾 para resaltar al paseador. Activa tu ubicación para
          ordenar por cercanía.
        </p>
      </div>
    </div>
  );
}
