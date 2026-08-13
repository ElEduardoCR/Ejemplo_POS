# 🛒 Ejemplo POS — Abarrotes Don Eduardo (Sandbox Next.js)

Sistema sandbox de **Punto de Venta** estilo tienda de abarrotes (Oxxo-like),
hecho con **Next.js 16 + TypeScript + Tailwind CSS 4**.

**100% client-side.** El estado vive en `sessionStorage`, así que la sesión
dura lo que el navegador esté abierto — al cerrar la pestaña todo se reinicia.

---

## ✨ Funcionalidades

### 🛒 POS (Punto de Venta)
- Grid de 144 productos en 12 categorías estilo Oxxo
- Carrito con modificadores de cantidad
- **Pago en efectivo** con teclado numérico y cálculo de cambio en vivo
- **Pago con tarjeta** simulado
- **Pago mixto** (parte efectivo + parte tarjeta)
- Recibo imprimible

### 📦 Inventario en tiempo real
- Stock, costo, precio, máximo y mínimo por producto
- Barras visuales de stock
- Alertas de stock bajo / sin stock
- Edición en línea y reabastecimiento al máximo con un click
- Filtros por categoría, estado y búsqueda

### 📊 Back Office
- KPIs del día: ventas, total, ticket promedio, items, alertas
- Gráfica de **ventas por hora**
- Top 15 productos del día
- Ventas por categoría con barras proporcionales
- Ventas por método de pago

### 🛍️ Compras próximas (sugeridas)
- Lista automática de productos con `stock <= stock_min`
- Cantidad sugerida para llenar al máximo
- Costo estimado y proveedor sugerido
- Botón de "Recibir" que repone al máximo

### 💰 Corte de caja
- Resumen del turno actual con efectivo, ventas y desglose
- Arqueo: captura de efectivo real, cálculo de diferencia
- Al cerrar: archiva el turno, abre uno nuevo, muestra resumen
- Historial de turnos cerrados

### 🎮 Sandbox
- **Reloj simulado**: avanza en minutos/horas
- **Generador de ventas aleatorias** con distribución realista
- **Simular día completo**: 100-180 ventas siguiendo curva de demanda real
- **Reset**: vuelve al estado inicial

---

## 🚀 Cómo correr

### Local
```bash
npm install
npm run dev
# Abre http://localhost:3000
```

### Build de producción
```bash
npm run build
npm start
```

### Deploy en Vercel
- Conecta el repo en Vercel
- Vercel detecta Next.js automáticamente
- Sin variables de entorno, sin config adicional
- Build estático, sin serverless functions

---

## 🎮 Flujo de demo

1. Abre la app
2. Click en 🎮 (esquina superior derecha) → panel del sandbox
3. **"▶ Simular día completo"** → genera 100–180 ventas en segundos
4. Visita **Inventario** → ves alertas de stock bajo
5. Visita **Compras** → lista sugerida con inversión estimada
6. **Back Office** → gráfica con pico a las 14:00, top productos
7. **Corte** → cierra el turno capturando el efectivo real

> **Tip:** La sesión se borra al cerrar la pestaña. Si quieres mantener el estado
> entre sesiones, cambia `sessionStorage` por `localStorage` en `lib/store.ts`.

---

## 🏗️ Arquitectura

```
app/
├── layout.tsx                # Layout raíz con Topbar y panel
├── globals.css               # Tema Tailwind
├── page.tsx                  # POS
├── inventario/page.tsx       # Inventario
├── backoffice/page.tsx       # Analíticas
├── compras/page.tsx          # Compras próximas
└── corte/page.tsx            # Corte de caja

components/
├── topbar.tsx
├── sandbox-panel.tsx
├── toast.tsx
├── modal.tsx
├── keypad.tsx
└── pos/
    ├── category-sidebar.tsx
    ├── product-grid.tsx
    ├── cart.tsx
    ├── pay-modal.tsx
    └── receipt-modal.tsx

lib/
├── types.ts                  # Tipos del dominio
├── seed.ts                   # Catálogo (144 productos)
├── store.ts                  # Zustand + sessionStorage
├── simulator.ts              # Generador de ventas aleatorias
└── utils.ts                  # Helpers (money, fecha, id)
```

---

## 🛠️ Stack

- **Next.js 16.3** (App Router) + **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Zustand** con persistencia en `sessionStorage`
- **Recharts** para las gráficas
- **lucide-react** para iconos

---

## 💡 ¿Por qué client-side?

Esta es una **sandbox de demo**. Todo corre en el navegador:

- ✅ Deploy trivial en Vercel (es estático, ni siquiera necesita serverless functions)
- ✅ Estado persistente mientras el navegador esté abierto
- ✅ Cero latencia, todas las acciones son instantáneas
- ✅ No necesita base de datos ni backend
- ⚠️ Al cerrar la pestaña se pierde el estado (es lo que pediste)

Si en el futuro quieres estado persistente entre sesiones, basta con cambiar
`sessionStorage` por `localStorage` en `lib/store.ts`.
