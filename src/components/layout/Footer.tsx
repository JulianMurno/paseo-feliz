import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebookF,
  faXTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const columns = [
  {
    title: "Servicio",
    links: [
      { href: "/#servicio", label: "Cómo funciona" },
      { href: "/walkers", label: "Paseadores" },
      { href: "/#precios", label: "Precios" },
      { href: "/booking/new", label: "Reservar" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/#testimonios", label: "Testimonios" },
      { href: "/login", label: "Ser paseador" },
      { href: "#", label: "Sobre nosotros" },
      { href: "#", label: "Contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Términos y condiciones" },
      { href: "#", label: "Privacidad" },
      { href: "#", label: "Cookies" },
    ],
  },
];

const socials = [
  { icon: faInstagram, label: "Instagram" },
  { icon: faFacebookF, label: "Facebook" },
  { icon: faXTwitter, label: "X" },
  { icon: faTiktok, label: "TikTok" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-ink text-white/80">
      <div className="container-px grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <FontAwesomeIcon icon={faPaw} />
            </span>
            <span className="font-display text-xl font-extrabold text-white">
              Paseo<span className="text-primary-light">Feliz</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Conectamos a dueños de perros con paseadores de confianza, de manera
            fácil, segura y cercana. 🐾
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
              >
                <FontAwesomeIcon icon={s.icon} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-primary-light"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Paseo Feliz. Todos los derechos reservados.</p>
          <p>Hecho con 🐾 y mucho cariño por perros felices.</p>
        </div>
      </div>
    </footer>
  );
}
