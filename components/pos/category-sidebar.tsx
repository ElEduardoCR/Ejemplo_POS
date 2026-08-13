"use client";

import { Search } from "lucide-react";
import type { Categoria } from "@/lib/types";

interface CategorySidebarProps {
  categorias: { id: Categoria; nombre: string; icono: string }[];
  activa: Categoria | "all";
  onSelect: (cat: Categoria | "all") => void;
  busqueda: string;
  onBusquedaChange: (q: string) => void;
}

export function CategorySidebar({
  categorias,
  activa,
  onSelect,
  busqueda,
  onBusquedaChange,
}: CategorySidebarProps) {
  return (
    <aside className="bg-bg-card border-r border-border flex flex-col overflow-hidden">
      <h3 className="px-4 py-3 text-xs uppercase tracking-wide text-text-muted font-semibold border-b border-border">
        Categorías
      </h3>
      <ul className="flex-1 overflow-y-auto p-1.5">
        <li>
          <button
            onClick={() => onSelect("all")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              activa === "all"
                ? "bg-primary text-topbar font-semibold"
                : "hover:bg-bg-soft"
            }`}
          >
            <span className="text-lg w-6 text-center">🛍️</span>
            <span>Todos</span>
          </button>
        </li>
        {categorias.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                activa === c.id
                  ? "bg-primary text-topbar font-semibold"
                  : "hover:bg-bg-soft"
              }`}
            >
              <span className="text-lg w-6 text-center">{c.icono}</span>
              <span>{c.nombre}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t border-border">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar producto o SKU..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-bg-soft focus:bg-white focus:border-primary"
          />
        </div>
      </div>
    </aside>
  );
}
