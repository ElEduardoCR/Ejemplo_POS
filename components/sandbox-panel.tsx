"use client";

import { useEffect, useState } from "react";
import { X, Plus, FastForward, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtFecha } from "@/lib/utils";

export function SandboxPanel() {
  const [open, setOpen] = useState(false);
  const sandbox = useStore((s) => s.sandbox);
  const avanzarTiempo = useStore((s) => s.avanzarTiempo);
  const simularVenta = useStore((s) => s.simularVenta);
  const simularDia = useStore((s) => s.simularDia);
  const reset = useStore((s) => s.reset);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed top-14 right-0 w-80 bg-bg-card border border-border border-r-0 rounded-bl-xl shadow-lg z-30">
      <div className="flex justify-between items-center px-4 py-3 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <span>🎮</span> Sandbox
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="w-7 h-7 rounded-full bg-bg-soft hover:bg-danger-soft hover:text-danger flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
            Reloj simulado
          </label>
          <div className="bg-bg-soft rounded-lg p-3 text-center mb-2">
            <span className="block text-xs text-text-muted">
              {fmtFecha(sandbox.fecha_actual)}
            </span>
            <span className="block text-2xl font-bold tabular-nums">
              {sandbox.hora_actual}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => avanzarTiempo(15)}
              className="flex-1 bg-bg-soft hover:bg-border rounded-lg py-2 text-sm font-medium transition"
            >
              +15 min
            </button>
            <button
              onClick={() => avanzarTiempo(30)}
              className="flex-1 bg-bg-soft hover:bg-border rounded-lg py-2 text-sm font-medium transition"
            >
              +30 min
            </button>
            <button
              onClick={() => avanzarTiempo(60)}
              className="flex-1 bg-bg-soft hover:bg-border rounded-lg py-2 text-sm font-medium transition"
            >
              +1 hora
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
            Generar ventas
          </label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => simularVenta()}
              className="bg-bg-soft hover:bg-border rounded-lg py-2 text-sm font-medium transition"
            >
              +1 venta
            </button>
            <button
              onClick={() => simularDia()}
              className="bg-primary text-topbar hover:bg-primary-dark rounded-lg py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <FastForward className="w-4 h-4" />
              Simular día completo
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Genera 100–180 ventas con distribución realista (más ventas en horas
            pico).
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
            Reset
          </label>
          <button
            onClick={() => {
              if (confirm("¿Reiniciar el sistema? Se borrarán ventas, turnos y se restaurará el inventario y el reloj.")) {
                reset();
              }
            }}
            className="w-full bg-danger-soft text-danger hover:bg-danger hover:text-white rounded-lg py-2 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Reiniciar sistema
          </button>
          <p className="text-xs text-text-muted mt-2">
            Vuelve al estado inicial. La sesión también se borra al cerrar la pestaña.
          </p>
        </div>
      </div>
    </div>
  );
}
