"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-config";
import { getCurrentOwner, getCurrentWalker } from "@/lib/identity";
import type { BookingStatus } from "@/lib/types";

export interface CreateBookingInput {
  walkerId: string;
  petId?: string | null;
  date: string; // ISO
  duration: number;
  location: string;
  notes?: string;
}

export interface ActionResult {
  ok?: boolean;
  demo?: boolean;
  error?: string;
}

// CREATE — un Owner crea una reserva (estado PENDING) para un Walker.
export async function createBooking(input: CreateBookingInput): Promise<ActionResult> {
  if (!isDatabaseConfigured) return { demo: true };

  const owner = await getCurrentOwner();
  if (!owner) return { error: "Debes iniciar sesión como dueño para reservar." };

  if (!input.walkerId || !input.date || !input.duration) {
    return { error: "Faltan datos de la reserva." };
  }

  try {
    await prisma.booking.create({
      data: {
        ownerId: owner.id,
        walkerId: input.walkerId,
        petId: input.petId || null,
        date: new Date(input.date),
        duration: input.duration,
        location: input.location,
        notes: input.notes,
        status: "PENDING",
      },
    });
    revalidatePath("/dashboard/owner");
    revalidatePath("/dashboard/walker");
    return { ok: true };
  } catch (err) {
    console.error("[createBooking]", err);
    return { error: "No se pudo crear la reserva." };
  }
}

// UPDATE — el Walker dueño de la reserva cambia su estado.
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<ActionResult> {
  if (!isDatabaseConfigured) return { demo: true };

  const walker = await getCurrentWalker();
  if (!walker) return { error: "No autorizado." };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.walkerId !== walker.id) {
    return { error: "Reserva no encontrada o no autorizada." };
  }

  try {
    await prisma.booking.update({ where: { id: bookingId }, data: { status } });
    revalidatePath("/dashboard/walker");
    revalidatePath("/dashboard/owner");
    return { ok: true };
  } catch (err) {
    console.error("[updateBookingStatus]", err);
    return { error: "No se pudo actualizar la reserva." };
  }
}

// UPDATE (cancelar) — el Owner cancela su propia reserva.
export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  if (!isDatabaseConfigured) return { demo: true };

  const owner = await getCurrentOwner();
  if (!owner) return { error: "No autorizado." };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.ownerId !== owner.id) {
    return { error: "Reserva no encontrada o no autorizada." };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    revalidatePath("/dashboard/owner");
    revalidatePath("/dashboard/walker");
    return { ok: true };
  } catch (err) {
    console.error("[cancelBooking]", err);
    return { error: "No se pudo cancelar la reserva." };
  }
}
