"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtMoney, fmtFechaHora } from "@/lib/utils";
import type { ResumenTurno } from "@/lib/types";

export default function CortePage() {
  const turno = useStore((s) => s.turno);
  const ventas = useStore((s) => s.ventas);
  const turnosCerrados = useStore((s) => s.turnosCerrados);
  const cerrarTurno = useStore((s) => s.cerrarTurno);

  const ventasTurno = useMemo(
    () => ventas.filter((v) => v.turno_id === turno.id),
    [ventas, turno.id]
  );
  const totalVendido = ventasTurno.reduce((s, v) => s + v.total, 0);

  const porMetodo = useMemo(() => {
    const m: { efectivo: number; tarjeta: number } = { efectivo: 0, tarjeta: 0 };
    for (const v of ventasTurno) {
      for (const p of v.pagos) {
        if (p.metodo === "efectivo") m.efectivo += p.monto;
        else if (p.metodo === "tarjeta") m.tarjeta += p.monto;
      }
    }
    for (const v of ventasTurno) {
      if (v.metodo === "mixto") {
        m.efectivo += v.total / 2;
        m.tarjeta += v.total - v.total / 2;
      }
    }
    return {
      efectivo: Math.round(m.efectivo * 100) / 100,
      tarjeta: Math.round(m.tarjeta * 100) / 100,
    };
  }, [ventasTurno]);

  const efectivoEsperado =
    Math.round((turno.efectivo_inicial + porMetodo.efectivo) * 100) / 100;

  const [efectivoReal, setEfectivoReal] = useState(efectivoEsperado);
  const [ultimoCorte, setUltimoCorte] = useState<ResumenTurno | null>(null);

  const handleCerrar = () => {
    if (!confirm(`¿Cerrar el turno? Efectivo reportado: ${fmtMoney(efectivoReal)}`)) return;
    const resumen = cerrarTurno(efectivoReal);
    if (resumen) {
      setUltimoCorte(resumen);
      setEfectivoReal(efectivoReal);
    }
  };

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">💰 Corte de caja</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-5">
        <div className="bg-white border border-border rounded-xl p-5">
          <h4 className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-3">
            Turno #{turno.id} · {turno.cajero}
          </h4>
          <div className="text-3xl font-bold tabular-nums">{fmtMoney(totalVendido)}</div>
          <p className="text-sm text-text-muted mt-1">
            {ventasTurno.length} ventas · desde {fmtFechaHora(turno.activo_desde)}
          </p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <h4 className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-3">
            Efectivo en caja
          </h4>
          <div className="text-3xl font-bold tabular-nums">{fmtMoney(efectivoEsperado)}</div>
          <p className="text-sm text-text-muted mt-1">
            Inicial: {fmtMoney(turno.efectivo_inicial)} + ventas efectivo
          </p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <h4 className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-3">
            Desglose por método
          </h4>
          {Object.entries(porMetodo).map(([m, t]) =>
            t > 0 ? (
              <div key={m} className="flex justify-between text-sm py-1">
                <span>
                  {m === "efectivo" ? "💵" : "💳"} {m}
                </span>
                <span className="font-semibold tabular-nums">{fmtMoney(t)}</span>
              </div>
            ) : null
          )}
          {porMetodo.efectivo === 0 && porMetodo.tarjeta === 0 && (
            <p className="text-sm text-text-muted">Sin ventas aún</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 flex items-end gap-3 mb-5">
        <div className="flex-1">
          <label className="text-xs text-text-muted">Efectivo en caja (real)</label>
          <input
            type="number"
            step="0.01"
            value={efectivoReal}
            onChange={(e) => setEfectivoReal(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-lg tabular-nums"
          />
        </div>
        <button
          onClick={handleCerrar}
          className="bg-primary text-topbar hover:bg-primary-dark px-5 py-2.5 rounded-lg font-semibold"
        >
          🔒 Cerrar turno y abrir nuevo
        </button>
      </div>

      {ultimoCorte && <ResumenCorte resumen={ultimoCorte} />}

      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Historial de turnos</h3>
        {turnosCerrados.length === 0 ? (
          <p className="text-sm text-text-muted">No hay turnos cerrados todavía.</p>
        ) : (
          <div className="divide-y divide-border-soft">
            {[...turnosCerrados].reverse().map((t) => {
              const difCls = t.diferencia === 0 ? "text-text-muted" : t.diferencia > 0 ? "text-success" : "text-danger";
              const difTxt = t.diferencia === 0 ? "Exacto" : t.diferencia > 0 ? `+${fmtMoney(t.diferencia)}` : fmtMoney(t.diferencia);
              return (
                <div key={t.id} className="grid grid-cols-[60px_1fr_auto_auto] gap-3 py-2.5 text-sm items-center">
                  <div className="font-bold text-text-muted">#{t.id}</div>
                  <div>
                    <div className="font-medium">{t.cajero}</div>
                    <div className="text-xs text-text-muted">
                      {fmtFechaHora(t.cerrado_en)} · {t.ventas_count} ventas
                    </div>
                  </div>
                  <div className="font-bold tabular-nums">{fmtMoney(t.total_vendido)}</div>
                  <div className={`text-xs tabular-nums ${difCls}`}>{difTxt}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ResumenCorte({ resumen }: { resumen: ResumenTurno }) {
  const difCls = resumen.diferencia === 0 ? "" : resumen.diferencia > 0 ? "text-warning" : "text-danger";
  const difTxt = resumen.diferencia === 0 ? "Exacto" : resumen.diferencia > 0 ? `+${fmtMoney(resumen.diferencia)}` : fmtMoney(resumen.diferencia);

  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-5">
      <h3 className="text-sm font-semibold mb-3">📋 Resumen del turno #{resumen.id}</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mb-4">
        <Card title="Total vendido" value={fmtMoney(resumen.total_vendido)} color="text-success" subtitle={`${resumen.ventas_count} ventas`} />
        <Card title="Efectivo" value={fmtMoney(resumen.por_metodo.efectivo)} subtitle={`Inicial: ${fmtMoney(resumen.efectivo_inicial)} · Esperado: ${fmtMoney(resumen.efectivo_esperado)}`} />
        <Card title="Tarjeta" value={fmtMoney(resumen.por_metodo.tarjeta)} />
        <Card title="Diferencia de caja" value={difTxt} color={difCls} subtitle={`Real: ${fmtMoney(resumen.efectivo_real)} vs Esperado: ${fmtMoney(resumen.efectivo_esperado)}`} />
      </div>
      <h4 className="text-sm font-medium mb-2">Top productos del turno</h4>
      <div className="divide-y divide-border-soft max-h-60 overflow-y-auto">
        {resumen.items_vendidos.slice(0, 15).map((it) => (
          <div key={it.producto_id} className="flex justify-between items-center py-2 text-sm">
            <span className="font-medium">{it.nombre}</span>
            <span className="text-text-muted text-xs">
              {it.cantidad} unidades
            </span>
            <span className="font-bold tabular-nums">{fmtMoney(it.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value, subtitle, color = "text-text" }: { title: string; value: string; subtitle?: string; color?: string }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <h4 className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-2">{title}</h4>
      <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
      {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
    </div>
  );
}
