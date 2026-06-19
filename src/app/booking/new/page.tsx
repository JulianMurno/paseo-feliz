import type { Metadata } from "next";
import { getWalkers } from "@/lib/data";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = { title: "Nueva reserva | Paseo Feliz" };

export default function NewBookingPage({
  searchParams,
}: {
  searchParams: { walker?: string };
}) {
  const walkers = getWalkers();

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
          <BookingForm walkers={walkers} initialWalkerId={searchParams.walker} />
        </div>
      </div>
    </div>
  );
}
