"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { deleteAccount } from "@/app/dashboard/actions";

// Botón "Eliminar cuenta" con confirmación. Disponible para Owner y Walker.
export function DeleteAccountButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    const result = await deleteAccount();

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.demo) {
      // En modo demo no hay cuenta real; simulamos el cierre volviendo al inicio.
      router.push("/?cuenta=demo-eliminada");
      router.refresh();
      return;
    }

    // Cuenta eliminada. Si no había service role key, la cuenta de Auth podría
    // seguir existiendo; lo indicamos con un parámetro informativo.
    const flag = result.authDeleted ? "eliminada" : "datos-eliminados";
    router.push(`/?cuenta=${flag}`);
    router.refresh();
  };

  return (
    <>
      <section className="mt-12 rounded-2xl border border-red-200 bg-red-50/60 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-red-700">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          Zona de peligro
        </h2>
        <p className="mt-1 text-sm text-red-700/80">
          Al eliminar tu cuenta se borrarán de forma permanente tu perfil, tus
          reservas y reseñas. Esta acción no se puede deshacer.
        </p>
        <button
          onClick={() => {
            setOpen(true);
            setError(null);
            setConfirmText("");
          }}
          className="btn mt-4 border-2 border-red-300 bg-white text-red-600 hover:bg-red-600 hover:text-white"
        >
          <FontAwesomeIcon icon={faTrashCan} />
          Eliminar cuenta
        </button>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
                Eliminar cuenta
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-ink/40 hover:text-ink"
                aria-label="Cerrar"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>

            <p className="mt-4 text-ink/70">
              Esta acción es <strong>permanente</strong>. Se eliminarán tu cuenta
              y todos tus datos. Para confirmar, escribe{" "}
              <strong className="text-red-600">ELIMINAR</strong> abajo.
            </p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="mt-4 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200"
            />

            {error && (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmText !== "ELIMINAR"}
                className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Eliminando..." : "Sí, eliminar mi cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
