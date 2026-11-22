const { ventas: ventasDia1 } = require("./datos");
const { generarVentas } = require("./generador");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap,
} = require("./analitica");

// Ordena una copia para comparar sin importar el orden original
function ordenados(lista) {
  return [...lista].sort().join(",");
}

function sinRepetidos(lista) {
  return new Set(lista).size === lista.length;
}

// Si la lista es larga, muestra solo cuántos son
function mostrar(lista) {
  return lista.length > 10 ? `${lista.length} clientes` : lista;
}

// Arma ventas mínimas a partir de códigos de cliente
function desdeClientes(codigos) {
  return codigos.map((cliente, i) => ({ id: i + 1, cliente, cantidad: 1, precio: 1 }));
}

let todoOk = true;

function comprobar(nombre, condicion) {
  if (!condicion) todoOk = false;
  console.log(`${condicion ? "OK" : "DIFERENTE"}  ${nombre}`);
}

function verificar(titulo, datos) {
  console.log(`\n=== ${titulo} ===`);
  const original = clientesRecurrentes(datos);
  const conSet = clientesRecurrentesSet(datos);
  const conMap = clientesRecurrentesMap(datos);

  console.log("Original:", mostrar(original));
  console.log("Set:     ", mostrar(conSet));
  console.log("Map:     ", mostrar(conMap));

  comprobar("Original = Set (ordenados)", ordenados(original) === ordenados(conSet));
  comprobar("Original = Map (ordenados)", ordenados(original) === ordenados(conMap));
  comprobar("Ningún cliente repetido en los resultados",
    sinRepetidos(original) && sinRepetidos(conSet) && sinRepetidos(conMap));
}

verificar("Datos del Día 1 (12 ventas)", ventasDia1);
comprobar("Día 1: los recurrentes son C01, C02 y C03",
  ordenados(clientesRecurrentesSet(ventasDia1)) === "C01,C02,C03");

verificar("5.000 ventas generadas", generarVentas(5000));
verificar("Arreglo vacío", []);
verificar("Una sola venta", desdeClientes(["C01"]));
verificar("Nadie repite", desdeClientes(["C01", "C02", "C03"]));
verificar("Un cliente compra 4 veces", desdeClientes(["C01", "C01", "C01", "C01"]));
verificar("El orden puede cambiar: A, B, B, A", desdeClientes(["A", "B", "B", "A"]));

console.log(todoOk ? "\nTODO OK" : "\nHAY DIFERENCIAS");