const { ventas } = require("./datos");
const {
  valorVenta,
  totalPorCiudad,
  ticketPromedio,
  ventasDelDia,
} = require("./analitica");

// ===== VERSIONES PRELIMINARES (las del compañero), solo para reproducir los errores =====

// No normaliza la ciudad: usa el texto tal cual como clave
function totalPorCiudadPreliminar(ventas) {
  const grupos = {};
  for (const venta of ventas) {
    grupos[venta.ciudad] = (grupos[venta.ciudad] || 0) + valorVenta(venta);
  }
  return grupos;
}

// Divide entre ventas.length sin revisar si es 0
function ticketPromedioPreliminar(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total = total + valorVenta(venta);
  }
  return total / ventas.length;
}

// Devuelve true si ningún grupo se repite al normalizar su nombre
function sinDuplicados(grupos) {
  const claves = Object.keys(grupos);
  const normalizadas = claves.map(clave => clave.trim().toLowerCase());
  return new Set(normalizadas).size === claves.length;
}

// ===== ERROR 1: "Bogotá aparecía dos veces" =====
console.log("=== ERROR 1: grupos duplicados ===");

const entradaBogota = [
  { ciudad: "Bogotá",  cantidad: 1, precio: 100 },
  { ciudad: "Bogotá ", cantidad: 1, precio: 100 }, // espacio al final
];

console.log("Preliminar (Bogotá):      ", Object.keys(totalPorCiudadPreliminar(entradaBogota)));
console.log("Preliminar (datos reales):", Object.keys(totalPorCiudadPreliminar(ventas)));
console.log("Mi versión (Bogotá):      ", Object.keys(totalPorCiudad(entradaBogota)));
console.log("Mi versión (datos reales):", Object.keys(totalPorCiudad(ventas)));
console.log("¿Preliminar sin duplicados?", sinDuplicados(totalPorCiudadPreliminar(ventas)) ? "OK" : "FALLA (esperado)");
console.log("¿Mi versión sin duplicados?", sinDuplicados(totalPorCiudad(ventas)) ? "OK" : "FALLA");

// ===== ERROR 2: "el ticket promedio daba NaN en un día sin ventas" =====
console.log("\n=== ERROR 2: ticket promedio NaN ===");

const diaSinVentas = ventas.filter(venta => venta.fecha === "2026-09-07");

console.log("Ventas de ese día:", diaSinVentas);
console.log("0 / 0 =", 0 / 0);
console.log("Preliminar:", ticketPromedioPreliminar(diaSinVentas));
console.log("Mi versión:", ticketPromedio(diaSinVentas));
console.log("ventasDelDia:", ventasDelDia(ventas, "2026-09-07"));
console.log("¿Mi versión devuelve NaN?", Number.isNaN(ticketPromedio(diaSinVentas)) ? "SÍ (error)" : "NO (OK)");