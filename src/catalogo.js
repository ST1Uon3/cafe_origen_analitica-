// Catálogo de fin de año. Los precios están expresados en pesos colombianos.
const catalogo = [
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Filtros de papel x100", precio: 18000 },
  { producto: "Taza de cerámica", precio: 35000 },
  { producto: "Origen Huila 1 kg", precio: 79000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 },
];

// Fuerza bruta: prueba cada par de productos distintos. Tiempo O(p²), espacio O(1).
function comboRegaloFuerzaBruta(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) return [catalogo[i], catalogo[j]];
    }
  }
  return null;
}

// Map de precio -> productos vistos con ese precio; tiempo O(p), espacio O(p).
function comboRegalo(catalogo, valor) {
  const vistos = new Map();
  for (const item of catalogo) {
    const candidatos = vistos.get(valor - item.precio);
    if (candidatos && candidatos.length > 0) return [candidatos[0], item];
    if (!vistos.has(item.precio)) vistos.set(item.precio, []);
    vistos.get(item.precio).push(item);
  }
  return null;
}

// Por ciudad cuenta cada fila de venta. Empates: gana quien apareció primero.
// La ciudad se normaliza para unir variantes de mayúsculas/minúsculas y espacios.
function productoEstrellaPorCiudad(ventas) {
  const porCiudad = new Map();
  for (const venta of ventas) {
    const ciudad = venta.ciudad.trim().toLowerCase();
    if (!porCiudad.has(ciudad)) porCiudad.set(ciudad, { nombre: venta.ciudad.trim(), productos: new Map() });
    const productos = porCiudad.get(ciudad).productos;
    productos.set(venta.producto, (productos.get(venta.producto) || 0) + 1);
  }
  const resultado = [];
  for (const grupo of porCiudad.values()) {
    let producto = null;
    let frecuencia = 0;
    for (const [nombre, veces] of grupo.productos) {
      if (veces > frecuencia) { producto = nombre; frecuencia = veces; }
    }
    resultado.push({ ciudad: grupo.nombre, producto, frecuencia });
  }
  return resultado;
}

// Dos recorridos: frecuencias y luego búsqueda en el orden original.
function primerClienteUnico(ventas) {
  const frecuencias = new Map();
  for (const venta of ventas) {
    frecuencias.set(venta.cliente, (frecuencias.get(venta.cliente) || 0) + 1);
  }
  for (const venta of ventas) {
    if (frecuencias.get(venta.cliente) === 1) return venta.cliente;
  }
  return null;
}

module.exports = { catalogo, comboRegaloFuerzaBruta, comboRegalo, productoEstrellaPorCiudad, primerClienteUnico };
