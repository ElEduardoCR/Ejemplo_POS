"use client";

import type { Producto } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";

interface ProductGridProps {
  productos: Producto[];
  onAdd: (id: string) => void;
}

export function ProductGrid({ productos, onAdd }: ProductGridProps) {
  if (!productos.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted">
        <div className="text-center">
          <div className="text-5xl opacity-50 mb-3">🔎</div>
          <p>No hay productos para esta categoría.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 p-4 overflow-y-auto flex-1 content-start">
      {productos.map((p) => {
        const out = p.stock <= 0;
        const low = !out && p.stock <= p.stock_min;
        return (
          <button
            key={p.id}
            onClick={() => !out && onAdd(p.id)}
            disabled={out}
            className={`bg-bg-card border border-border rounded-xl p-3 flex flex-col items-center text-center transition relative ${
              out
                ? "opacity-40 cursor-not-allowed"
                : "hover:border-primary hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer"
            }`}
          >
            <span
              className={`absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                out
                  ? "bg-danger-soft text-danger"
                  : low
                  ? "bg-warning-soft text-warning"
                  : "bg-bg-soft text-text-muted"
              }`}
            >
              {p.stock}
            </span>
            <div className="text-4xl mb-1.5">{p.icono}</div>
            <div className="text-xs font-medium leading-tight line-clamp-2 mb-1.5 min-h-[28px]">
              {p.nombre}
            </div>
            <div className="text-sm font-bold text-primary-dark tabular-nums">
              {fmtMoney(p.precio)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
