import type { Metadata } from "next";
import { getWalkers } from "@/lib/queries";
import { WalkersExplorer } from "@/components/walkers/WalkersExplorer";

export const metadata: Metadata = {
  title: "Paseadores | Paseo Feliz",
  description:
    "Explora paseadores de perros verificados cerca de ti. Filtra por valoración, precio y proximidad con nuestro mapa en vivo.",
};

export default async function WalkersPage() {
  const walkers = await getWalkers();

  return (
    <div className="bg-gradient-to-b from-primary/5 to-white">
      <div className="container-px py-12">
        <header className="mx-auto max-w-2xl text-center">
          <span className="chip">Paseadores</span>
          <h1 className="section-title mt-4">Encuentra al paseador ideal</h1>
          <p className="mt-3 text-lg text-ink/70">
            Paseadores verificados, con reseñas reales y rastreo por
            localización. Tu perro en las mejores manos. 🐾
          </p>
        </header>

        <div className="mt-12">
          <WalkersExplorer walkers={walkers} />
        </div>
      </div>
    </div>
  );
}
