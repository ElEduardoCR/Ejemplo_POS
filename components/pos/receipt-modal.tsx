"use client";

import { Modal } from "@/components/modal";
import type { Venta } from "@/lib/types";
import { fmtMoney, fmtFechaHora } from "@/lib/utils";

interface ReceiptModalProps {
  open: boolean;
  venta: Venta | null;
  onClose: () => void;
}

export function ReceiptModal({ open, venta, onClose }: ReceiptModalProps) {
  if (!venta) return null;
  const showChange = venta.efectivo_recibido > 0 || venta.cambio > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-bg-soft font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-primary text-topbar hover:bg-primary-dark font-semibold"
          >
            🖨️ Imprimir
          </button>
        </>
      }
    >
      <div className="font-mono text-sm">
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold">🛒 Abarrotes Don Eduardo</h2>
          <p className="text-[11px] text-text-muted">
            Av. Siempre Viva #742 · Tel: 55-1234-5678
          </p>
          <p className="text-[11px] text-text-muted">RFC: XAXX010101000</p>
        </div>

        <div className="text-xs space-y-0.5 mb-3 leading-relaxed">
          <div>
            <span className="text-text-muted">Folio:</span> {venta.id}
          </div>
          <div>
            <span className="text-text-muted">Fecha:</span> {fmtFechaHora(venta.timestamp)}
          </div>
          <div>
            <span className="text-text-muted">Cajero:</span> {venta.cajero}
          </div>
        </div>

        <table className="w-full text-xs mb-3">
          <thead>
            <tr className="border-b border-dashed border-border">
              <th className="text-left py-1 font-medium">Producto</th>
              <th className="text-right py-1 font-medium">Cant</th>
              <th className="text-right py-1 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {venta.items.map((it, i) => (
              <tr key={i}>
                <td className="py-1 align-top">
                  {it.icono} {it.nombre}
                </td>
                <td className="text-right align-top tabular-nums">
                  {it.cantidad} × {fmtMoney(it.precio_unitario)}
                </td>
                <td className="text-right align-top tabular-nums">
                  {fmtMoney(it.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed border-border pt-2 mb-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="tabular-nums">{fmtMoney(venta.subtotal)}</span>
          </div>
          <div className="flex justify-between text-base font-bold mt-1">
            <span>TOTAL</span>
            <span className="tabular-nums">{fmtMoney(venta.total)}</span>
          </div>
        </div>

        <div className="bg-bg-soft rounded p-2 text-xs space-y-0.5 mb-3">
          {venta.pagos.map((p, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {p.metodo === "efectivo" ? "💵" : "💳"} {p.metodo}
              </span>
              <span className="tabular-nums">{fmtMoney(p.monto)}</span>
            </div>
          ))}
        </div>

        {showChange && (
          <div className="text-xs space-y-0.5 mb-3">
            <div className="flex justify-between">
              <span>Recibido</span>
              <span className="tabular-nums">{fmtMoney(venta.efectivo_recibido)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cambio</span>
              <span className="tabular-nums font-semibold">
                {fmtMoney(venta.cambio)}
              </span>
            </div>
          </div>
        )}

        <div className="text-center text-xs mt-4 pt-3 border-t border-dashed border-border">
          <p>¡Gracias por su compra!</p>
          <p className="text-text-muted">Este es un comprobante de sandbox.</p>
        </div>
      </div>
    </Modal>
  );
}
