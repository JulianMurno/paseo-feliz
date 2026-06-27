import type { Metadata } from "next";
import { getWalkers } from "@/lib/queries";
import { getCurrentOwner } from "@/lib/identity";
import { isDatabaseConfigured } from "@/lib/db-config";
import { prisma } from "@/lib/prisma";
import { BookingForm, type PetOption } from "@/components/booking/BookingForm";

export const metadata: Metadata = { title: "Nueva reserva | Paseo Feliz" };

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: { walker?: string };
}) {
  const walkers = await getWalkers();

  // Mascotas reales del dueño (o demo).
  let pets: PetOption[] = [{ id: "demo-toby", name: "Toby", breed: "Labrador" }];
  if (isDatabaseConfigured) {
    const owner = await getCurrentOwner();
    if (owner) {
      const dbPets = await prisma.pet.findMany({ where: { ownerId: owner.id } });
      pets = dbPets.map((p) => ({ id: p.id, name: p.name, breed: p.breed ?? "" }));
    } else {
      pets = [];
    }
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 to-white">
      <div className="container-px py-12">
        <header className="mx-auto max-w-2xl text-center">
          <span className="chip">Reservar paseo</span>
          <h1 className="section-title mt-4">Solicita un paseo</h1>
          <p className="mt-3 text-ink/70">
            Completa los detalles y tu solicitud llegará directamente al paseador
            elegido. 🐾
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-4xl">
          <BookingForm
            walkers={walkers}
            initialWalkerId={searchParams.walker}
            pets={pets}
            configured={isDatabaseConfigured}
          />
        </div>
      </div>
    </div>
  );
}
