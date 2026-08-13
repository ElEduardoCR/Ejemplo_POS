"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/modal";
import { Keypad } from "@/components/keypad";
import { useStore } from "@/lib/store";
import { fmtMoney } from "@/lib/utils";
import type { MetodoPago, Venta } from "@/lib/types";

interface PayModalProps {
  open: boolean;
  total: number;
  onClose: () => void;
  onSuccess: (venta: Venta) => void;
}

export function PayModal({ open, total, onClose, onSuccess }: PayModalProps) {
  const registrarVenta = useStore((s) => s.registrarVenta);
  const carrito = useStore((s) => s.carrito);
  const [metodo, setMetodo] = useState<MetodoPago>("efectivo");
  const [efectivoRecibido, setEfectivoRecibido] = useState(Math.ceil(total));
  const [mixtoEfvo, setMixtoEfvo] = useState(0);
  const [mixtoTarj, setMixtoTarj] = useState(0);

  const canConfirm = useMemo(() => {
    if (metodo === "tarjeta") return true;
    if (metodo === "efectivo") return efectivoRecibido >= total;
    if (metodo === "mixto") return mixtoEfvo + mixtoTarj >= total - 0.01;
    return false;
  }, [metodo, efectivoRecibido, mixtoEfvo, mixtoTarj, total]);

  const handleConfirm = () => {
    const items = carrito.map((it) => ({
      producto_id: it.producto.id,
      cantidad: it.cantidad,
      precio_unitario: it.producto.precio,
    }));
    let pagos;
    if (metodo === "efectivo") pagos = [{ metodo: "efectivo" as const, monto: total }];
    else if (metodo === "tarjeta") pagos = [{ metodo: "tarjeta" as const, monto: total }];
    else {
      pagos = [
        { metodo: "efectivo" as const, monto: mixtoEfvo },
        { metodo: "tarjeta" as const, monto: mixtoTarj },
      ].filter((p) => p.monto > 0);
    }
    const venta = registrarVenta({
      items,
      pagos,
      efectivo_recibido: metodo === "efectivo" ? efectivoRecibido : 0,
    });
    if (venta) onSuccess(venta);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="💵 Cobrar venta"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-bg-soft font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="px-4 py-2 rounded-lg bg-primary text-topbar hover:bg-primary-dark disabled:bg-border disabled:text-text-soft disabled:cursor-not-allowed font-semibold"
          >
            ✓ Confirmar venta
          </button>
        </>
      }
    >
      <div className="bg-bg-soft rounded-lg p-4 flex justify-between items-center mb-4">
        <span className="text-text-muted">Total a cobrar</span>
        <span className="text-3xl font-bold tabular-nums">{fmtMoney(total)}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {(["efectivo", "tarjeta", "mixto"] as MetodoPago[]).map((m) => {
          const icon = m === "efectivo" ? "💵" : m === "tarjeta" ? "💳" : "🔀";
          const label = m === "efectivo" ? "Efectivo" : m === "tarjeta" ? "Tarjeta" : "Mixto";
          return (
            <button
              key={m}
              onClick={() => setMetodo(m)}
              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-1 text-sm font-medium transition ${
                metodo === m
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-primary"
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {metodo === "efectivo" && (
        <div>
          <label className="block text-xs uppercase font-semibold text-text-muted mb-2 tracking-wide">
            ¿Con cuánto paga?
          </label>
          <Keypad value={efectivoRecibido} onChange={setEfectivoRecibido} />
          <div className="mt-3 flex justify-between border border-border bg-white rounded-lg p-3">
            <div>
              <div className="text-xs text-text-muted">Recibido</div>
              <div className="text-xl font-bold tabular-nums">
                {fmtMoney(efectivoRecibido)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-muted">Cambio</div>
              <div className="text-xl font-bold text-success tabular-nums">
                {fmtMoney(Math.max(efectivoRecibido - total, 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {metodo === "tarjeta" && (
        <div>
          <div className="bg-gradient-to-br from-topbar to-gray-600 text-white rounded-xl p-6 mb-3">
            <div className="text-3xl mb-4">💳</div>
            <div className="text-lg font-semibold tracking-widest">**** **** **** 4242</div>
            <div className="text-xs opacity-70 mt-2">CLIENTE DEMO</div>
          </div>
          <p className="text-xs text-text-muted">
            Simula la lectura de tarjeta. Al confirmar, se registrará el cargo.
          </p>
        </div>
      )}

      {metodo === "mixto" && (
        <div className="space-y-3">
          <div className="pb-3 border-b border-border-soft">
            <label className="text-xs font-semibold text-text-muted mb-1.5 block">
              💵 Efectivo
            </label>
            <Keypad value={mixtoEfvo} onChange={setMixtoEfvo} />
            <div className="text-right text-base font-bold text-primary-dark tabular-nums mt-2">
              {fmtMoney(mixtoEfvo)}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted mb-1.5 block">
              💳 Tarjeta
            </label>
            <Keypad value={mixtoTarj} onChange={setMixtoTarj} />
            <div className="text-right text-base font-bold text-primary-dark tabular-nums mt-2">
              {fmtMoney(mixtoTarj)}
            </div>
          </div>
          <div className="flex justify-between bg-white border border-border rounded-lg p-3">
            <div>
              <div className="text-xs text-text-muted">Cubierto</div>
              <div className="text-lg font-bold tabular-nums">
                {fmtMoney(mixtoEfvo + mixtoTarj)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-muted">Restante</div>
              <div className="text-lg font-bold tabular-nums">
                {fmtMoney(Math.max(total - mixtoEfvo - mixtoTarj, 0))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
