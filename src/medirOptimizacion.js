const { generarVentas } = require("./generador");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap,
} = require("./analitica");

// La versión original solo se ejecuta si su tiempo estimado es menor a este límite
const LIMITE_ORIGINAL_MS = 60000; // 1 minuto

// Tiempo promedio en ms: una ejecución de calentamiento y luego varias repeticiones
function medirMs(ejecutar, repeticiones) {
  ejecutar();
  const inicio = performance.now();
  for (let i = 0; i < repeticiones; i++) ejecutar();
  return (performance.now() - inicio) / repeticiones;
}

// Una sola ejecución, sin calentamiento (para la versión lenta)
function medirUnaVez(ejecutar) {
  const inicio = performance.now();
  ejecutar();
  return performance.now() - inicio;
}

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

const tamanos = [1000, 10000, 100000];
const filas = [];
let msOriginalPrevio = null;
let nPrevio = null;
let ultimoSet = 0;
let ultimoMap = 0;

for (const n of tamanos) {
  console.log(`Midiendo n = ${n.toLocaleString("es-CO")}...`);
  const ventas = generarVentas(n);
  const repeticiones = n <= 10000 ? 20 : 5;

  const msSet = medirMs(() => clientesRecurrentesSet(ventas), repeticiones);
  const msMap = medirMs(() => clientesRecurrentesMap(ventas), repeticiones);

  // Estimación de la original a partir de la medición anterior: crece como n²
  const estimado = msOriginalPrevio === null ? 0 : msOriginalPrevio * (n / nPrevio) ** 2;
  const ejecutarOriginal = estimado < LIMITE_ORIGINAL_MS;
  let msOriginal = estimado;
  if (ejecutarOriginal) {
    msOriginal = n <= 1000
      ? medirMs(() => clientesRecurrentes(ventas), 5)
      : medirUnaVez(() => clientesRecurrentes(ventas));
  }

  filas.push({
    "n": n.toLocaleString("es-CO"),
    "Original": ejecutarOriginal ? formato(msOriginal) : `≈ ${formato(estimado)} (estimado, no se ejecutó)`,
    "Set": formato(msSet),
    "Map": formato(msMap),
    "Original ÷ Set": ejecutarOriginal ? `${Math.round(msOriginal / msSet).toLocaleString("es-CO")}×` : "-",
  });

  msOriginalPrevio = msOriginal;
  nPrevio = n;
  ultimoSet = msSet;
  ultimoMap = msMap;
}

console.log("\nTiempo de cada versión:");
console.table(filas);

console.log("Requisito del marketplace: menos de 1 segundo con 100.000 ventas");
console.log(`  Set: ${ultimoSet < 1000 ? "CUMPLE" : "NO CUMPLE"} (${formato(ultimoSet)})`);
console.log(`  Map: ${ultimoMap < 1000 ? "CUMPLE" : "NO CUMPLE"} (${formato(ultimoMap)})`);