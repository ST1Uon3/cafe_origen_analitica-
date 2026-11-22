const { ventas } = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
} = require("./analitica");

function probar(nombre, datos) {
  console.log("\n=== " + nombre + " ===");
  console.log("totalVendido:", totalVendido(datos));
  console.log("unidadesVendidas:", unidadesVendidas(datos));
  console.log("ventaMayor:", ventaMayor(datos));
  console.log("ticketPromedio:", ticketPromedio(datos));
  console.log("ventasPorCiudad(Medellín):", ventasPorCiudad(datos, "Medellín"));
}

probar("Arreglo completo", ventas);
probar("Un solo elemento", [ventas[0]]);
probar("Arreglo vacío", []);

// Casos extra
probar("Solo la venta con cantidad 0", [ventas[7]]);
console.log("\nCiudad con mayúsculas y espacios:", ventasPorCiudad(ventas, "  MEDELLÍN "));