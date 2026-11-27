const { catalogo } = require("./catalogo");

// Suma cada bloque desde cero: O(nk) tiempo y O(1) espacio.
function mejorSemanaBruta(dias, k) {
  if (!Number.isInteger(k) || k <= 0 || k > dias.length) return null;
  let mejorTotal = -Infinity;
  let mejorInicio = 0;
  for (let inicio = 0; inicio <= dias.length - k; inicio++) {
    let total = 0;
    for (let i = inicio; i < inicio + k; i++) total += dias[i];
    if (total > mejorTotal) { mejorTotal = total; mejorInicio = inicio; }
  }
  return { total: mejorTotal, diaInicio: mejorInicio + 1 };
}

// Actualiza la ventana restando el día que sale y sumando el que entra: O(n), O(1) espacio.
function mejorSemana(dias, k) {
  if (!Number.isInteger(k) || k <= 0 || k > dias.length) return null;
  let total = 0;
  for (let i = 0; i < k; i++) total += dias[i];
  let mejorTotal = total;
  let mejorInicio = 0;
  for (let inicio = 1; inicio <= dias.length - k; inicio++) {
    total = total - dias[inicio - 1] + dias[inicio + k - 1];
    if (total > mejorTotal) { mejorTotal = total; mejorInicio = inicio; }
  }
  return { total: mejorTotal, diaInicio: mejorInicio + 1 };
}

// Ordena una copia por precio y aplica dos punteros: O(n log n) total.
function parMasCercano(precios, presupuesto) {
  const ordenados = precios.map(item => ({ ...item })).sort((a, b) => a.precio - b.precio);
  if (ordenados.length < 2) return null;
  let izquierda = 0;
  let derecha = ordenados.length - 1;
  let mejor = null;
  while (izquierda < derecha) {
    const suma = ordenados[izquierda].precio + ordenados[derecha].precio;
    if (suma <= presupuesto) {
      if (mejor === null || suma > mejor.total) {
        mejor = { productos: [ordenados[izquierda], ordenados[derecha]], total: suma };
      }
      izquierda++;
    } else {
      derecha--;
    }
  }
  return mejor;
}

const ventasDiarias = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370,
];

module.exports = { ventasDiarias, mejorSemanaBruta, mejorSemana, parMasCercano, catalogo };
