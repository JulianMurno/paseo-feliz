import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { StarRating } from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Lucía Fernández",
    avatar: "https://i.pravatar.cc/150?img=45",
    dog: "Toby · Labrador",
    rating: 5,
    quote:
      "Paseo Feliz me cambió la vida. Trabajo todo el día y saber que Toby sale a pasear con alguien de confianza, con fotos y GPS, no tiene precio.",
  },
  {
    name: "Diego Ramírez",
    avatar: "https://i.pravatar.cc/150?img=33",
    dog: "Rocco · Pastor Alemán",
    rating: 5,
    quote:
      "La app es súper intuitiva y los paseadores son profesionales de verdad. Rocco está más feliz y tranquilo desde que usamos el servicio.",
  },
  {
    name: "Ana Torres",
    avatar: "https://i.pravatar.cc/150?img=20",
    dog: "Luna · Chihuahua",
    rating: 5,
    quote:
      "Me encanta poder leer reseñas reales antes de elegir. Valeria cuida a Luna como si fuera suya. ¡Totalmente recomendado!",
  },
];

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-ink py-20 text-white">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-primary-light">
            Testimonios
          </span>
          <h2 className="section-title mt-4 text-white">
            Dueños felices, perros más felices
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Miles de familias ya confían en Paseo Feliz para el cuidado de sus
            mascotas.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-white/5 p-7 ring-1 ring-white/10"
            >
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="text-2xl text-primary-light"
              />
              <blockquote className="mt-4 flex-1 text-white/85">
                “{t.quote}”
              </blockquote>
              <div className="mt-3">
                <StarRating rating={t.rating} showValue={false} size="sm" />
              </div>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-sm text-white/60">{t.dog}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
