"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useStore } from "@/lib/store";
import { fmtMoney, fmtNum, fmtFecha } from "@/lib/utils";
import type { Categoria } from "@/lib/types";

export default function BackofficePage() {
  const productos = useStore((s) => s.productos);
  const categorias = useStore((s) => s.categorias);
  const ventas = useStore((s) => s.ventas);
  const sandbox = useStore((s) => s.sandbox);

  const resumen = useMemo(() => {
    const ventasHoy = ventas.filter((v) =>
      v.timestamp.startsWith(sandbox.fecha_actual)
    );
    const total = ventasHoy.reduce((s, v) => s + v.total, 0);
    const ticket = ventasHoy.length ? total / ventasHoy.length : 0;
    const items = ventasHoy.reduce((s, v) => s + v.items.reduce((a, i) => a + i.cantidad, 0), 0);
    const alertas = productos.filter((p) => p.stock <= p.stock_min).length;
    return {
      ventas: ventasHoy.length,
      total,
      ticket,
      items,
      alertas,
    };
  }, [ventas, productos, sandbox.fecha_actual]);

  const porHora = useMemo(() => {
    const arr = Array.from({ length: 24 }, (_, h) => ({
      hora: `${String(h).padStart(2, "0")}:00`,
      total: 0,
    }));
    for (const v of ventas) {
      if (!v.timestamp.startsWith(sandbox.fecha_actual)) continue;
      const h = parseInt(v.timestamp.slice(11, 13));
      if (!isNaN(h)) arr[h].total += v.total;
    }
    return arr.map((d) => ({ ...d, total: Math.round(d.total * 100) / 100 }));
  }, [ventas, sandbox.fecha_actual]);

  const porCategoria = useMemo(() => {
    const map = new Map<Categoria, number>();
    for (const v of ventas) {
      if (!v.timestamp.startsWith(sandbox.fecha_actual)) continue;
      for (const it of v.items) {
        map.set(it.categoria, (map.get(it.categoria) || 0) + it.total);
      }
    }
    return Array.from(map.entries())
      .map(([c, t]) => ({ categoria: c, total: Math.round(t * 100) / 100 }))
      .sort((a, b) => b.total - a.total);
  }, [ventas, sandbox.fecha_actual]);

  const topProductos = useMemo(() => {
    const map = new Map<string, { id: string; nombre: string; categoria: Categoria; icono: string; cantidad: number; total: number }>();
    for (const v of ventas) {
      if (!v.timestamp.startsWith(sandbox.fecha_actual)) continue;
      for (const it of v.items) {
        const ex = map.get(it.producto_id);
        if (ex) {
          ex.cantidad += it.cantidad;
          ex.total = Math.round((ex.total + it.total) * 100) / 100;
        } else {
          map.set(it.producto_id, {
            id: it.producto_id,
            nombre: it.nombre,
            categoria: it.categoria,
            icono: it.icono,
            cantidad: it.cantidad,
            total: it.total,
          });
        }
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 15);
  }, [ventas, sandbox.fecha_actual]);

  const porMetodo = useMemo(() => {
    const map: Record<string, number> = { efectivo: 0, tarjeta: 0 };
    for (const v of ventas) {
      if (!v.timestamp.startsWith(sandbox.fecha_actual)) continue;
      for (const p of v.pagos) {
        if (p.metodo === "efectivo") map.efectivo += p.monto;
        else if (p.metodo === "tarjeta") map.tarjeta += p.monto;
      }
    }
    return [
      { metodo: "efectivo", total: Math.round(map.efectivo * 100) / 100 },
      { metodo: "tarjeta", total: Math.round(map.tarjeta * 100) / 100 },
    ].sort((a, b) => b.total - a.total);
  }, [ventas, sandbox.fecha_actual]);

  const maxHora = Math.max(...porHora.map((d) => d.total), 1);
  const maxCat = Math.max(...porCategoria.map((d) => d.total), 1);

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <div className="mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">📊 Back Office</h2>
        <p className="text-sm text-text-muted">Datos del día simulado: {fmtFecha(sandbox.fecha_actual)}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mb-6">
        <Stat label="Ventas del día" value={fmtNum(resumen.ventas)} />
        <Stat label="Total vendido" value={fmtMoney(resumen.total)} color="text-success" />
        <Stat label="Ticket promedio" value={fmtMoney(resumen.ticket)} />
        <Stat label="Items vendidos" value={fmtNum(resumen.items)} />
        <Stat label="Alertas stock" value={fmtNum(resumen.alertas)} color="text-warning" />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4 max-[1000px]:grid-cols-1">
        <Card title="📈 Ventas por hora">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porHora} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="hora"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(v) => fmtMoney(Number(v) || 0)}
                />
                <Bar dataKey="total" fill="#ffc20e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="🏷️ Por categoría">
          {porCategoria.length === 0 ? (
            <p className="text-sm text-text-muted">Sin ventas por categoría hoy.</p>
          ) : (
            <div className="space-y-2">
              {porCategoria.map((d) => {
                const cat = categorias.find((c) => c.id === d.categoria);
                const pct = (d.total / maxCat) * 100;
                return (
                  <div key={d.categoria} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{cat?.icono || "📦"}</span>
                    <span className="min-w-[110px]">{cat?.nombre || d.categoria}</span>
                    <div className="flex-1 h-2 bg-bg-soft rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: cat?.color || "#3b82f6",
                        }}
                      />
                    </div>
                    <span className="font-semibold tabular-nums min-w-[80px] text-right">
                      {fmtMoney(d.total)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4 max-[1000px]:grid-cols-1">
        <Card title="🏆 Top productos del día">
          {topProductos.length === 0 ? (
            <p className="text-sm text-text-muted">Aún no hay ventas hoy.</p>
          ) : (
            <div className="divide-y divide-border-soft">
              {topProductos.map((d) => (
                <div key={d.id} className="flex items-center gap-2.5 py-2">
                  <span className="text-2xl">{d.icono}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{d.nombre}</div>
                    <div className="text-[11px] text-text-muted">{d.categoria}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-dark tabular-nums">
                      {d.cantidad} uds
                    </div>
                    <div className="text-xs text-text-muted tabular-nums">
                      {fmtMoney(d.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="💳 Métodos de pago">
          {porMetodo.every((m) => m.total === 0) ? (
            <p className="text-sm text-text-muted">Sin pagos hoy.</p>
          ) : (
            <div className="space-y-2">
              {porMetodo.map((d) => {
                const icon = d.metodo === "efectivo" ? "💵" : "💳";
                return (
                  <div
                    key={d.metodo}
                    className="flex items-center gap-2.5 p-3 bg-bg-soft rounded-lg"
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="flex-1 text-sm font-medium capitalize">{d.metodo}</span>
                    <span className="font-bold tabular-nums">{fmtMoney(d.total)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, color = "text-text" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white border border-border rounded-xl px-5 py-3.5">
      <div className="text-xs text-text-muted uppercase tracking-wide font-semibold">{label}</div>
      <div className={`text-3xl font-bold mt-1 tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-3.5">{title}</h3>
      {children}
    </div>
  );
}
