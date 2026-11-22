const { ventas } = require("./datos");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

const ANCHO = 46;

// 985000 -> "$ 985.000"
function pesos(valor) {
  return "$ " + Math.round(valor).toLocaleString("es-CO");
}

// Etiqueta a la izquierda y valor a la derecha
function fila(etiqueta, valor) {
  return etiqueta.padEnd(ANCHO - 16) + String(valor).padStart(16);
}

// Título de sección subrayado
function seccion(titulo) {
  console.log("\n" + titulo.toUpperCase());
  console.log("-".repeat(ANCHO));
}

// Resumen de un día (con o sin ventas)
function resumenDia(fecha) {
  const dia = ventasDelDia(ventas, fecha);
  seccion(`Resumen del día ${fecha}`);
  if (dia.numeroVentas === 0) {
    console.log("Sin ventas registradas este día.");
    return;
  }
  console.log(fila("Ventas válidas", dia.numeroVentas));
  console.log(fila("Unidades", dia.unidades));
  console.log(fila("Total vendido", pesos(dia.total)));
  console.log(fila("Ticket promedio", pesos(dia.ticketPromedio)));
}

// ===== ENCABEZADO =====
console.log("=".repeat(ANCHO));
console.log("  CAFÉ ORIGEN - REPORTE DE VENTAS v0.1");
console.log("=".repeat(ANCHO));

// ===== 1. RESUMEN GENERAL =====
const mayor = ventaMayor(ventas);
const validas = ventas.filter(venta => venta.cantidad > 0).length;

seccion("Resumen general");
console.log(fila("Total vendido", pesos(totalVendido(ventas))));
console.log(fila("Unidades vendidas", unidadesVendidas(ventas)));
console.log(fila("Ticket promedio", pesos(ticketPromedio(ventas))));
console.log(fila("Ventas válidas", validas));
if (mayor) {
  console.log(fila("Venta mayor", pesos(valorVenta(mayor))));
  console.log(`  ${mayor.producto} - ${mayor.cliente} - ${mayor.ciudad}`);
}

// ===== 2. VENTAS POR CIUDAD =====
seccion("Ventas por ciudad");
for (const [ciudad, total] of Object.entries(totalPorCiudad(ventas))) {
  console.log(fila(ciudad, pesos(total)));
}

// ===== 3. UNIDADES POR PRODUCTO (de mayor a menor) =====
seccion("Unidades por producto");
const ranking = Object.entries(unidadesPorProducto(ventas)).sort((a, b) => b[1] - a[1]);
for (const [producto, unidades] of ranking) {
  console.log(fila(producto, `${unidades} uds`));
}

// ===== 4. TOP 3 PRODUCTOS POR VALOR =====
seccion("Top 3 productos por valor");
topProductosPorValor(ventas, 3).forEach((item, i) => {
  console.log(fila(`${i + 1}. ${item.producto}`, pesos(item.total)));
});

// ===== 5. RESUMEN DE UN DÍA CON VENTAS Y UNO SIN VENTAS =====
resumenDia("2026-09-01");
resumenDia("2026-09-07");

console.log("\n" + "=".repeat(ANCHO));