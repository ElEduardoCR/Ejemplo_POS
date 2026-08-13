// Store global con Zustand + persistencia en sessionStorage
// La sesión vive mientras el navegador esté abierto (se limpia al cerrar pestaña)

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Producto,
  Venta,
  TurnoActual,
  ResumenTurno,
  Sandbox,
  CarritoItem,
  Categoria,
} from "./types";
import { generarProductosSeed, CATEGORIAS } from "./seed";
import { generarFolioVenta, nowSandboxISO, pickWeighted } from "./utils";
import { buildVenta } from "./simulator";

type Estado = {
  // Catálogo (se carga del seed la primera vez, luego vive en sessionStorage)
  productos: Producto[];
  categorias: typeof CATEGORIAS;

  // Sandbox (reloj simulado)
  sandbox: Sandbox;

  // Turno actual
  turno: TurnoActual;

  // Historial
  ventas: Venta[];
  turnosCerrados: ResumenTurno[];

  // Carrito (no se persiste — se limpia al cambiar de pantalla o refresh)
  carrito: CarritoItem[];

  // Toast (estado efímero)
  toasts: { id: string; msg: string; type: "info" | "success" | "warning" | "error" }[];

  // === Acciones ===
  reset: () => void;
  simularVenta: () => Venta | null;
  simularDia: () => number;
  avanzarTiempo: (minutos: number) => void;

  // Carrito
  addToCart: (productoId: string) => void;
  changeQty: (productoId: string, delta: number) => void;
  setQty: (productoId: string, qty: number) => void;
  removeFromCart: (productoId: string) => void;
  clearCart: () => void;

  // Venta
  registrarVenta: (params: {
    items: { producto_id: string; cantidad: number; precio_unitario: number }[];
    pagos: { metodo: "efectivo" | "tarjeta" | "mixto"; monto: number }[];
    efectivo_recibido: number;
  }) => Venta | null;

  // Inventario
  updateProducto: (id: string, changes: Partial<Producto>) => void;
  reabastecer: (id: string, cantidad?: number) => void;

  // Turno
  cerrarTurno: (efectivoReal: number) => ResumenTurno | null;

  // Toasts
  notify: (msg: string, type?: "info" | "success" | "warning" | "error") => void;
  removeToast: (id: string) => void;
};

const productosIniciales = generarProductosSeed();
const sandboxInicial: Sandbox = {
  velocidad_simulacion: 60,
  hora_actual: "08:00",
  fecha_actual: new Date().toISOString().slice(0, 10),
  activo: true,
};
const turnoInicial: TurnoActual = {
  id: 1,
  cajero: "Cajero Demo",
  efectivo_inicial: 1000,
  activo_desde: new Date().toISOString(),
  estado: "abierto",
};

export const useStore = create<Estado>()(
  persist(
    (set, get) => ({
      productos: productosIniciales,
      categorias: CATEGORIAS,
      sandbox: sandboxInicial,
      turno: turnoInicial,
      ventas: [],
      turnosCerrados: [],
      carrito: [],
      toasts: [],

      reset: () => {
        set({
          productos: generarProductosSeed(),
          sandbox: {
            ...sandboxInicial,
            fecha_actual: new Date().toISOString().slice(0, 10),
          },
          turno: {
            ...turnoInicial,
            activo_desde: new Date().toISOString(),
          },
          ventas: [],
          turnosCerrados: [],
          carrito: [],
        });
        get().notify("Sistema reiniciado", "success");
      },

      // ============ Sandbox ============
      avanzarTiempo: (minutos) => {
        const sb = get().sandbox;
        const [hh, mm] = sb.hora_actual.split(":").map(Number);
        const date = new Date(`${sb.fecha_actual}T${hh}:${mm}:00`);
        date.setMinutes(date.getMinutes() + minutos);
        set({
          sandbox: {
            ...sb,
            fecha_actual: date.toISOString().slice(0, 10),
            hora_actual: date.toTimeString().slice(0, 5),
          },
        });
      },

      // ============ Carrito ============
      addToCart: (productoId) => {
        const { productos, carrito } = get();
        const p = productos.find((x) => x.id === productoId);
        if (!p) return;
        const existente = carrito.find((c) => c.producto.id === productoId);
        const nueva = existente ? existente.cantidad + 1 : 1;
        if (nueva > p.stock) {
          get().notify(`Solo hay ${p.stock} unidades de ${p.nombre}`, "warning");
          return;
        }
        if (existente) {
          set({
            carrito: carrito.map((c) =>
              c.producto.id === productoId ? { ...c, cantidad: nueva } : c
            ),
          });
        } else {
          set({ carrito: [...carrito, { producto: p, cantidad: 1 }] });
        }
      },

      changeQty: (productoId, delta) => {
        const { carrito, productos } = get();
        const item = carrito.find((c) => c.producto.id === productoId);
        if (!item) return;
        const nueva = item.cantidad + delta;
        if (nueva <= 0) {
          set({ carrito: carrito.filter((c) => c.producto.id !== productoId) });
        } else {
          const p = productos.find((x) => x.id === productoId);
          if (p && nueva > p.stock) {
            get().notify(`Solo hay ${p.stock} unidades`, "warning");
            return;
          }
          set({
            carrito: carrito.map((c) =>
              c.producto.id === productoId ? { ...c, cantidad: nueva } : c
            ),
          });
        }
      },

      setQty: (productoId, qty) => {
        const { carrito, productos } = get();
        const item = carrito.find((c) => c.producto.id === productoId);
        if (!item) return;
        qty = Math.max(0, Math.floor(qty));
        if (qty === 0) {
          set({ carrito: carrito.filter((c) => c.producto.id !== productoId) });
        } else {
          const p = productos.find((x) => x.id === productoId);
          if (p && qty > p.stock) {
            get().notify(`Solo hay ${p.stock} unidades`, "warning");
            return;
          }
          set({
            carrito: carrito.map((c) =>
              c.producto.id === productoId ? { ...c, cantidad: qty } : c
            ),
          });
        }
      },

      removeFromCart: (productoId) => {
        set({ carrito: get().carrito.filter((c) => c.producto.id !== productoId) });
      },

      clearCart: () => set({ carrito: [] }),

      // ============ Venta ============
      registrarVenta: ({ items, pagos, efectivo_recibido }) => {
        const { productos, sandbox, turno, ventas } = get();
        const productosIdx = new Map(productos.map((p) => [p.id, p]));

        // Validar stock
        for (const it of items) {
          const p = productosIdx.get(it.producto_id);
          if (!p || p.stock < it.cantidad) {
            get().notify("Stock insuficiente", "error");
            return null;
          }
        }

        const itemsFull = items.map((it) => {
          const p = productosIdx.get(it.producto_id)!;
          return {
            producto_id: p.id,
            nombre: p.nombre,
            categoria: p.categoria,
            cantidad: it.cantidad,
            precio_unitario: it.precio_unitario,
            costo_unitario: p.costo,
            total: Math.round(it.precio_unitario * it.cantidad * 100) / 100,
            icono: p.icono,
          };
        });

        const subtotal = itemsFull.reduce((s, it) => s + it.total, 0);
        const totalPagos = pagos.reduce((s, p) => s + p.monto, 0);
        if (totalPagos < subtotal - 0.001) {
          get().notify("Pago insuficiente", "error");
          return null;
        }

        const metodo: "efectivo" | "tarjeta" | "mixto" =
          pagos.length === 1 ? pagos[0].metodo : "mixto";
        const cambio =
          metodo === "efectivo" || metodo === "mixto"
            ? Math.max(efectivo_recibido - subtotal, 0)
            : 0;

        // Descontar stock
        const productosActualizados = productos.map((p) => {
          const it = items.find((i) => i.producto_id === p.id);
          if (it) {
            return { ...p, stock: p.stock - it.cantidad };
          }
          return p;
        });

        const venta: Venta = {
          id: generarFolioVenta(),
          timestamp: nowSandboxISO(sandbox.fecha_actual, sandbox.hora_actual),
          items: itemsFull,
          subtotal: Math.round(subtotal * 100) / 100,
          total: Math.round(subtotal * 100) / 100,
          pagos,
          metodo,
          efectivo_recibido: Math.round(efectivo_recibido * 100) / 100,
          cambio: Math.round(cambio * 100) / 100,
          turno_id: turno.id,
          cajero: turno.cajero,
        };

        set({
          productos: productosActualizados,
          ventas: [...ventas, venta],
          carrito: [],
        });

        get().notify("Venta registrada ✓", "success");
        return venta;
      },

      // ============ Simulador ============
      simularVenta: () => {
        const result = buildVenta({
          productos: get().productos,
          ventas: get().ventas,
          sandbox: get().sandbox,
          turno: get().turno,
        });
        if (!result) {
          get().notify("No hay productos disponibles", "warning");
          return null;
        }
        set({
          productos: result.productosActualizados,
          ventas: [...get().ventas, result.venta],
        });
        return result.venta;
      },

      simularDia: () => {
        const fechaBase = get().sandbox.fecha_actual;
        const target = 100 + Math.floor(Math.random() * 80);
        const maxIter = 350;
        let count = 0;
        let iter = 0;
        const horas = Array.from({ length: 15 }, (_, i) => i + 8);
        const pesos = horas.map((h) => [4, 5, 6, 7, 8, 10, 14, 16, 13, 9, 7, 5, 3, 2, 1][h - 8] ?? 1);

        while (count < target && iter < maxIter) {
          const hora = pickWeighted(horas, pesos);
          const minuto = Math.floor(Math.random() * 60);
          const horaStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;

          // Mover reloj
          set({ sandbox: { ...get().sandbox, hora_actual: horaStr, fecha_actual: fechaBase } });

          const result = buildVenta({
            productos: get().productos,
            ventas: get().ventas,
            sandbox: get().sandbox,
            turno: get().turno,
          });
          if (result) {
            set({
              productos: result.productosActualizados,
              ventas: [...get().ventas, result.venta],
            });
            count++;
          }
          iter++;
        }
        set({ sandbox: { ...get().sandbox, hora_actual: "22:00" } });
        get().notify(`Día simulado: ${count} ventas generadas`, "success");
        return count;
      },

      // ============ Inventario ============
      updateProducto: (id, changes) => {
        set({
          productos: get().productos.map((p) =>
            p.id === id ? { ...p, ...changes } : p
          ),
        });
      },

      reabastecer: (id, cantidad) => {
        set({
          productos: get().productos.map((p) => {
            if (p.id !== id) return p;
            const nuevo = cantidad ? p.stock + cantidad : p.stock_max;
            return { ...p, stock: Math.min(nuevo, p.stock_max) };
          }),
        });
        const p = get().productos.find((x) => x.id === id);
        if (p) get().notify(`${p.nombre} reabastecido`, "success");
      },

      // ============ Turno ============
      cerrarTurno: (efectivoReal) => {
        const { turno, ventas, turnosCerrados } = get();
        const ventasTurno = ventas.filter((v) => v.turno_id === turno.id);
        const total_vendido = ventasTurno.reduce((s, v) => s + v.total, 0);
        const por_metodo: { efectivo: number; tarjeta: number } = { efectivo: 0, tarjeta: 0 };
        for (const v of ventasTurno) {
          for (const p of v.pagos) {
            if (p.metodo === "efectivo") por_metodo.efectivo += p.monto;
            else if (p.metodo === "tarjeta") por_metodo.tarjeta += p.monto;
          }
        }
        // Si hay pagos mixtos, contar mitad y mitad
        for (const v of ventasTurno) {
          if (v.metodo === "mixto") {
            const mitad = v.total / 2;
            por_metodo.efectivo += mitad;
            por_metodo.tarjeta += v.total - mitad;
          }
        }
        por_metodo.efectivo = Math.round(por_metodo.efectivo * 100) / 100;
        por_metodo.tarjeta = Math.round(por_metodo.tarjeta * 100) / 100;

        const efectivo_esperado = Math.round((turno.efectivo_inicial + por_metodo.efectivo) * 100) / 100;
        const diferencia = Math.round((efectivoReal - efectivo_esperado) * 100) / 100;

        const itemsMap = new Map<string, { producto_id: string; nombre: string; cantidad: number; total: number }>();
        for (const v of ventasTurno) {
          for (const it of v.items) {
            const ex = itemsMap.get(it.producto_id);
            if (ex) {
              ex.cantidad += it.cantidad;
              ex.total = Math.round((ex.total + it.total) * 100) / 100;
            } else {
              itemsMap.set(it.producto_id, {
                producto_id: it.producto_id,
                nombre: it.nombre,
                cantidad: it.cantidad,
                total: it.total,
              });
            }
          }
        }
        const items_vendidos = Array.from(itemsMap.values()).sort(
          (a, b) => b.cantidad - a.cantidad
        );

        const resumen: ResumenTurno = {
          id: turno.id,
          cajero: turno.cajero,
          activo_desde: turno.activo_desde,
          cerrado_en: nowSandboxISO(get().sandbox.fecha_actual, get().sandbox.hora_actual),
          efectivo_inicial: turno.efectivo_inicial,
          ventas_count: ventasTurno.length,
          total_vendido: Math.round(total_vendido * 100) / 100,
          por_metodo: por_metodo,
          efectivo_esperado,
          efectivo_real: Math.round(efectivoReal * 100) / 100,
          diferencia,
          items_vendidos,
        };

        set({
          turnosCerrados: [...turnosCerrados, resumen],
          turno: {
            ...turno,
            id: turno.id + 1,
            efectivo_inicial: Math.round(efectivoReal * 100) / 100,
            activo_desde: nowSandboxISO(get().sandbox.fecha_actual, get().sandbox.hora_actual),
          },
        });

        get().notify("Turno cerrado ✓", "success");
        return resumen;
      },

      // ============ Toasts ============
      notify: (msg, type = "info") => {
        const id = Math.random().toString(36).slice(2);
        set({ toasts: [...get().toasts, { id, msg, type }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        }, 3000);
      },
      removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
    }),
    {
      name: "pos-sandbox",
      storage: createJSONStorage(() => sessionStorage), // <- AQUÍ la magia: sesión = navegador abierto
      partialize: (state) => ({
        productos: state.productos,
        categorias: state.categorias,
        sandbox: state.sandbox,
        turno: state.turno,
        ventas: state.ventas,
        turnosCerrados: state.turnosCerrados,
        // NO persistimos carrito ni toasts (efímeros)
      }),
    }
  )
);

// ============================================
// Simulador (funciones puras, no hooks)
// ============================================
