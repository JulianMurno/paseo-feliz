import type { BookingView } from "./types";

// Reservas de ejemplo (modo demo) para poblar los paneles cuando no hay BD.
export const demoBookings: BookingView[] = [
  {
    id: "b1",
    walkerId: "carlos-m",
    walkerName: "Carlos M.",
    walkerAvatar: "https://i.pravatar.cc/100?img=12",
    ownerId: "owner-lucia",
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
    walkerId: "valeria-s",
    walkerName: "Valeria S.",
    walkerAvatar: "https://i.pravatar.cc/100?img=47",
    ownerId: "owner-lucia",
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
    walkerId: "carlos-m",
    walkerName: "Carlos M.",
    walkerAvatar: "https://i.pravatar.cc/100?img=12",
    ownerId: "owner-diego",
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

export function ownerBookings(): BookingView[] {
  return demoBookings.filter((b) => b.ownerName === "Lucía Fernández");
}

export function walkerBookings(): BookingView[] {
  return demoBookings.filter((b) => b.walkerName === "Carlos M.");
}
