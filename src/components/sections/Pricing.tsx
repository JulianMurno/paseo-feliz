import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { pricingPlans } from "@/lib/data";

export function Pricing() {
  return (
    <section id="precios" className="py-20">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">Precios</span>
          <h2 className="section-title mt-4">Planes simples y transparentes</h2>
          <p className="mt-4 text-lg text-ink/70">
            Sin sorpresas ni cargos ocultos. Elige el plan que mejor se adapte a
            ti y a tu perro.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-8 ${
                plan.featured
                  ? "bg-primary text-white shadow-soft ring-2 ring-primary"
                  : "card"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-ink">
                  <FontAwesomeIcon icon={faStar} />
                  Más popular
                </span>
              )}
              <h3
                className={`font-display text-xl font-bold ${
                  plan.featured ? "text-white" : "text-ink"
                }`}
              >
                {plan.name}
              </h3>
              <p className={plan.featured ? "mt-2 text-white/80" : "mt-2 text-ink/60"}>
                {plan.description}
              </p>
              <p className="mt-6 flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold">
                  ${plan.price}
                </span>
                <span className={plan.featured ? "mb-1 text-white/80" : "mb-1 text-ink/50"}>
                  {plan.period}
                </span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`mt-1 ${plan.featured ? "text-white" : "text-primary"}`}
                    />
                    <span className={plan.featured ? "text-white/90" : "text-ink/80"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/walkers"
                className={`mt-8 ${
                  plan.featured
                    ? "btn bg-white text-primary hover:bg-white/90"
                    : "btn-primary"
                } w-full`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
