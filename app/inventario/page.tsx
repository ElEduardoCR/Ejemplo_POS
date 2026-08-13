"use client";

import { useState, useMemo } from "react";
import { Search, Edit, Package, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/modal";
import { fmtMoney } from "@/lib/utils";
import type { Producto } from "@/lib/types";

export default function InventarioPage() {
  const productos = useStore((s) => s.productos);
  const categorias = useStore((s) => s.categorias);
  const updateProducto = useStore((s) => s.updateProducto);
  const reabastecer = useStore((s) => s.reabastecer);
  const notify = useStore((s) => s.notify);

  const [busqueda, setBusqueda] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [editing, setEditing] = useState<Producto | null>(null);

  const stats = useMemo(() => {
    const total = productos.length;
    const low = productos.filter((p) => p.stock > 0 && p.stock <= p.stock_min).length;
    const out = productos.filter((p) => p.stock <= 0).length;
    const ok = total - low - out;
    const valor = productos.reduce((s, p) => s + p.costo * p.stock, 0);
    return { total, low, out, ok, valor };
  }, [productos]);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return productos.filter((p) => {
      if (q && !p.nombre.toLowerCase().includes(q) && !p.sku.includes(q)) return false;
      if (catFilter && p.categoria !== catFilter) return false;
      if (stockFilter === "low" && p.stock > p.stock_min) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      return true;
    });
  }, [productos, busqueda, catFilter, stockFilter]);

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">📦 Inventario</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white min-w-[260px]"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-white"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-white"
          >
            <option value="">Todo el stock</option>
            <option value="low">⚠️ Stock bajo</option>
            <option value="out">❌ Sin stock</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 mb-5">
        <Stat label="Total productos" value={stats.total.toString()} />
        <Stat label="En stock" value={stats.ok.toString()} color="text-success" />
        <Stat label="Stock bajo" value={stats.low.toString()} color="text-warning" />
        <Stat label="Sin stock" value={stats.out.toString()} color="text-danger" />
        <Stat label="Valor inventario" value={fmtMoney(stats.valor)} />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-soft">
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Producto</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">SKU</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Categoría</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Precio</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Costo</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Stock</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Mín / Máx</th>
              <th className="text-left p-2.5 text-[11px] uppercase tracking-wide text-text-muted font-semibold border-b border-border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-text-muted py-10">
                  No hay productos que coincidan.
                </td>
              </tr>
            ) : (
              filtrados.map((p) => {
                const pct = p.stock_max > 0 ? Math.min(100, (p.stock / p.stock_max) * 100) : 0;
                const barCls = p.stock <= 0 ? "bg-danger" : p.stock <= p.stock_min ? "bg-warning" : "bg-success";
                const badgeCls = p.stock <= 0 ? "bg-danger-soft text-danger" : p.stock <= p.stock_min ? "bg-warning-soft text-warning" : "bg-success-soft text-success";
                const badgeTxt = p.stock <= 0 ? "Sin stock" : p.stock <= p.stock_min ? "Bajo" : "OK";
                const cat = categorias.find((c) => c.id === p.categoria);
                return (
                  <tr key={p.id} className="hover:bg-bg-soft">
                    <td className="p-2.5 border-b border-border-soft">
                      <span className="text-lg mr-1.5">{p.icono}</span>
                      {p.nombre}
                    </td>
                    <td className="p-2.5 border-b border-border-soft text-text-muted text-xs">{p.sku}</td>
                    <td className="p-2.5 border-b border-border-soft">{cat?.nombre || p.categoria}</td>
                    <td className="p-2.5 border-b border-border-soft tabular-nums">{fmtMoney(p.precio)}</td>
                    <td className="p-2.5 border-b border-border-soft tabular-nums text-text-muted">{fmtMoney(p.costo)}</td>
                    <td className="p-2.5 border-b border-border-soft">
                      <div className="flex items-center gap-2">
                        <strong className="tabular-nums">{p.stock}</strong>
                        <div className="w-16 h-1.5 bg-bg-soft rounded-full overflow-hidden">
                          <div className={`h-full ${barCls}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeCls}`}>
                          {badgeTxt}
                        </span>
                      </div>
                    </td>
                    <td className="p-2.5 border-b border-border-soft text-xs text-text-muted">
                      {p.stock_min} / {p.stock_max}
                    </td>
                    <td className="p-2.5 border-b border-border-soft">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          className="w-7 h-7 rounded-md bg-bg-soft hover:bg-primary-soft text-text-muted flex items-center justify-center"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => reabastecer(p.id)}
                          className="w-7 h-7 rounded-md bg-bg-soft hover:bg-primary-soft text-text-muted flex items-center justify-center"
                          title="Reabastecer al máximo"
                        >
                          <Package className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing && <EditProductoModal producto={editing} onClose={() => setEditing(null)} onSave={(changes) => {
        updateProducto(editing.id, changes);
        notify("Producto actualizado", "success");
        setEditing(null);
      }} />}
    </div>
  );
}

function Stat({ label, value, color = "text-text" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white border border-border rounded-xl px-5 py-3.5">
      <div className="text-xs text-text-muted uppercase tracking-wide font-semibold">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function EditProductoModal({
  producto,
  onClose,
  onSave,
}: {
  producto: Producto;
  onClose: () => void;
  onSave: (changes: Partial<Producto>) => void;
}) {
  const [stock, setStock] = useState(String(producto.stock));
  const [stockMin, setStockMin] = useState(String(producto.stock_min));
  const [stockMax, setStockMax] = useState(String(producto.stock_max));
  const [precio, setPrecio] = useState(String(producto.precio));
  const [costo, setCosto] = useState(String(producto.costo));

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`✏️ Editar ${producto.nombre}`}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-bg-soft font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              onSave({
                stock: parseInt(stock) || 0,
                stock_min: parseInt(stockMin) || 0,
                stock_max: parseInt(stockMax) || 0,
                precio: parseFloat(precio) || 0,
                costo: parseFloat(costo) || 0,
              })
            }
            className="px-4 py-2 rounded-lg bg-primary text-topbar hover:bg-primary-dark font-semibold"
          >
            Guardar
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock" value={stock} onChange={setStock} type="number" />
        <Field label="Stock mín" value={stockMin} onChange={setStockMin} type="number" />
        <Field label="Stock máx" value={stockMax} onChange={setStockMax} type="number" />
        <Field label="Precio" value={precio} onChange={setPrecio} type="number" step="0.5" />
        <div className="col-span-2">
          <Field label="Costo" value={costo} onChange={setCosto} type="number" step="0.5" />
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:border-primary"
      />
    </label>
  );
}
