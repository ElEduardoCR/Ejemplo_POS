// Catálogo base embebido (se usa para inicializar la tienda)
// Estilo tienda de abarrotes / Oxxo

import type { CategoriaInfo } from "./types";

type TuplaProducto = readonly [
  string, // categoria
  string, // nombre
  number, // precio
  number, // costo
  string, // unidad
  string  // icono
];

export const CATALOGO_BASE: readonly TuplaProducto[] = [
  // Snacks
  ["snacks", "Sabritas Original 45g", 15.0, 9.5, "pza", "🥔"],
  ["snacks", "Sabritas Adobadas 45g", 15.0, 9.5, "pza", "🥔"],
  ["snacks", "Sabritas Limón 45g", 15.0, 9.5, "pza", "🥔"],
  ["snacks", "Cheetos Torciditos 52g", 14.0, 8.5, "pza", "🌽"],
  ["snacks", "Cheetos Poffs 50g", 14.0, 8.5, "pza", "🌽"],
  ["snacks", "Ruffles Queso 50g", 16.0, 10.0, "pza", "🥔"],
  ["snacks", "Tostitos Salsa Verde 65g", 18.0, 11.0, "pza", "🌽"],
  ["snacks", "Doritos Nacho 58g", 16.0, 10.0, "pza", "🌽"],
  ["snacks", "Fritos Chorizo 55g", 14.0, 8.5, "pza", "🌶️"],
  ["snacks", "Papas Caseras 50g", 18.0, 11.0, "pza", "🥔"],
  ["snacks", "Cacahuates Japoneses 50g", 12.0, 7.0, "pza", "🥜"],
  ["snacks", "Botana Mix 80g", 22.0, 13.0, "pza", "🥨"],
  // Refrescos
  ["refrescos", "Coca-Cola 600ml", 22.0, 13.0, "pza", "🥤"],
  ["refrescos", "Coca-Cola Sin Azúcar 600ml", 22.0, 13.0, "pza", "🥤"],
  ["refrescos", "Pepsi 600ml", 20.0, 12.0, "pza", "🥤"],
  ["refrescos", "Fanta Naranja 600ml", 20.0, 12.0, "pza", "🥤"],
  ["refrescos", "Sprite 600ml", 20.0, 12.0, "pza", "🥤"],
  ["refrescos", "Sidral Mundet 600ml", 20.0, 12.0, "pza", "🍎"],
  ["refrescos", "Manzanita Sol 600ml", 20.0, 12.0, "pza", "🍎"],
  ["refrescos", "Dr Pepper 600ml", 23.0, 14.0, "pza", "🥤"],
  ["refrescos", "Coca-Cola 2.5L", 48.0, 30.0, "pza", "🥤"],
  ["refrescos", "Agua Ciel 1L", 12.0, 6.0, "pza", "💧"],
  ["refrescos", "Agua Bonafont 1L", 12.0, 6.0, "pza", "💧"],
  ["refrescos", "Agua Mineral Topo Chico 355ml", 18.0, 10.0, "pza", "💧"],
  ["refrescos", "Jugo del Valle Naranja 500ml", 22.0, 13.0, "pza", "🧃"],
  ["refrescos", "Jugo Jumex Mango 450ml", 20.0, 12.0, "pza", "🧃"],
  ["refrescos", "Electrolit 625ml", 32.0, 20.0, "pza", "⚡"],
  ["refrescos", "Gatorade 500ml", 28.0, 17.0, "pza", "🏃"],
  ["refrescos", "Red Bull 250ml", 45.0, 28.0, "pza", "⚡"],
  ["refrescos", "Café Soluble Nescafé 200g", 95.0, 60.0, "pza", "☕"],
  ["refrescos", "Té Arizona 680ml", 22.0, 13.0, "pza", "🍵"],
  // Abarrotes
  ["abarrotes", "Arroz Verde Valle 1kg", 32.0, 22.0, "pza", "🍚"],
  ["abarrotes", "Frijol Negro La Costeña 1kg", 38.0, 25.0, "pza", "🫘"],
  ["abarrotes", "Azúcar Zulka 1kg", 30.0, 20.0, "pza", "🍬"],
  ["abarrotes", "Sal La Fina 1kg", 18.0, 10.0, "pza", "🧂"],
  ["abarrotes", "Aceite 1-2-3 1L", 55.0, 38.0, "pza", "🛢️"],
  ["abarrotes", "Aceite Capullo 1L", 65.0, 45.0, "pza", "🛢️"],
  ["abarrotes", "Atún en Agua Lata 140g", 22.0, 13.0, "pza", "🐟"],
  ["abarrotes", "Sardina en Tomate Lata 425g", 28.0, 17.0, "pza", "🐟"],
  ["abarrotes", "Chiles Jalapeños La Costeña 220g", 18.0, 10.0, "pza", "🌶️"],
  ["abarrotes", "Pasta Barilla Spaghetti 500g", 25.0, 15.0, "pza", "🍝"],
  ["abarrotes", "Salsa Valentina 370ml", 22.0, 13.0, "pza", "🌶️"],
  ["abarrotes", "Mayonesa McCormick 390g", 65.0, 42.0, "pza", "🥚"],
  ["abarrotes", "Café Soluble 50g", 35.0, 22.0, "pza", "☕"],
  ["abarrotes", "Leche Lala Entera 1L", 28.0, 18.0, "pza", "🥛"],
  ["abarrotes", "Leche Alpura Deslactosada 1L", 32.0, 20.0, "pza", "🥛"],
  ["abarrotes", "Mantequilla Lala 90g", 22.0, 13.0, "pza", "🧈"],
  ["abarrotes", "Huevo Blanco 12pz", 48.0, 32.0, "pza", "🥚"],
  ["abarrotes", "Pan Bimbo Doble Fibra 680g", 65.0, 42.0, "pza", "🍞"],
  ["abarrotes", "Tortillas de Maíz 1kg", 25.0, 16.0, "pza", "🫓"],
  // Galletas
  ["galletas", "Galletas Marías Gamesa 170g", 18.0, 11.0, "pza", "🍪"],
  ["galletas", "Galletas Saladitas Gamesa 150g", 18.0, 11.0, "pza", "🍪"],
  ["galletas", "Galletas Emperador Chocolate 91g", 18.0, 11.0, "pza", "🍪"],
  ["galletas", "Galletas Triki-Trakes 120g", 22.0, 13.0, "pza", "🍪"],
  ["galletas", "Chocorroles 3pz", 25.0, 15.0, "pza", "🍫"],
  ["galletas", "Donas Bimbo 6pz", 38.0, 23.0, "pza", "🍩"],
  ["galletas", "Mantecadas Bimbo 4pz", 32.0, 20.0, "pza", "🧁"],
  ["galletas", "Gansito Marinela 50g", 18.0, 11.0, "pza", "🍰"],
  ["galletas", "Pingüinos Marinela 3pz", 28.0, 17.0, "pza", "🍫"],
  ["galletas", "Submarinos Marinela 3pz", 28.0, 17.0, "pza", "🍫"],
  ["galletas", "Barritas Fresa 3pz", 22.0, 13.0, "pza", "🍓"],
  ["galletas", "Pan Tostado Bimbo 270g", 42.0, 26.0, "pza", "🍞"],
  // Dulces
  ["dulces", "Chocolate Carlos V 18g", 12.0, 7.0, "pza", "🍫"],
  ["dulces", "Chocolate Milky Way 52g", 18.0, 11.0, "pza", "🍫"],
  ["dulces", "Chocolate Snickers 52g", 18.0, 11.0, "pza", "🍫"],
  ["dulces", "Chocolate M&M's 47g", 22.0, 13.0, "pza", "🍫"],
  ["dulces", "Paleta Payaso 30g", 12.0, 7.0, "pza", "🍭"],
  ["dulces", "Paleta Bomba Bubbaloo", 5.0, 2.5, "pza", "🍬"],
  ["dulces", "Gomitas Gomilocas 30g", 12.0, 7.0, "pza", "🍬"],
  ["dulces", "Mazapán De la Rosa 28g", 8.0, 4.5, "pza", "🥜"],
  ["dulces", "Palanqueta de Cacahuate 50g", 10.0, 5.5, "pza", "🥜"],
  ["dulces", "Obleas con Cajeta 4pz", 22.0, 13.0, "pza", "🥞"],
  ["dulces", "Pelón Pelo Rico 35g", 12.0, 7.0, "pza", "🍬"],
  ["dulces", "Chicles Trident 12pz", 18.0, 10.0, "pza", "🍬"],
  // Limpieza
  ["limpieza", "Detergente Ariel 1kg", 75.0, 50.0, "pza", "🧺"],
  ["limpieza", "Detergente Fab 1kg", 65.0, 42.0, "pza", "🧺"],
  ["limpieza", "Detergente Roma 1kg", 55.0, 36.0, "pza", "🧺"],
  ["limpieza", "Jabón Zote 400g", 28.0, 17.0, "pza", "🧼"],
  ["limpieza", "Jabón para Trastes Foca 425g", 32.0, 20.0, "pza", "🧽"],
  ["limpieza", "Cloro Cloralex 1L", 28.0, 17.0, "pza", "🧴"],
  ["limpieza", "Pino Fabuloso 1L", 35.0, 22.0, "pza", "🧴"],
  ["limpieza", "Desinfectante Lysol 1L", 65.0, 42.0, "pza", "🧴"],
  ["limpieza", "Papel Higiénico Pétalo 4pz", 45.0, 28.0, "pza", "🧻"],
  ["limpieza", "Papel Higiénico Regio 4pz", 55.0, 35.0, "pza", "🧻"],
  ["limpieza", "Servilletas Pétalo 100pz", 28.0, 17.0, "pza", "🍽️"],
  ["limpieza", "Toallas Femeninas Kotex 10pz", 38.0, 24.0, "pza", "🌸"],
  ["limpieza", "Trapeador de Algodón", 75.0, 48.0, "pza", "🧹"],
  ["limpieza", "Escoba de Mijo", 65.0, 42.0, "pza", "🧹"],
  ["limpieza", "Fibras para Trastes Scotch-Brite 3pz", 28.0, 17.0, "pza", "🧽"],
  ["limpieza", "Bolsa de Basura 50L 10pz", 35.0, 22.0, "pza", "🗑️"],
  // Higiene
  ["higiene", "Shampoo Sedal 340ml", 55.0, 35.0, "pza", "🧴"],
  ["higiene", "Shampoo Pantene 400ml", 75.0, 48.0, "pza", "🧴"],
  ["higiene", "Jabón de Baño Dove 100g", 22.0, 13.0, "pza", "🧼"],
  ["higiene", "Jabón de Baño Palmolive 110g", 18.0, 10.0, "pza", "🧼"],
  ["higiene", "Pasta Dental Colgate 100ml", 32.0, 20.0, "pza", "🪥"],
  ["higiene", "Cepillo Dental Colgate 1pz", 25.0, 15.0, "pza", "🪥"],
  ["higiene", "Desodorante Rexona 150ml", 55.0, 35.0, "pza", "🧴"],
  ["higiene", "Desodorante Nivea 150ml", 65.0, 42.0, "pza", "🧴"],
  ["higiene", "Rastrillo Gillette 1pz", 35.0, 22.0, "pza", "🪒"],
  ["higiene", "Crema Nivea 100ml", 75.0, 48.0, "pza", "🧴"],
  // Cerveza
  ["cerveza", "Cerveza Corona 355ml", 22.0, 13.0, "pza", "🍺"],
  ["cerveza", "Cerveza Modelo Especial 355ml", 22.0, 13.0, "pza", "🍺"],
  ["cerveza", "Cerveza Pacifico 355ml", 22.0, 13.0, "pza", "🍺"],
  ["cerveza", "Cerveza Victoria 355ml", 20.0, 12.0, "pza", "🍺"],
  ["cerveza", "Cerveza Tecate Light 355ml", 20.0, 12.0, "pza", "🍺"],
  ["cerveza", "Cerveza Indio 355ml", 20.0, 12.0, "pza", "🍺"],
  ["cerveza", "Cerveza Heineken 355ml", 28.0, 17.0, "pza", "🍺"],
  ["cerveza", "Cerveza Bud Light 355ml", 22.0, 13.0, "pza", "🍺"],
  ["cerveza", "Cerveza Michelob Ultra 355ml", 25.0, 15.0, "pza", "🍺"],
  ["cerveza", "Six Pack Corona 355ml", 110.0, 75.0, "pza", "🍺"],
  // Comida
  ["comida", "Sandwich Jamón y Queso", 45.0, 22.0, "pza", "🥪"],
  ["comida", "Sandwich de Atún", 48.0, 24.0, "pza", "🥪"],
  ["comida", "Hot Dog Sencillo", 35.0, 15.0, "pza", "🌭"],
  ["comida", "Hot Dog con Queso", 42.0, 18.0, "pza", "🌭"],
  ["comida", "Torta de Jamón", 55.0, 25.0, "pza", "🥖"],
  ["comida", "Torta de Milanesa", 75.0, 35.0, "pza", "🥖"],
  ["comida", "Tacos de Canasta 3pz", 30.0, 14.0, "pza", "🌮"],
  ["comida", "Quesadilla", 28.0, 12.0, "pza", "🫓"],
  ["comida", "Sincronizada", 38.0, 16.0, "pza", "🫓"],
  ["comida", "Burrito", 42.0, 18.0, "pza", "🌯"],
  ["comida", "Pizza Slice Pepperoni", 38.0, 16.0, "pza", "🍕"],
  ["comida", "Enchiladas 3pz", 55.0, 25.0, "pza", "🌶️"],
  ["comida", "Papas Fritas con Queso", 38.0, 16.0, "pza", "🍟"],
  ["comida", "Churros 2pz", 25.0, 10.0, "pza", "🥖"],
  // Botana
  ["botana", "Pistaches 50g", 38.0, 24.0, "pza", "🥜"],
  ["botana", "Almendras 50g", 42.0, 27.0, "pza", "🥜"],
  ["botana", "Nueces de la India 50g", 38.0, 24.0, "pza", "🥜"],
  ["botana", "Mezcla de Frutos Secos 100g", 55.0, 35.0, "pza", "🥜"],
  ["botana", "Arándanos Deshidratados 50g", 38.0, 24.0, "pza", "🫐"],
  ["botana", "Ciruela pasa 50g", 22.0, 13.0, "pza", "🍑"],
  // Congelados
  ["congelados", "Paleta de Hielo 1pz", 12.0, 6.0, "pza", "🍡"],
  ["congelados", "Helado Magnum Almendra 1pz", 38.0, 22.0, "pza", "🍦"],
  ["congelados", "Helado Cornetto 1pz", 28.0, 16.0, "pza", "🍦"],
  ["congelados", "Nuggets de Pollo 300g", 65.0, 42.0, "pza", "🍗"],
  ["congelados", "Pizza Congelada", 85.0, 55.0, "pza", "🍕"],
  ["congelados", "Verduras Mixtas Congeladas 500g", 42.0, 26.0, "pza", "🥦"],
  ["congelados", "Hielo Bolsa 2kg", 22.0, 12.0, "pza", "🧊"],
  // Hogar
  ["hogar", "Foco LED 9W", 45.0, 25.0, "pza", "💡"],
  ["hogar", "Pilas AA Duracell 4pz", 95.0, 60.0, "pza", "🔋"],
  ["hogar", "Encendedor BIC 1pz", 25.0, 12.0, "pza", "🔥"],
  ["hogar", "Velas 4pz", 32.0, 18.0, "pza", "🕯️"],
  ["hogar", "Cinta Adhesiva Tape", 22.0, 12.0, "pza", "📦"],
  ["hogar", "Aluminio Reynolds 7m", 45.0, 26.0, "pza", "📦"],
  ["hogar", "Plástico Adherente 30m", 38.0, 22.0, "pza", "📦"],
];

export const CATEGORIAS: CategoriaInfo[] = [
  { id: "snacks", nombre: "Snacks", icono: "🥔", color: "#f59e0b" },
  { id: "refrescos", nombre: "Refrescos", icono: "🥤", color: "#ef4444" },
  { id: "abarrotes", nombre: "Abarrotes", icono: "🍚", color: "#84cc16" },
  { id: "galletas", nombre: "Galletas", icono: "🍪", color: "#a16207" },
  { id: "dulces", nombre: "Dulces", icono: "🍬", color: "#ec4899" },
  { id: "limpieza", nombre: "Limpieza", icono: "🧺", color: "#06b6d4" },
  { id: "higiene", nombre: "Higiene", icono: "🧴", color: "#8b5cf6" },
  { id: "cerveza", nombre: "Cerveza", icono: "🍺", color: "#eab308" },
  { id: "comida", nombre: "Comida", icono: "🌮", color: "#f97316" },
  { id: "botana", nombre: "Frutos Secos", icono: "🥜", color: "#a3a3a3" },
  { id: "congelados", nombre: "Congelados", icono: "🧊", color: "#0ea5e9" },
  { id: "hogar", nombre: "Hogar", icono: "💡", color: "#64748b" },
];

// Seed pseudo-aleatorio pero determinístico (mismo stock cada vez que se reinicia)
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generarProductosSeed(): import("./types").Producto[] {
  const rand = rng(42);
  return CATALOGO_BASE.map((tupla, idx) => {
    const [categoria, nombre, precio, costo, unidad, icono] = tupla;
    const stock_min = categoria === "comida" ? 3 : 8;
    const stock_max = categoria === "comida" ? 25 : 80;
    const stock_inicial =
      Math.floor(rand() * (stock_max - stock_min - 5)) + stock_min + 5;
    return {
      id: `P${String(idx + 1).padStart(4, "0")}`,
      sku: `750${String(idx + 1).padStart(9, "0")}`,
      nombre,
      categoria: categoria as import("./types").Categoria,
      precio: Math.round(precio * 100) / 100,
      costo: Math.round(costo * 100) / 100,
      stock: stock_inicial,
      stock_min,
      stock_max,
      unidad,
      icono,
      activo: true,
    };
  });
}
