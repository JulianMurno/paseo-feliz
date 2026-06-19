import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container-px">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-8 py-16 text-center text-white shadow-soft">
          <FontAwesomeIcon
            icon={faPaw}
            className="pointer-events-none absolute -right-6 -top-6 text-9xl text-white/10"
          />
          <FontAwesomeIcon
            icon={faPaw}
            className="pointer-events-none absolute -bottom-8 -left-6 text-8xl text-white/10"
          />
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            ¿Listo para darle el mejor paseo a tu perro?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            Únete a Paseo Feliz hoy. Encuentra un paseador de confianza en
            minutos o conviértete en uno.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/walkers" className="btn bg-white text-primary hover:bg-white/90">
              Encontrar paseador
            </Link>
            <Link
              href="/login"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary"
            >
              Ser paseador
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
