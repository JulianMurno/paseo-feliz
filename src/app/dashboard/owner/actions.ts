"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-config";
import { getCurrentOwner } from "@/lib/identity";

export interface PetResult {
  ok?: boolean;
  demo?: boolean;
  error?: string;
}

// CREATE — el Owner añade una mascota.
export async function createPet(name: string, breed: string): Promise<PetResult> {
  if (!isDatabaseConfigured) return { demo: true };
  const owner = await getCurrentOwner();
  if (!owner) return { error: "No autorizado." };
  if (!name.trim()) return { error: "El nombre es obligatorio." };

  try {
    await prisma.pet.create({
      data: { ownerId: owner.id, name: name.trim(), breed: breed.trim() || null },
    });
    revalidatePath("/dashboard/owner");
    return { ok: true };
  } catch (err) {
    console.error("[createPet]", err);
    return { error: "No se pudo añadir la mascota." };
  }
}

// DELETE — el Owner elimina una de sus mascotas.
export async function deletePet(petId: string): Promise<PetResult> {
  if (!isDatabaseConfigured) return { demo: true };
  const owner = await getCurrentOwner();
  if (!owner) return { error: "No autorizado." };

  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet || pet.ownerId !== owner.id) return { error: "Mascota no encontrada." };

  try {
    await prisma.pet.delete({ where: { id: petId } });
    revalidatePath("/dashboard/owner");
    return { ok: true };
  } catch (err) {
    console.error("[deletePet]", err);
    return { error: "No se pudo eliminar la mascota." };
  }
}
