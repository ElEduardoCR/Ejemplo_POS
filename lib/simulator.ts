// Simulador de ventas aleatorias
// Funciones puras que retornan datos; el store se encarga de aplicarlos.

import type { Producto, Venta } from "./types";
import { pickRandom, pickWeighted, generarFolioVenta, nowSandboxISO } from "./utils";

const PESOS_CATEGORIA: Record<string, number> = {
  refrescos: 22,
  snacks: 18,
  abarrotes: 12,
  comida: 10,
  cerveza: 8,
  dulces: 7,
  galletas: 6,
  limpieza: 5,
  higiene: 4,
  botana: 3,
  congelados: 3,
  hogar: 2,
};

const PESOS_HORA = (h: number): number => {
  // 8-22 (15 horas) con picos comida (12-14) y tarde (18-20)
  const pesos = [4, 5, 6, 7, 8, 10, 14, 16, 13, 9, 7, 5, 3, 2, 1];
  return pesos[h - 8] ?? 1;
};

export interface VentaGenerada {
  venta: Venta;
  productosActualizados: Producto[];
}

export interface Snapshot {
  productos: Producto[];
  ventas: Venta[];
  sandbox: { fecha_actual: string; hora_actual: string };
  turno: { id: number; cajero: string };
}

export function buildVenta(state: Snapshot): VentaGenerada | null {
  const { productos, sandbox, turno } = state;
  const disponibles = productos.filter((p) => p.stock > 0);
  if (!disponibles.length) return null;

  const nItems = pickWeighted(
    [1, 2, 3, 4, 5, 6, 7, 8],
    [15, 25, 20, 12, 8, 6, 5, 9]
  );

  const items: { producto: Producto; cantidad: number }[] = [];
  const usados = new Set<string>();
  for (let i = 0; i < nItems; i++) {
    const pool = disponibles.filter((p) => !usados.has(p.id));
    if (!pool.length) break;
    const cats = Array.from(new Set(pool.map((p) => p.categoria)));
    const weights = cats.map((c) => PESOS_CATEGORIA[c] ?? 1);
    const cat = pickWeighted(cats, weights);
    const pPool = pool.filter((p) => p.categoria === cat);
    const p = pickRandom(pPool);
    usados.add(p.id);
    const max = Math.min(p.stock, 6);
    const qty = 1 + Math.floor(Math.random() * max);
    items.push({ producto: p, cantidad: qty });
  }
  if (!items.length) return null;

  const r = Math.random();
  const totalCalc = items.reduce((s, it) => s + it.producto.precio * it.cantidad, 0);
  let pagos: Venta["pagos"];
  let metodo: Venta["metodo"];
  if (r < 0.6) {
    pagos = [{ metodo: "efectivo", monto: Math.round(totalCalc * 100) / 100 }];
    metodo = "efectivo";
  } else if (r < 0.95) {
    pagos = [{ metodo: "tarjeta", monto: Math.round(totalCalc * 100) / 100 }];
    metodo = "tarjeta";
  } else {
    const mitad = Math.round((totalCalc / 2) * 100) / 100;
    pagos = [
      { metodo: "efectivo", monto: mitad },
      { metodo: "tarjeta", monto: Math.round((totalCalc - mitad) * 100) / 100 },
    ];
    metodo = "mixto";
  }

  const itemsFull = items.map(({ producto, cantidad }) => ({
    producto_id: producto.id,
    nombre: producto.nombre,
    categoria: producto.categoria,
    cantidad,
    precio_unitario: producto.precio,
    costo_unitario: producto.costo,
    total: Math.round(producto.precio * cantidad * 100) / 100,
    icono: producto.icono,
  }));

  const subtotal = Math.round(totalCalc * 100) / 100;
  const venta: Venta = {
    id: generarFolioVenta(),
    timestamp: nowSandboxISO(sandbox.fecha_actual, sandbox.hora_actual),
    items: itemsFull,
    subtotal,
    total: subtotal,
    pagos,
    metodo,
    efectivo_recibido: metodo === "efectivo" ? subtotal : 0,
    cambio: 0,
    turno_id: turno.id,
    cajero: turno.cajero,
  };

  const productosActualizados = productos.map((p) => {
    const it = items.find((i) => i.producto.id === p.id);
    return it ? { ...p, stock: p.stock - it.cantidad } : p;
  });

  return { venta, productosActualizados };
}
