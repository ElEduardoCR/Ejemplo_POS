// Tipos del dominio POS

export type Categoria =
  | "snacks"
  | "refrescos"
  | "abarrotes"
  | "galletas"
  | "dulces"
  | "limpieza"
  | "higiene"
  | "cerveza"
  | "comida"
  | "botana"
  | "congelados"
  | "hogar";

export type MetodoPago = "efectivo" | "tarjeta" | "mixto";

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  costo: number;
  stock: number;
  stock_min: number;
  stock_max: number;
  unidad: string;
  icono: string;
  activo: boolean;
}

export interface CategoriaInfo {
  id: Categoria;
  nombre: string;
  icono: string;
  color: string;
}

export interface ItemVenta {
  producto_id: string;
  nombre: string;
  categoria: Categoria;
  cantidad: number;
  precio_unitario: number;
  costo_unitario: number;
  total: number;
  icono: string;
}

export interface Pago {
  metodo: MetodoPago;
  monto: number;
}

export interface Venta {
  id: string;
  timestamp: string; // ISO
  items: ItemVenta[];
  subtotal: number;
  total: number;
  pagos: Pago[];
  metodo: MetodoPago;
  efectivo_recibido: number;
  cambio: number;
  turno_id: number;
  cajero: string;
}

export interface TurnoActual {
  id: number;
  cajero: string;
  efectivo_inicial: number;
  activo_desde: string;
  estado: "abierto" | "cerrado";
}

export interface ResumenTurno {
  id: number;
  cajero: string;
  activo_desde: string;
  cerrado_en: string;
  efectivo_inicial: number;
  ventas_count: number;
  total_vendido: number;
  por_metodo: { efectivo: number; tarjeta: number };
  efectivo_esperado: number;
  efectivo_real: number;
  diferencia: number;
  items_vendidos: {
    producto_id: string;
    nombre: string;
    cantidad: number;
    total: number;
  }[];
}

export interface Sandbox {
  velocidad_simulacion: number;
  hora_actual: string; // HH:MM
  fecha_actual: string; // YYYY-MM-DD
  activo: boolean;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}
