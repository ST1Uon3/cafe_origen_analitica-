const { generarVentas } = require("./generador");
const { clientesRecurrentes } = require("./analitica");

// Calentamiento: la primera ejecución siempre es más lenta
clientesRecurrentes(generarVentas(1000));

// ===== PASOS 3 y 4: tiempo real con n = 1.000 ... 16.000 =====
const tamanos = [1000, 2000, 4000, 8000, 16000];
const mediciones = [];

for (const n of tamanos) {
  const ventas = generarVentas(n); // generar los datos NO se mide
  console.time(`n = ${n}`);
  const inicio = performance.now();
  clientesRecurrentes(ventas);
  const ms = performance.now() - inicio;
  console.timeEnd(`n = ${n}`);
  mediciones.push({ n, ms });
}

const tabla = mediciones.map((m, i) => {
  const comparaciones = (m.n * (m.n - 1)) / 2;
  return {
    n: m.n,
    "tiempo (ms)": Number(m.ms.toFixed(2)),
    "comparaciones": comparaciones,
    "ns por comparación": Number(((m.ms * 1e6) / comparaciones).toFixed(2)),
    "veces más que antes": i === 0 ? "-" : (m.ms / mediciones[i - 1].ms).toFixed(2),
  };
});
console.log("\nTiempo real de clientesRecurrentes:");
console.table(tabla);

// ===== PASO 5: estimación para volúmenes mayores =====
const ultimo = mediciones[mediciones.length - 1];

// Si el tiempo crece como n², t(n) = t(último) × (n / n último)²
function estimarMs(n) {
  return ultimo.ms * (n / ultimo.n) ** 2;
}

function legible(ms) {
  const s = ms / 1000;
  if (s < 120) return `${s.toFixed(1)} segundos`;
  if (s < 7200) return `${(s / 60).toFixed(1)} minutos`;
  return `${(s / 3600).toFixed(1)} horas`;
}

console.log("\nEstimación a partir de n = " + ultimo.n);
console.log("n = 100.000   ->", legible(estimarMs(100000)));
console.log("n = 1.000.000 ->", legible(estimarMs(1000000)));

// ===== PASO 6: costo oculto de includes (peor caso) =====

// n/2 ventas con n/4 clientes distintos (cada uno compra dos veces)
// + n/2 ventas de un mismo cliente que se repite todo el tiempo
function ventasPeorCaso(n) {
  const ventas = [];
  const mitad = Math.floor(n / 2);
  for (let i = 0; i < mitad; i++) {
    ventas.push({ cliente: "A" + Math.floor(i / 2) });
  }
  for (let i = mitad; i < n; i++) {
    ventas.push({ cliente: "Z" });
  }
  return ventas;
}

console.log("\nCosto oculto de includes: datos al azar contra peor caso (puede tardar unos segundos)");
const comparacion = [];
let msPeorAnterior = null;

for (const n of [500, 1000, 2000, 4000]) {
  const azar = generarVentas(n);
  const peor = ventasPeorCaso(n);

  let inicio = performance.now();
  clientesRecurrentes(azar);
  const msAzar = performance.now() - inicio;

  inicio = performance.now();
  clientesRecurrentes(peor);
  const msPeor = performance.now() - inicio;

  comparacion.push({
    n,
    "al azar (ms)": Number(msAzar.toFixed(2)),
    "peor caso (ms)": Number(msPeor.toFixed(2)),
    "peor caso: veces más que antes": msPeorAnterior === null ? "-" : (msPeor / msPeorAnterior).toFixed(2),
  });
  msPeorAnterior = msPeor;
}
console.table(comparacion);

// ===== PASO 5 (parte 2): ejecutar 100.000 solo si la estimación es menor a 2 minutos =====
if (estimarMs(100000) < 120000) {
  const ventas = generarVentas(100000);
  console.time("n = 100000 (real)");
  clientesRecurrentes(ventas);
  console.timeEnd("n = 100000 (real)");
} else {
  console.log("\nLa estimación para 100.000 supera 2 minutos: no se ejecuta.");
}