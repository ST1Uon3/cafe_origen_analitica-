const { ventas } = require("./datos");
const { catalogo, comboRegaloFuerzaBruta, comboRegalo, productoEstrellaPorCiudad, primerClienteUnico } = require("./catalogo");

let todoOk = true;
function comprobar(nombre, condicion) {
  if (!condicion) todoOk = false;
  console.log(`${condicion ? "OK" : "DIFERENTE"}  ${nombre}`);
}
const combo87 = comboRegalo(catalogo, 87000);
console.log("Combinación para $87.000:", combo87);
comprobar("$87.000 suma exactamente con dos productos distintos", combo87 !== null && combo87[0] !== combo87[1] && combo87[0].precio + combo87[1].precio === 87000);
comprobar("Fuerza bruta y Map coinciden para $87.000", JSON.stringify(comboRegaloFuerzaBruta(catalogo, 87000)) === JSON.stringify(combo87));
const combo61 = comboRegalo(catalogo, 61000);
console.log("Combinación para $61.000:", combo61);
comprobar("$61.000 tiene combinación válida", combo61 !== null && combo61[0].precio + combo61[1].precio === 61000);
comprobar("Valor sin combinación devuelve null", comboRegalo(catalogo, 1) === null);
console.log("Producto estrella por ciudad:", productoEstrellaPorCiudad(ventas));
comprobar("Arreglo vacío de ventas no produce ciudades", productoEstrellaPorCiudad([]).length === 0);
comprobar("Empate conserva el primer producto visto", productoEstrellaPorCiudad([{ ciudad: "Cali", producto: "A" }, { ciudad: "Cali", producto: "B" }])[0].producto === "A");
comprobar("Primer cliente de una compra en Día 1 es C04", primerClienteUnico(ventas) === "C04");
comprobar("Arreglo vacío no tiene cliente único", primerClienteUnico([]) === null);
console.log(todoOk ? "\nTODO OK" : "\nHAY DIFERENCIAS");
