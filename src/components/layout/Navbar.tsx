"use client";

import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faBars,
  faXmark,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import type { SessionUser } from "@/lib/auth";

const navLinks = [
  { href: "/#servicio", label: "Servicio" },
  { href: "/walkers", label: "Paseadores" },
  { href: "/#testimonios", label: "Testimonios" },
  { href: "/#precios", label: "Precios" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <nav className="container-px flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <FontAwesomeIcon icon={faPaw} />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            Paseo<span className="text-primary">Feliz</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-semibold text-ink/80 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={user.role === "WALKER" ? "/dashboard/walker" : "/dashboard/owner"}
                className="btn-ghost"
              >
                Mi panel
              </Link>
              <form action="/auth/signout" method="post">
                <button className="btn-outline" type="submit">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                <FontAwesomeIcon icon={faRightToBracket} />
                Iniciar sesión
              </Link>
              <Link href="/walkers" className="btn-primary">
                Reservar paseo
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} size="lg" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <ul className="container-px flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-ink/80 hover:bg-primary/5 hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href={user.role === "WALKER" ? "/dashboard/walker" : "/dashboard/owner"}
                    className="btn-outline w-full"
                    onClick={() => setOpen(false)}
                  >
                    Mi panel
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="btn-ghost w-full" type="submit">
                      Salir
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-outline w-full" onClick={() => setOpen(false)}>
                    Iniciar sesión
                  </Link>
                  <Link href="/walkers" className="btn-primary w-full" onClick={() => setOpen(false)}>
                    Reservar paseo
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
