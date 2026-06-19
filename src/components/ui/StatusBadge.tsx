import type { BookingStatus } from "@/lib/types";

const map: Record<BookingStatus, { label: string; cls: string }> = {
  PENDING: { label: "Pendiente", cls: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Aceptada", cls: "bg-primary/10 text-primary" },
  REJECTED: { label: "Rechazada", cls: "bg-red-100 text-red-600" },
  COMPLETED: { label: "Completada", cls: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Cancelada", cls: "bg-gray-100 text-gray-500" },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const s = map[status];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>
      {s.label}
    </span>
  );
}
