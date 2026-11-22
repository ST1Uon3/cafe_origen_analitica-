const { generarVentas } = require("./generador");
const {
  totalVendido,
  ventaMayor,
  totalPorCiudad,
  totalVendidoContado,
  ventaMayorContada,
  totalPorCiudadContado,
  primeraVenta,
} = require("./analitica");

// Comprobación: las versiones contadas dan el mismo resultado que las originales
const muestra = generarVentas(100);
const igual =
  totalVendidoContado(muestra, { operaciones: 0 }) === totalVendido(muestra) &&
  JSON.stringify(ventaMayorContada(muestra, { operaciones: 0 })) === JSON.stringify(ventaMayor(muestra)) &&
  JSON.stringify(totalPorCiudadContado(muestra, { operaciones: 0 })) === JSON.stringify(totalPorCiudad(muestra));
console.log("Versiones contadas = versiones originales:", igual ? "OK" : "DIFERENTE");

// Ejecuta una función con un contador nuevo y devuelve cuántas operaciones hizo
function contar(funcion, ventas) {
  const contador = { operaciones: 0 };
  funcion(ventas, contador);
  return contador.operaciones;
}

const tamanos = [100, 1000, 10000, 100000];
const funciones = {
  totalVendido: totalVendidoContado,
  ventaMayor: ventaMayorContada,
  totalPorCiudad: totalPorCiudadContado,
  primeraVenta: primeraVenta,
};

// Tabla 1: operaciones por función para cada n
const filas = [];
for (const n of tamanos) {
  const ventas = generarVentas(n);
  const fila = { n };
  for (const [nombre, funcion] of Object.entries(funciones)) {
    fila[nombre] = contar(funcion, ventas);
  }
  filas.push(fila);
}
console.log("\nOperaciones realizadas por cada función:");
console.table(filas);

// Tabla 2: cuánto se multiplicaron las operaciones al pasar de una fila a la siguiente
const razones = [];
for (let i = 1; i < filas.length; i++) {
  const razon = { "n": `${filas[i - 1].n} -> ${filas[i].n}` };
  for (const nombre of Object.keys(funciones)) {
    razon[nombre] = (filas[i][nombre] / filas[i - 1][nombre]).toFixed(2);
  }
  razones.push(razon);
}
console.log("\nCuánto se multiplicaron las operaciones (n se multiplica por 10):");
console.table(razones);