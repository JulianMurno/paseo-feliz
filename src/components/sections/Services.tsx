import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDog,
  faPaw,
  faBolt,
  faLocationDot,
  faHeart,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { services } from "@/lib/data";

const iconMap: Record<string, IconDefinition> = {
  dog: faDog,
  paw: faPaw,
  bolt: faBolt,
  "location-dot": faLocationDot,
  heart: faHeart,
  camera: faCamera,
};

export function Services() {
  return (
    <section id="servicio" className="py-20">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">Nuestro servicio</span>
          <h2 className="section-title mt-4">
            Todo lo que tu perro necesita, en un solo lugar
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Elige el tipo de paseo perfecto para tu peludo. Cada servicio incluye
            paseadores verificados y rastreo en tiempo real.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card group p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <FontAwesomeIcon icon={iconMap[s.icon] ?? faPaw} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-ink/70">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
