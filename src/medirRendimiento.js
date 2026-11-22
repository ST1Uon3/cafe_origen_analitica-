const fs = require("fs");
const os = require("os");
const path = require("path");
const { generarVentas } = require("./generador");
const {
  valorVenta,
  normalizar,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  primeraVenta,
  clientesRecurrentes,
  totalCiudadUnaPasada,
} = require("./analitica");

const N = 10000;
const ventas = generarVentas(N);

// Versión en cadena: vive en src/comparar.js como referencia; se copia aquí para medirla
function totalCiudadCadena(ventas, ciudad) {
  const buscada = normalizar(ciudad);
  return ventas
    .map(venta => ({ ...venta, ciudad: normalizar(venta.ciudad) }))
    .filter(venta => venta.ciudad === buscada)
    .map(venta => valorVenta(venta))
    .reduce((acum, valor) => acum + valor, 0);
}

// "clase" decide el factor de la proyección: O(1) -> x1, O(n) -> x100, O(n²) -> x10.000
const funciones = [
  {
    nombre: "valorVenta", clase: "O(1)", proyectar: false, repeticiones: 200, nota: "10.000 llamadas",
    queHace: "Calcula el valor de una venta (cantidad × precio).",
    tiempo: "O(1)", espacio: "O(1)",
    justificacion: "Una multiplicación, sin ciclos.",
    ejecutar: () => { for (const venta of ventas) valorVenta(venta); },
  },
  {
    nombre: "normalizar", clase: "O(1)", proyectar: false, repeticiones: 200, nota: "10.000 llamadas",
    queHace: "Quita espacios sobrantes y pasa un texto a minúsculas.",
    tiempo: "O(1)", espacio: "O(1)",
    justificacion: "Trabaja sobre un texto corto (nombre de ciudad), no sobre las ventas.",
    ejecutar: () => { for (const venta of ventas) normalizar(venta.ciudad); },
  },
  {
    nombre: "totalVendido", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Suma el valor de todas las ventas (ciclo for...of).",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "Un ciclo que visita cada venta una vez y un acumulador numérico.",
    ejecutar: () => totalVendido(ventas),
  },
  {
    nombre: "unidadesVendidas", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Suma las unidades vendidas en todas las ventas.",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "Un ciclo y un acumulador numérico.",
    ejecutar: () => unidadesVendidas(ventas),
  },
  {
    nombre: "ventaMayor", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Devuelve el registro completo de la venta de mayor valor.",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "Un ciclo con 3n − 1 operaciones contadas (visitas y comparaciones). Guarda una referencia al registro, no una copia.",
    ejecutar: () => ventaMayor(ventas),
  },
  {
    nombre: "ticketPromedio", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Calcula el valor promedio por venta válida (cantidad mayor que 0).",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "Un ciclo con un acumulador y un contador.",
    ejecutar: () => ticketPromedio(ventas),
  },
  {
    nombre: "ventasPorCiudad", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Total vendido en una ciudad, ignorando mayúsculas y espacios.",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "Un ciclo con una condición y un acumulador.",
    ejecutar: () => ventasPorCiudad(ventas, "Medellín"),
  },
  {
    nombre: "totalVendidoM", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Igual que totalVendido, escrita con reduce.",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "reduce recorre una vez con un acumulador y no crea arreglos intermedios.",
    ejecutar: () => totalVendidoM(ventas),
  },
  {
    nombre: "unidadesVendidasM", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Igual que unidadesVendidas, escrita con reduce.",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "reduce recorre una vez con un acumulador y no crea arreglos intermedios.",
    ejecutar: () => unidadesVendidasM(ventas),
  },
  {
    nombre: "ventasPorCiudadM", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Igual que ventasPorCiudad, escrita con filter, map y reduce.",
    tiempo: "O(n)", espacio: "O(n)",
    justificacion: "Hasta 3 recorridos; filter y map crean dos arreglos de k elementos (k ≤ n).",
    ejecutar: () => ventasPorCiudadM(ventas, "Medellín"),
  },
  {
    nombre: "totalPorCiudad", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Total vendido por cada ciudad, agrupado en un diccionario.",
    tiempo: "O(n)", espacio: "O(g)",
    justificacion: "Un recorrido (2n operaciones contadas). El diccionario tiene una clave por ciudad distinta, no por venta.",
    ejecutar: () => totalPorCiudad(ventas),
  },
  {
    nombre: "unidadesPorProducto", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Unidades vendidas por cada producto, agrupadas en un diccionario.",
    tiempo: "O(n)", espacio: "O(p)",
    justificacion: "Un recorrido. El diccionario tiene una clave por producto distinto.",
    ejecutar: () => unidadesPorProducto(ventas),
  },
  {
    nombre: "topProductosPorValor", clase: "O(n)", proyectar: true, repeticiones: 200, nota: "k = 3",
    queHace: "Los k productos que más dinero generaron, de mayor a menor.",
    tiempo: "O(n + p log p)", espacio: "O(p)",
    justificacion: "Un recorrido para agrupar y luego ordena p productos. Ordena una copia, no las ventas. Con pocos productos crece como n.",
    ejecutar: () => topProductosPorValor(ventas, 3),
  },
  {
    nombre: "ventasDelDia", clase: "O(n)", proyectar: true, repeticiones: 200, nota: "un día",
    queHace: "Resumen de un día: ventas válidas, unidades, total y ticket promedio.",
    tiempo: "O(n)", espacio: "O(n)",
    justificacion: "filter recorre las n ventas y crea un arreglo con las del día (hasta n); luego varios recorridos sobre ese arreglo.",
    ejecutar: () => ventasDelDia(ventas, "2026-09-15"),
  },
  {
    nombre: "primeraVenta", clase: "O(1)", proyectar: true, repeticiones: 100000, nota: "1 llamada",
    queHace: "Devuelve la primera venta del arreglo.",
    tiempo: "O(1)", espacio: "O(1)",
    justificacion: "Acceso directo a la posición 0, sin recorrer nada.",
    ejecutar: () => primeraVenta(ventas, { operaciones: 0 }),
  },
  {
    nombre: "clientesRecurrentes", clase: "O(n²)", proyectar: true, repeticiones: 3,
    queHace: "Lista los clientes que compraron más de una vez.",
    tiempo: "O(n²)", espacio: "O(n)",
    justificacion: "Ciclos anidados: n(n − 1)/2 comparaciones. includes agrega un costo oculto (peor caso O(n³)). El arreglo recurrentes crece hasta n/2.",
    ejecutar: () => clientesRecurrentes(ventas),
  },
  {
    nombre: "totalCiudadCadena", clase: "O(n)", proyectar: true, repeticiones: 50,
    queHace: "Total de una ciudad con map, filter, map y reduce (versión de referencia, en src/comparar.js).",
    tiempo: "O(n)", espacio: "O(n)",
    justificacion: "Hasta 4 recorridos y 3 arreglos nuevos; el primer map copia las n ventas.",
    ejecutar: () => totalCiudadCadena(ventas, "Medellín"),
  },
  {
    nombre: "totalCiudadUnaPasada", clase: "O(n)", proyectar: true, repeticiones: 200,
    queHace: "Total de una ciudad con un solo ciclo (versión elegida para el motor).",
    tiempo: "O(n)", espacio: "O(1)",
    justificacion: "Un recorrido, un acumulador y ningún arreglo intermedio.",
    ejecutar: () => totalCiudadUnaPasada(ventas, "Medellín"),
  },
];

// Tiempo promedio en ms: una ejecución de calentamiento y luego varias repeticiones
function medirMs(ejecutar, repeticiones) {
  ejecutar();
  const inicio = performance.now();
  for (let i = 0; i < repeticiones; i++) ejecutar();
  return (performance.now() - inicio) / repeticiones;
}

// Muestra el tiempo con la unidad que corresponda
function formato(ms) {
  if (ms < 0.001) return `${(ms * 1e6).toFixed(0)} ns`;
  if (ms < 1) return `${(ms * 1000).toFixed(1)} µs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  const s = ms / 1000;
  if (s < 120) return `${s.toFixed(1)} s`;
  const min = s / 60;
  if (min < 120) return `${min.toFixed(1)} min`;
  return `${(min / 60).toFixed(1)} h`;
}

console.log(`Midiendo ${funciones.length} funciones con ${N.toLocaleString("es-CO")} ventas...`);
for (const f of funciones) {
  f.ms = medirMs(f.ejecutar, f.repeticiones);
  console.log(`  ${f.nombre}: ${formato(f.ms)}`);
}

// ===== Bloque ENTORNO =====
const entorno = [
  `- Fecha de la medición: ${new Date().toLocaleDateString("es-CO")}`,
  `- Node.js: ${process.version}`,
  `- Sistema: ${os.type()} ${os.release()}`,
  `- Procesador: ${os.cpus()[0].model.trim()}`,
  `- Memoria RAM total: ${(os.totalmem() / 1024 ** 3).toFixed(1)} GB`,
  `- Datos: ${N.toLocaleString("es-CO")} ventas generadas al azar con src/generador.js`,
  "- Método: tiempo promedio de varias repeticiones, después de una ejecución de calentamiento",
].join("\n");

// ===== Bloque TABLA (paso 1 y 2) =====
const filasTabla = funciones.map(f => {
  const medido = formato(f.ms) + (f.nota ? ` (${f.nota})` : "");
  return `| ${f.nombre} | ${f.queHace} | ${f.tiempo} | ${f.espacio} | ${f.justificacion} | ${medido} |`;
});
const tabla = [
  "| Función | Qué hace | Tiempo | Espacio | Justificación | Medido con 10.000 ventas |",
  "|---|---|---|---|---|---|",
  ...filasTabla,
].join("\n");

// ===== Bloque PROYECCION (paso 3) =====
const FACTORES = { "O(1)": 1, "O(n)": 100, "O(n²)": 10000 };
const filasProy = funciones.filter(f => f.proyectar).map(f => {
  const factor = FACTORES[f.clase];
  return `| ${f.nombre} | ${f.tiempo} | ${formato(f.ms)} | ×${factor.toLocaleString("es-CO")} | ${formato(f.ms * factor)} |`;
});
const proyeccion = [
  "| Función | Tiempo | Medido con 10.000 ventas | Factor | Proyección con 1.000.000 de ventas |",
  "|---|---|---|---|---|",
  ...filasProy,
].join("\n");

// ===== Escribir los bloques dentro de RENDIMIENTO.md =====
const ruta = path.join(__dirname, "..", "RENDIMIENTO.md");
let texto = fs.readFileSync(ruta, "utf8");

function reemplazarBloque(texto, nombre, contenido) {
  const patron = new RegExp(`<!-- ${nombre}:INICIO -->[\\s\\S]*?<!-- ${nombre}:FIN -->`);
  if (!patron.test(texto)) {
    console.log(`AVISO: no encontré los marcadores de ${nombre} en RENDIMIENTO.md; se omite ese bloque.`);
    return texto;
  }
  return texto.replace(patron, () => `<!-- ${nombre}:INICIO -->\n${contenido}\n<!-- ${nombre}:FIN -->`);
}

texto = reemplazarBloque(texto, "ENTORNO", entorno);
texto = reemplazarBloque(texto, "TABLA", tabla);
texto = reemplazarBloque(texto, "PROYECCION", proyeccion);
fs.writeFileSync(ruta, texto, "utf8");

console.log("\nRENDIMIENTO.md actualizado.");