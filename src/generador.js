// Listas fijas: cada producto tiene su precio
const PRODUCTOS = [
  { nombre: "Origen Huila 500 g",  precio: 42000 },
  { nombre: "Origen Nariño 250 g", precio: 26000 },
  { nombre: "Origen Sierra 500 g", precio: 45000 },
  { nombre: "Prensa francesa",     precio: 95000 },
  { nombre: "Molino manual",       precio: 120000 },
];
const CIUDADES = ["Medellín", "Bogotá", "Cali", "Pereira"];

// Entero al azar entre min y max, ambos incluidos
function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Devuelve un arreglo de n ventas con la misma estructura del Día 1
function generarVentas(n) {
  const maxClientes = Math.max(1, Math.floor(n / 3)); // entre 1 y n/3 clientes distintos
  const ventas = [];

  for (let i = 1; i <= n; i++) {
    const producto = PRODUCTOS[enteroAleatorio(0, PRODUCTOS.length - 1)];
    const dia = String(enteroAleatorio(1, 30)).padStart(2, "0");

    ventas.push({
      id: i,
      fecha: "2026-09-" + dia,
      cliente: "C" + String(enteroAleatorio(1, maxClientes)).padStart(2, "0"),
      producto: producto.nombre,
      ciudad: CIUDADES[enteroAleatorio(0, CIUDADES.length - 1)],
      cantidad: enteroAleatorio(1, 5),
      precio: producto.precio,
    });
  }

  return ventas;
}

module.exports = { generarVentas };