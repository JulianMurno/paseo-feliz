"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { projectToPercent, type LatLng } from "@/lib/geo";
import type { Walker } from "@/lib/types";

interface Props {
  walkers: Walker[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation: LatLng | null;
}

// Mapa interactivo personalizado (sin claves de API). Proyecta a los paseadores
// sobre un lienzo con cuadrícula estilo mapa. Si configuras Mapbox/Google,
// puedes sustituir este componente por el mapa real.
export function WalkersMap({ walkers, selectedId, onSelect, userLocation }: Props) {
  const points: LatLng[] = walkers.map((w) => ({ lat: w.latitude, lng: w.longitude }));
  if (userLocation) points.push(userLocation);

  const bounds = {
    minLat: Math.min(...points.map((p) => p.lat)),
    maxLat: Math.max(...points.map((p) => p.lat)),
    minLng: Math.min(...points.map((p) => p.lng)),
    maxLng: Math.max(...points.map((p) => p.lng)),
  };

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl border border-black/5 bg-[#eaf3ea]">
      {/* Cuadrícula tipo mapa */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(#cfe3cf 1px, transparent 1px), linear-gradient(90deg, #cfe3cf 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* "Calles" decorativas */}
      <div className="absolute inset-x-0 top-1/3 h-2 bg-white/70" />
      <div className="absolute inset-y-0 left-1/2 w-2 bg-white/70" />
      <div className="absolute inset-x-0 top-2/3 h-1.5 bg-white/50" />

      {/* Marcador de usuario */}
      {userLocation && (
        <Marker
          pos={projectToPercent(userLocation, bounds)}
          label="Tú"
          variant="user"
        />
      )}

      {/* Marcadores de paseadores */}
      {walkers.map((w) => (
        <Marker
          key={w.id}
          pos={projectToPercent({ lat: w.latitude, lng: w.longitude }, bounds)}
          label={w.name}
          variant={selectedId === w.id ? "selected" : "walker"}
          onClick={() => onSelect(w.id)}
        />
      ))}

      <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink/70 shadow-sm">
        🐾 {walkers.length} paseadores en el mapa
      </div>
    </div>
  );
}

function Marker({
  pos,
  label,
  variant,
  onClick,
}: {
  pos: { x: number; y: number };
  label: string;
  variant: "walker" | "selected" | "user";
  onClick?: () => void;
}) {
  const base =
    "absolute -translate-x-1/2 -translate-y-full flex flex-col items-center transition-transform";
  const isUser = variant === "user";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variant === "selected" ? "z-20 scale-110" : "z-10 hover:scale-110"}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label={label}
    >
      <span className="mb-1 max-w-[90px] truncate rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm">
        {label}
      </span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md ${
          isUser
            ? "bg-blue-500"
            : variant === "selected"
              ? "bg-primary-dark ring-4 ring-primary/30"
              : "bg-primary"
        }`}
      >
        <FontAwesomeIcon icon={isUser ? faLocationCrosshairs : faPaw} className="text-sm" />
      </span>
    </button>
  );
}
