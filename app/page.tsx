"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { CategorySidebar } from "@/components/pos/category-sidebar";
import { ProductGrid } from "@/components/pos/product-grid";
import { Cart } from "@/components/pos/cart";
import { PayModal } from "@/components/pos/pay-modal";
import { ReceiptModal } from "@/components/pos/receipt-modal";
import type { Categoria, Venta } from "@/lib/types";

export default function POSPage() {
  const productos = useStore((s) => s.productos);
  const categorias = useStore((s) => s.categorias);
  const carrito = useStore((s) => s.carrito);
  const addToCart = useStore((s) => s.addToCart);

  const [catActiva, setCatActiva] = useState<Categoria | "all">("all");
  const [busqueda, setBusqueda] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastVenta, setLastVenta] = useState<Venta | null>(null);

  const total = useMemo(
    () => carrito.reduce((s, it) => s + it.producto.precio * it.cantidad, 0),
    [carrito]
  );

  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return productos.filter((p) => {
      if (!p.activo) return false;
      if (catActiva !== "all" && p.categoria !== catActiva) return false;
      if (q && !p.nombre.toLowerCase().includes(q) && !p.sku.includes(q)) return false;
      return true;
    });
  }, [productos, catActiva, busqueda]);

  const handlePaySuccess = (venta: Venta) => {
    setLastVenta(venta);
    setPayOpen(false);
    setReceiptOpen(true);
  };

  return (
    <div className="grid grid-cols-[200px_1fr_340px] flex-1 overflow-hidden">
      <CategorySidebar
        categorias={categorias}
        activa={catActiva}
        onSelect={setCatActiva}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
      />
      <ProductGrid productos={productosFiltrados} onAdd={addToCart} />
      <Cart onPay={() => setPayOpen(true)} />

      <PayModal
        open={payOpen}
        total={total}
        onClose={() => setPayOpen(false)}
        onSuccess={handlePaySuccess}
      />
      <ReceiptModal
        open={receiptOpen}
        venta={lastVenta}
        onClose={() => setReceiptOpen(false)}
      />
    </div>
  );
}
