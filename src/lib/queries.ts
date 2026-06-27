import "server-only";
import { prisma } from "./prisma";
import { isDatabaseConfigured } from "./db-config";
import {
  getWalkers as mockWalkers,
  getWalkerById as mockWalkerById,
  getFeaturedWalkers as mockFeatured,
} from "./data";
import { ownerBookings as mockOwnerBookings, walkerBookings as mockWalkerBookings } from "./bookings";
import type { BookingView, Review, Walker } from "./types";

const CDMX = { lat: 19.4326, lng: -99.1332 };

// ---- Mappers: Prisma -> tipos de vista ----

type PrismaWalkerFull = {
  id: string;
  bio: string | null;
  pricePerHour: number | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  neighborhood: string | null;
  experience: number | null;
  verified: boolean;
  available: boolean;
  specialties: string[];
  user: { name: string | null; avatarUrl: string | null };
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    owner: { user: { name: string | null; avatarUrl: string | null } };
  }[];
};

function mapReview(r: PrismaWalkerFull["reviews"][number]): Review {
  return {
    id: r.id,
    authorName: r.owner.user.name ?? "Usuario",
    authorAvatar: r.owner.user.avatarUrl ?? "https://i.pravatar.cc/150",
    rating: r.rating,
    comment: r.comment ?? "",
    createdAt: r.createdAt.toISOString(),
  };
}

function mapWalker(w: PrismaWalkerFull): Walker {
  const ratings = w.reviews.map((r) => r.rating);
  const rating =
    ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  return {
    id: w.id,
    name: w.user.name ?? "Paseador",
    avatarUrl: w.user.avatarUrl ?? "https://i.pravatar.cc/300",
    bio: w.bio ?? "Este paseador aún no completó su biografía.",
    city: w.city ?? "Ciudad de México",
    neighborhood: w.neighborhood ?? w.city ?? "Ciudad de México",
    pricePerHour: w.pricePerHour ?? 0,
    experience: w.experience ?? 0,
    verified: w.verified,
    available: w.available,
    specialties: w.specialties,
    latitude: w.latitude ?? CDMX.lat,
    longitude: w.longitude ?? CDMX.lng,
    rating,
    reviews: w.reviews.map(mapReview),
  };
}

const walkerInclude = {
  user: { select: { name: true, avatarUrl: true } },
  reviews: {
    orderBy: { createdAt: "desc" as const },
    include: { owner: { include: { user: { select: { name: true, avatarUrl: true } } } } },
  },
};

// ---- Walkers ----

export async function getWalkers(): Promise<Walker[]> {
  if (!isDatabaseConfigured) return mockWalkers();
  const rows = await prisma.walker.findMany({ include: walkerInclude });
  return rows.map((r) => mapWalker(r as unknown as PrismaWalkerFull));
}

export async function getWalkerById(id: string): Promise<Walker | null> {
  if (!isDatabaseConfigured) return mockWalkerById(id) ?? null;
  const row = await prisma.walker.findUnique({ where: { id }, include: walkerInclude });
  return row ? mapWalker(row as unknown as PrismaWalkerFull) : null;
}

export async function getFeaturedWalkers(limit = 4): Promise<Walker[]> {
  if (!isDatabaseConfigured) return mockFeatured(limit);
  const all = await getWalkers();
  return [...all].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

// ---- Bookings ----

type PrismaBookingFull = {
  id: string;
  date: Date;
  duration: number;
  location: string | null;
  notes: string | null;
  status: BookingView["status"];
  walkerId: string;
  ownerId: string;
  walker: { user: { name: string | null; avatarUrl: string | null } };
  owner: { user: { name: string | null; avatarUrl: string | null } };
  pet: { name: string; breed: string | null } | null;
};

function mapBooking(b: PrismaBookingFull): BookingView {
  return {
    id: b.id,
    walkerId: b.walkerId,
    walkerName: b.walker.user.name ?? "Paseador",
    walkerAvatar: b.walker.user.avatarUrl ?? "https://i.pravatar.cc/100",
    ownerId: b.ownerId,
    ownerName: b.owner.user.name ?? "Dueño",
    ownerAvatar: b.owner.user.avatarUrl ?? "https://i.pravatar.cc/100",
    petName: b.pet?.name ?? "Mascota",
    petBreed: b.pet?.breed ?? "—",
    date: b.date.toISOString(),
    duration: b.duration,
    location: b.location ?? "",
    notes: b.notes ?? undefined,
    status: b.status,
  };
}

const bookingInclude = {
  walker: { include: { user: { select: { name: true, avatarUrl: true } } } },
  owner: { include: { user: { select: { name: true, avatarUrl: true } } } },
  pet: { select: { name: true, breed: true } },
};

export async function getOwnerBookings(ownerId: string): Promise<BookingView[]> {
  if (!isDatabaseConfigured) return mockOwnerBookings();
  const rows = await prisma.booking.findMany({
    where: { ownerId },
    orderBy: { date: "desc" },
    include: bookingInclude,
  });
  return rows.map((r) => mapBooking(r as unknown as PrismaBookingFull));
}

export async function getWalkerBookings(walkerId: string): Promise<BookingView[]> {
  if (!isDatabaseConfigured) return mockWalkerBookings();
  const rows = await prisma.booking.findMany({
    where: { walkerId },
    orderBy: { date: "desc" },
    include: bookingInclude,
  });
  return rows.map((r) => mapBooking(r as unknown as PrismaBookingFull));
}
