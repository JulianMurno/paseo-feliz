"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan, faDog } from "@fortawesome/free-solid-svg-icons";
import { createPet, deletePet } from "@/app/dashboard/owner/actions";

export interface Pet {
  id: string;
  name: string;
  breed: string;
}

// Gestor de mascotas del Owner: alta y baja reales.
// En modo real, la lista proviene del servidor (`pets`) y tras cada cambio se
// llama a router.refresh() para que el panel se actualice solo, sin recargar.
// En modo demo (sin BD) se usa una lista local optimista.
export function PetsManager({ pets, configured }: { pets: Pet[]; configured: boolean }) {
  const router = useRouter();
  const [demoList, setDemoList] = useState<Pet[]>(pets);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Fuente de verdad: en real, los datos del servidor; en demo, el estado local.
  const list = configured ? pets : demoList;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("El nombre es obligatorio.");

    if (!configured) {
      setDemoList((l) => [...l, { id: `demo-${Date.now()}`, name, breed }]);
      setName("");
      setBreed("");
      setAdding(false);
      return;
    }

    startTransition(async () => {
      const res = await createPet(name, breed);
      if (res.error) return setError(res.error);
      setName("");
      setBreed("");
      setAdding(false);
      router.refresh(); // 🔄 actualiza el panel con la mascota recién creada
    });
  };

  const remove = (id: string) => {
    if (!configured) {
      setDemoList((l) => l.filter((p) => p.id !== id));
      return;
    }
    startTransition(async () => {
      const res = await deletePet(id);
      if (res.error) return setError(res.error);
      router.refresh(); // 🔄 refleja la baja al instante
    });
  };

  return (
    <div className="mt-4 space-y-3">
      {list.map((p) => (
        <div key={p.id} className="card flex items-center gap-3 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faDog} />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink">{p.name}</p>
            <p className="text-sm text-ink/60">{p.breed || "Sin raza especificada"}</p>
          </div>
          <button
            onClick={() => remove(p.id)}
            disabled={pending}
            className="text-ink/30 transition-colors hover:text-red-600 disabled:opacity-40"
            aria-label={`Eliminar ${p.name}`}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      ))}

      {list.length === 0 && !adding && (
        <p className="rounded-xl bg-primary/5 p-4 text-center text-sm text-ink/60">
          Aún no tienes mascotas registradas.
        </p>
      )}

      {adding ? (
        <form onSubmit={add} className="card space-y-3 p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (ej. Toby)"
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            autoFocus
          />
          <input
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Raza (ej. Labrador)"
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary flex-1 py-2 text-sm">
              {pending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              className="btn-ghost py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-outline w-full">
          <FontAwesomeIcon icon={faPlus} />
          Añadir mascota
        </button>
      )}
    </div>
  );
}
