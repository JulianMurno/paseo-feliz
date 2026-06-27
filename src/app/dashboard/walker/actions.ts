"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-config";
import { getCurrentWalker } from "@/lib/identity";

export interface WalkerProfileInput {
  bio: string;
  pricePerHour: number;
  city: string;
  neighborhood: string;
  experience: number;
  available: boolean;
  specialties: string[];
  latitude?: number | null;
  longitude?: number | null;
}

export interface ProfileResult {
  ok?: boolean;
  demo?: boolean;
  error?: string;
}

// UPDATE — el Walker edita su propio perfil.
export async function updateWalkerProfile(input: WalkerProfileInput): Promise<ProfileResult> {
  if (!isDatabaseConfigured) return { demo: true };

  const walker = await getCurrentWalker();
  if (!walker) return { error: "No autorizado." };

  try {
    await prisma.walker.update({
      where: { id: walker.id },
      data: {
        bio: input.bio.trim() || null,
        pricePerHour: Number.isFinite(input.pricePerHour) ? input.pricePerHour : null,
        city: input.city.trim() || null,
        neighborhood: input.neighborhood.trim() || null,
        experience: Number.isFinite(input.experience) ? input.experience : null,
        available: input.available,
        specialties: input.specialties.filter(Boolean),
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
      },
    });
    revalidatePath("/dashboard/walker");
    revalidatePath("/walkers");
    revalidatePath(`/walkers/${walker.id}`);
    return { ok: true };
  } catch (err) {
    console.error("[updateWalkerProfile]", err);
    return { error: "No se pudo guardar el perfil." };
  }
}
