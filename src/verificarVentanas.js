const { performance } = require("node:perf_hooks");
const { ventasDiarias, mejorSemanaBruta, mejorSemana, parMasCercano, catalogo } = require("./ventanas");

let todoOk = true;
function comprobar(nombre, condicion) {
  if (!condicion) todoOk = false;
  console.log(`${condicion ? "OK" : "DIFERENTE"}  ${nombre}`);
}
function medir(funcion, ...args) {
  const inicio = performance.now();
  const resultado = funcion(...args);
  return { resultado, ms: performance.now() - inicio };
}

const septiembreBruta = mejorSemanaBruta(ventasDiarias, 7);
const septiembreVentana = mejorSemana(ventasDiarias, 7);
console.log("Mejor semana de septiembre:", septiembreVentana);
comprobar("Ventana deslizante coincide con fuerza bruta en septiembre", JSON.stringify(septiembreBruta) === JSON.stringify(septiembreVentana));
comprobar("k mayor que los días devuelve null", mejorSemana(ventasDiarias, 31) === null);
comprobar("Arreglo vacío devuelve null", mejorSemana([], 7) === null);

// Generación determinista para que el caso de 100.000 días sea reproducible.
let semilla = 2026;
const diasAleatorios = Array.from({ length: 100000 }, () => {
  semilla = (semilla * 16807) % 2147483647;
  return 200 + (semilla % 801);
});
const aleatoriaBruta = medir(mejorSemanaBruta, diasAleatorios, 7);
const aleatoriaVentana = medir(mejorSemana, diasAleatorios, 7);
console.log("100.000 días, fuerza bruta:", aleatoriaBruta.resultado, `${aleatoriaBruta.ms.toFixed(3)} ms`);
console.log("100.000 días, ventana:", aleatoriaVentana.resultado, `${aleatoriaVentana.ms.toFixed(3)} ms`);
comprobar("Ambos métodos coinciden con 100.000 días", JSON.stringify(aleatoriaBruta.resultado) === JSON.stringify(aleatoriaVentana.resultado));

for (const presupuesto of [100000, 140000, 40000]) {
  const resultado = parMasCercano(catalogo, presupuesto);
  console.log(`Presupuesto $${presupuesto.toLocaleString("es-CO")}:`, resultado);
  comprobar(`Resultado respeta el presupuesto de ${presupuesto}`, resultado === null || resultado.total <= presupuesto);
  if (presupuesto === 40000) comprobar("$40.000 no tiene solución", resultado === null);
}
comprobar("Arreglo de precios vacío devuelve null", parMasCercano([], 100000) === null);
console.log(todoOk ? "\nTODO OK" : "\nHAY DIFERENCIAS");
