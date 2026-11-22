function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}


// Patrón ACUMULADOR: suma el valor de todas las ventas
function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total = total + valorVenta(venta);
  }
  return total;
}

// Patrón ACUMULADOR: suma las unidades de todas las ventas
function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades = unidades + venta.cantidad;
  }
  return unidades;
}

// Patrón MÁXIMO: devuelve el registro completo de la venta de mayor valor
function ventaMayor(ventas) {
  let mayor = null; // todavía no hemos visto ninguna venta
  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}


// Patrones ACUMULADOR + CONTADOR, solo con ventas válidas (cantidad > 0)
function ticketPromedio(ventas) {
  let total = 0;
  let validas = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total = total + valorVenta(venta);
      validas = validas + 1;
    }
  }
  if (validas === 0) {
    return 0; // evita dividir entre cero
  }
  return total / validas;
}


// Deja un texto en minúsculas y sin espacios sobrantes para poder compararlo
function normalizar(texto) {
  return texto.trim().toLowerCase();
}

// Patrón ACUMULADOR con CONDICIÓN: total vendido en una ciudad
function ventasPorCiudad(ventas, ciudad) {
  const buscada = normalizar(ciudad);
  let total = 0;
  for (const venta of ventas) {
    if (normalizar(venta.ciudad) === buscada) {
      total = total + valorVenta(venta);
    }
  }
  return total;
}

// ===== Versiones con métodos de arreglo (minireto 3) =====

// Reemplaza el ciclo de totalVendido: reduce acumula el valor de cada venta
function totalVendidoM(ventas) {
  return ventas.reduce((acum, venta) => acum + valorVenta(venta), 0);
}

// Reemplaza el ciclo de unidadesVendidas: reduce acumula las cantidades
function unidadesVendidasM(ventas) {
  return ventas.reduce((acum, venta) => acum + venta.cantidad, 0);
}

// Reemplaza el ciclo de ventasPorCiudad: filter -> map -> reduce
function ventasPorCiudadM(ventas, ciudad) {
  const buscada = normalizar(ciudad);
  return ventas
    .filter(venta => normalizar(venta.ciudad) === buscada)
    .map(venta => valorVenta(venta))
    .reduce((acum, valor) => acum + valor, 0);
}

// Deja un texto sin espacios sobrantes y con cada palabra capitalizada
// "  bogotá " -> "Bogotá"
function titulo(texto) {
  return texto
    .trim()
    .toLowerCase()
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

// Agrupa por ciudad y suma el valor de cada venta
function totalPorCiudad(ventas) {
  return ventas.reduce((grupos, venta) => {
    const ciudad = titulo(venta.ciudad);
    grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
    return grupos;
  }, {});
}

// Agrupa por producto y suma las unidades vendidas
function unidadesPorProducto(ventas) {
  return ventas.reduce((grupos, venta) => {
    grupos[venta.producto] = (grupos[venta.producto] || 0) + venta.cantidad;
    return grupos;
  }, {});
}

// Los k productos que más dinero generaron, de mayor a menor
function topProductosPorValor(ventas, k) {
  // 1) Agrupo: total de dinero por producto
  const valores = ventas.reduce((grupos, venta) => {
    grupos[venta.producto] = (grupos[venta.producto] || 0) + valorVenta(venta);
    return grupos;
  }, {});

  // 2) Convierto a arreglo nuevo, ordeno y recorto
  return Object.entries(valores)
    .map(([producto, total]) => ({ producto, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, k);
}

// Resumen de un día: filtra las ventas de esa fecha y reutiliza los indicadores
function ventasDelDia(ventas, fecha) {
  const dia = String(fecha).trim();
  const delDia = ventas.filter(venta => venta.fecha === dia);
  return {
    fecha: dia,
    numeroVentas: delDia.filter(venta => venta.cantidad > 0).length,
    unidades: unidadesVendidasM(delDia),
    total: totalVendidoM(delDia),
    ticketPromedio: ticketPromedio(delDia),
  };
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
};