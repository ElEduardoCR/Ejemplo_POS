"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { fmtMoney } from "@/lib/utils";
import type { Categoria } from "@/lib/types";

const PROVEEDORES: Record<Categoria, string> = {
  snacks: "Sabritas-PepsiCo",
  refrescos: "Coca-Cola FEMSA",
  abarrotes: "Distribuidora La Merced",
  galletas: "Bimbo-Marinela",
  dulces: "Mars-Nestlé",
  limpieza: "Procter & Gamble",
  higiene: "Colgate-Palmolive",
  cerveza: "Grupo Modelo",
  comida: "Cocina Propia",
  botana: "Sabritas-PepsiCo",
  congelados: "Nestlé-Unilever",
  hogar: "Distribuidora Varios",
};

export default function ComprasPage() {
  const productos = useStore((s) => s.productos);
  const reabastecer = useStore((s) => s.reabastecer);

  const sugerencias = useMemo(() => {
    return productos
      .filter((p) => p.stock <= p.stock_min)
      .map((p) => {
        const sugerido = Math.max(0, p.stock_max - p.stock);
        return {
          ...p,
          cantidad_sugerida: sugerido,
          costo_estimado: Math.round(sugerido * p.costo * 100) / 100,
          proveedor: PROVEEDORES[p.categoria] || "Proveedor General",
        };
      })
      .sort((a, b) => a.stock / Math.max(a.stock_min, 1) - b.stock / Math.max(b.stock_min, 1));
  }, [productos]);

  const totalInversion = sugerencias.reduce((s, p) => s + p.costo_estimado, 0);

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2">🛍️ Próximas compras</h2>
      <p className="text-sm text-text-muted mb-4">
        Productos que reachedaron o están por debajo del stock mínimo. La cantidad
        sugerida llena el inventario al máximo.
      </p>

      <div className="bg-primary-soft border border-primary rounded-lg px-5 py-3.5 mb-4 flex justify-between items-center">
        <div>
          <div className="text-sm text-text-muted">Productos a reabastecer</div>
          <div className="text-2xl font-bold text-primary-dark">{sugerencias.length}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-muted">Inversión estimada</div>
          <div className="text-2xl font-bold text-primary-dark tabular-nums">
            {fmtMoney(totalInversion)}
          </div>
        </div>
      </div>

      {sugerencias.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <div className="text-5xl opacity-50 mb-3">✅</div>
          <p>Todo el inventario está sobre el mínimo.</p>
          <p className="text-sm">No hay compras sugeridas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sugerencias.map((p) => {
            const out = p.stock <= 0;
            return (
              <div
                key={p.id}
                className="bg-white border border-border rounded-lg px-4 py-3 grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center"
              >
                <div className="text-3xl">{p.icono}</div>
                <div>
                  <div className="font-semibold">{p.nombre}</div>
                  <div className="text-xs text-text-muted">
                    {p.proveedor} · Stock actual: <strong>{p.stock}</strong> / mín{" "}
                    {p.stock_min} / máx {p.stock_max} ·{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        out ? "bg-danger-soft text-danger" : "bg-warning-soft text-warning"
                      }`}
                    >
                      {out ? "❌ Sin stock" : "⚠️ Stock bajo"}
                    </span>
                  </div>
                </div>
                <div className="bg-warning-soft text-warning px-3 py-1.5 rounded-lg font-bold text-sm tabular-nums">
                  +{p.cantidad_sugerida} {p.unidad || "pza"}
                </div>
                <div className="font-bold tabular-nums">{fmtMoney(p.costo_estimado)}</div>
                <button
                  onClick={() => reabastecer(p.id)}
                  className="bg-success-soft text-success hover:bg-success hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  ✓ Recibir
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
