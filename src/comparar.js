const { generarVentas } = require("./generador");
const { ventas: ventasDia1 } = require("./datos");
const {
  normalizar,
  valorVenta,
  totalCiudadUnaPasada,
} = require("./analitica");

// Versión en cadena: se conserva solo como referencia para la comparación
function totalCiudadCadena(ventas, ciudad) {
  const buscada = normalizar(ciudad);
  return ventas
    .map(venta => ({ ...venta, ciudad: normalizar(venta.ciudad) }))
    .filter(venta => venta.ciudad === buscada)
    .map(venta => valorVenta(venta))
    .reduce((acum, valor) => acum + valor, 0);
}

// ===== PASO 3: ¿ambas versiones dan el mismo valor? =====
console.log("=== PASO 3: ¿dan el mismo valor? (10.000 ventas) ===");

const ventas = generarVentas(10000);
const copiaAntes = JSON.stringify(ventas);
const ciudades = ["Medellín", "  bogotá ", "CALI", "Pereira", "Armenia"];

let todoOk = true;
for (const ciudad of ciudades) {
  const cadena = totalCiudadCadena(ventas, ciudad);
  const unaPasada = totalCiudadUnaPasada(ventas, ciudad);
  const igual = cadena === unaPasada;
  if (!igual) todoOk = false;
  console.log(`${igual ? "OK" : "DIFERENTE"}  "${ciudad}": cadena=${cadena} | una pasada=${unaPasada}`);
}

// Con los 12 datos del Día 1 (incluye "medellín" en minúscula): debe dar 356000
const cadenaDia1 = totalCiudadCadena(ventasDia1, "Medellín");
const unaPasadaDia1 = totalCiudadUnaPasada(ventasDia1, "Medellín");
if (cadenaDia1 !== unaPasadaDia1) todoOk = false;
console.log(`${cadenaDia1 === unaPasadaDia1 ? "OK" : "DIFERENTE"}  Datos del Día 1 "Medellín": cadena=${cadenaDia1} | una pasada=${unaPasadaDia1}`);

// Ninguna versión debe modificar el arreglo original
const sinModificar = JSON.stringify(ventas) === copiaAntes;
if (!sinModificar) todoOk = false;
console.log("¿Ventas sin modificar?", sinModificar ? "OK" : "DIFERENTE");

console.log(todoOk ? "\nTODO OK" : "\nHAY DIFERENCIAS");

// ===== PASO 4: contar recorridos y arreglos nuevos =====
// Versiones "con contador": hacen lo mismo, pero anotan cuánto trabajo y memoria usan
function nuevoContador() {
  return { visitas: 0, arreglosNuevos: 0, elementosGuardados: 0 };
}

function cadenaContada(ventas, ciudad, c) {
  const buscada = normalizar(ciudad);

  const normalizadas = ventas.map(venta => {
    c.visitas++;
    return { ...venta, ciudad: normalizar(venta.ciudad) };
  });
  c.arreglosNuevos++;
  c.elementosGuardados += normalizadas.length;

  const deLaCiudad = normalizadas.filter(venta => {
    c.visitas++;
    return venta.ciudad === buscada;
  });
  c.arreglosNuevos++;
  c.elementosGuardados += deLaCiudad.length;

  const valores = deLaCiudad.map(venta => {
    c.visitas++;
    return valorVenta(venta);
  });
  c.arreglosNuevos++;
  c.elementosGuardados += valores.length;

  return valores.reduce((acum, valor) => {
    c.visitas++;
    return acum + valor;
  }, 0);
}

function unaPasadaContada(ventas, ciudad, c) {
  const buscada = normalizar(ciudad);
  let total = 0;
  for (const venta of ventas) {
    c.visitas++;
    if (normalizar(venta.ciudad) === buscada) {
      total = total + valorVenta(venta);
    }
  }
  return total;
}

console.log("\n=== PASO 4: recorridos y arreglos nuevos (n = 10.000, ciudad Medellín) ===");
const n = 10000;
const datos = generarVentas(n);
const cadenaC = nuevoContador();
const unaPasadaC = nuevoContador();
const resultadoCadena = cadenaContada(datos, "Medellín", cadenaC);
const resultadoUnaPasada = unaPasadaContada(datos, "Medellín", unaPasadaC);

console.table([
  {
    "versión": "Cadena",
    "resultado": resultadoCadena,
    "recorridos (visitas ÷ n)": (cadenaC.visitas / n).toFixed(2),
    "arreglos nuevos": cadenaC.arreglosNuevos,
    "elementos en arreglos nuevos": cadenaC.elementosGuardados,
  },
  {
    "versión": "Una pasada",
    "resultado": resultadoUnaPasada,
    "recorridos (visitas ÷ n)": (unaPasadaC.visitas / n).toFixed(2),
    "arreglos nuevos": unaPasadaC.arreglosNuevos,
    "elementos en arreglos nuevos": unaPasadaC.elementosGuardados,
  },
]);

// ===== PASO 5: ambas crecen igual al multiplicar n por 10 =====
console.log("\n=== PASO 5: visitas al multiplicar n por 10 ===");
const filas = [];
for (const tam of [1000, 10000, 100000]) {
  const v = generarVentas(tam);
  const a = nuevoContador();
  const b = nuevoContador();
  cadenaContada(v, "Medellín", a);
  unaPasadaContada(v, "Medellín", b);
  filas.push({ n: tam, "visitas cadena": a.visitas, "visitas una pasada": b.visitas });
}
console.table(filas);

const razones = filas.slice(1).map((fila, i) => ({
  "n": `${filas[i].n} -> ${fila.n}`,
  "cadena (veces más)": (fila["visitas cadena"] / filas[i]["visitas cadena"]).toFixed(2),
  "una pasada (veces más)": (fila["visitas una pasada"] / filas[i]["visitas una pasada"]).toFixed(2),
}));
console.table(razones);