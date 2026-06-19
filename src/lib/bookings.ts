import type { BookingStatus } from "./types";

// Reservas de ejemplo (modo demo) para poblar los paneles.
export interface DemoBooking {
  id: string;
  walkerName: string;
  walkerAvatar: string;
  ownerName: string;
  ownerAvatar: string;
  petName: string;
  petBreed: string;
  date: string; // ISO
  duration: number; // minutos
  location: string;
  notes?: string;
  status: BookingStatus;
}

export const demoBookings: DemoBooking[] = [
  {
    id: "b1",
    walkerName: "Carlos M.",
    walkerAvatar: "https://i.pravatar.cc/100?img=12",
    ownerName: "Lucía Fernández",
    ownerAvatar: "https://i.pravatar.cc/100?img=45",
    petName: "Toby",
    petBreed: "Labrador",
    date: "2026-06-20T09:00:00Z",
    duration: 45,
    location: "Parque México, Condesa",
    notes: "Toby es muy sociable, le encanta correr.",
    status: "PENDING",
  },
  {
    id: "b2",
    walkerName: "Valeria S.",
    walkerAvatar: "https://i.pravatar.cc/100?img=47",
    ownerName: "Lucía Fernández",
    ownerAvatar: "https://i.pravatar.cc/100?img=45",
    petName: "Toby",
    petBreed: "Labrador",
    date: "2026-06-18T17:30:00Z",
    duration: 60,
    location: "Av. Ámsterdam, Hipódromo",
    status: "ACCEPTED",
  },
  {
    id: "b3",
    walkerName: "Carlos M.",
    walkerAvatar: "https://i.pravatar.cc/100?img=12",
    ownerName: "Diego Ramírez",
    ownerAvatar: "https://i.pravatar.cc/100?img=33",
    petName: "Rocco",
    petBreed: "Pastor Alemán",
    date: "2026-06-12T08:00:00Z",
    duration: 45,
    location: "Bosque de Chapultepec",
    status: "COMPLETED",
  },
];

export function ownerBookings(): DemoBooking[] {
  return demoBookings.filter((b) => b.ownerName === "Lucía Fernández");
}

export function walkerBookings(): DemoBooking[] {
  return demoBookings.filter((b) => b.walkerName === "Carlos M.");
}
