"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-config";
import { getCurrentOwner } from "@/lib/identity";

export interface ReviewResult {
  ok?: boolean;
  demo?: boolean;
  error?: string;
}

// CREATE — un Owner deja una reseña (1-5) a un Walker.
export async function createReview(
  walkerId: string,
  rating: number,
  comment: string,
): Promise<ReviewResult> {
  if (!isDatabaseConfigured) return { demo: true };

  const owner = await getCurrentOwner();
  if (!owner) return { error: "Inicia sesión como dueño para dejar una reseña." };

  if (!walkerId || rating < 1 || rating > 5) {
    return { error: "La calificación debe ser de 1 a 5 estrellas." };
  }

  try {
    await prisma.review.create({
      data: { ownerId: owner.id, walkerId, rating, comment: comment.trim() || null },
    });
    revalidatePath(`/walkers/${walkerId}`);
    revalidatePath("/walkers");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("[createReview]", err);
    return { error: "No se pudo guardar la reseña." };
  }
}
