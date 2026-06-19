import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCalendarCheck,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    icon: faMagnifyingGlass,
    title: "1. Encuentra",
    desc: "Busca paseadores verificados cerca de ti y filtra por valoración, precio y disponibilidad.",
  },
  {
    icon: faCalendarCheck,
    title: "2. Reserva",
    desc: "Elige fecha, hora y duración. Tu solicitud llega al paseador, que la acepta al instante.",
  },
  {
    icon: faMapLocationDot,
    title: "3. Sigue el paseo",
    desc: "Rastrea la ubicación en vivo, recibe fotos y deja una reseña al terminar.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-primary/5 py-20">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">Cómo funciona</span>
          <h2 className="section-title mt-4">Tan fácil como 1, 2, 3</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl text-white shadow-soft">
                <FontAwesomeIcon icon={s.icon} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-ink/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
