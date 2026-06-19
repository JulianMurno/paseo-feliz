import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl text-primary">
        <FontAwesomeIcon icon={faPaw} />
      </span>
      <h1 className="mt-6 font-display text-4xl font-extrabold text-ink">
        Página no encontrada
      </h1>
      <p className="mt-3 text-ink/60">
        Parece que este perrito se fue de paseo y no volvió. 🐾
      </p>
      <Link href="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}
