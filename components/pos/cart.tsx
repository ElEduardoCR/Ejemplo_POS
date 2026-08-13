"use client";

import { Trash2, Plus, Minus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtMoney } from "@/lib/utils";

export function Cart({ onPay }: { onPay: () => void }) {
  const carrito = useStore((s) => s.carrito);
  const changeQty = useStore((s) => s.changeQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);

  const total = carrito.reduce(
    (s, it) => s + it.producto.precio * it.cantidad,
    0
  );

  return (
    <aside className="bg-bg-card border-l border-border flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-base flex items-center gap-2">
          🛒 Carrito
        </h3>
        {carrito.length > 0 && (
          <button
            onClick={() => {
              if (confirm("¿Vaciar el carrito?")) clearCart();
            }}
            className="w-8 h-8 rounded-lg bg-bg-soft hover:bg-danger-soft hover:text-danger flex items-center justify-center transition"
            title="Vaciar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {carrito.length === 0 ? (
          <div className="text-center text-text-soft text-sm py-10 px-5">
            El carrito está vacío. Toca un producto para agregarlo.
          </div>
        ) : (
          carrito.map((it) => (
            <div
              key={it.producto.id}
              className="flex items-center gap-2 p-2 rounded-lg mb-1 bg-bg-soft"
            >
              <div className="text-2xl shrink-0">{it.producto.icono}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{it.producto.nombre}</div>
                <div className="text-[11px] text-text-muted tabular-nums">
                  {fmtMoney(it.producto.precio)} c/u
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeQty(it.producto.id, -1)}
                  className="w-7 h-7 rounded-md bg-white border border-border hover:bg-primary-soft text-sm flex items-center justify-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={it.cantidad}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 1;
                    changeQty(it.producto.id, v - it.cantidad);
                  }}
                  className="w-9 text-center border border-border rounded-md h-7 bg-white text-sm tabular-nums"
                />
                <button
                  onClick={() => changeQty(it.producto.id, 1)}
                  className="w-7 h-7 rounded-md bg-white border border-border hover:bg-primary-soft text-sm flex items-center justify-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="font-semibold text-sm tabular-nums min-w-[60px] text-right">
                {fmtMoney(it.producto.precio * it.cantidad)}
              </div>
              <button
                onClick={() => removeFromCart(it.producto.id)}
                className="w-7 h-7 rounded-md text-text-soft hover:bg-danger-soft hover:text-danger flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border p-4 bg-bg-soft">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-text-muted">Total</span>
          <span className="text-3xl font-bold tabular-nums">{fmtMoney(total)}</span>
        </div>
        <button
          onClick={onPay}
          disabled={carrito.length === 0}
          className="w-full bg-primary text-topbar hover:bg-primary-dark disabled:bg-border disabled:text-text-soft disabled:cursor-not-allowed rounded-lg py-3.5 text-base font-bold transition"
        >
          💵 Cobrar
        </button>
      </div>
    </aside>
  );
}
