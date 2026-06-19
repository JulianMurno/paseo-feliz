import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faLocationDot,
  faShieldDog,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
      <div className="container-px grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Texto */}
        <div className="animate-fade-up">
          <span className="chip">
            <FontAwesomeIcon icon={faPaw} />
            +500 paseos completados este mes
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Paseadores de perros{" "}
            <span className="text-primary">de confianza</span>, cerca de ti.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            Conecta a tu mejor amigo con paseadores verificados. Reserva en
            segundos, sigue cada paseo con rastreo GPS y recibe fotos en tiempo
            real. 🐾
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/walkers" className="btn-primary">
              <FontAwesomeIcon icon={faLocationDot} />
              Encontrar paseador
            </Link>
            <Link href="/login" className="btn-outline">
              <FontAwesomeIcon icon={faPaw} />
              Ser paseador
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <FontAwesomeIcon icon={faShieldDog} className="text-primary" size="lg" />
              Paseadores verificados
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <FontAwesomeIcon icon={faLocationDot} className="text-primary" size="lg" />
              Rastreo GPS en vivo
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <FontAwesomeIcon icon={faStar} className="text-amber-400" size="lg" />
              4.9/5 valoración media
            </div>
          </div>
        </div>

        {/* Imagen + tarjeta flotante */}
        <div className="relative animate-fade-up">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80"
              alt="Perro feliz paseando"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>

          {/* Tarjeta del paseador */}
          <div className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft sm:-left-6">
            <Image
              src="https://i.pravatar.cc/100?img=12"
              alt="Carlos M."
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-ink">Carlos M.</p>
              <p className="flex items-center gap-1 text-xs text-ink/60">
                <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                4.9 · Paseando ahora
              </p>
            </div>
            <span className="ml-2 h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
