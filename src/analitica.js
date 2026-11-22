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

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
};