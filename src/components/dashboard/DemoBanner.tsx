import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export function DemoBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-amber-500" />
      <p>
        <strong>Vista demo.</strong> Estás viendo datos de ejemplo. Configura
        Supabase + Google en <code className="rounded bg-amber-100 px-1">.env</code>{" "}
        para ver tus reservas reales.
      </p>
    </div>
  );
}
