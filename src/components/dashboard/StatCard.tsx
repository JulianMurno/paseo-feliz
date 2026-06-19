import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export function StatCard({
  icon,
  value,
  label,
}: {
  icon: IconDefinition;
  value: string | number;
  label: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold text-ink">{value}</p>
        <p className="text-sm text-ink/60">{label}</p>
      </div>
    </div>
  );
}
