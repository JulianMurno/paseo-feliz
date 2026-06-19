import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getFeaturedWalkers } from "@/lib/data";
import { WalkerCard } from "@/components/walkers/WalkerCard";

export function WalkersPreview() {
  const walkers = getFeaturedWalkers(4);

  return (
    <section id="paseadores" className="py-20">
      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="chip">Paseadores destacados</span>
            <h2 className="section-title mt-4">
              Conoce a algunos de nuestros mejores paseadores
            </h2>
          </div>
          <Link href="/walkers" className="btn-ghost shrink-0">
            Ver todos
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {walkers.map((w) => (
            <WalkerCard key={w.id} walker={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
