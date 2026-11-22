# Bitácora – Café Origen Analítica

---

# Semana 1

---


# PRIMER MINIRETO 

# DÍA 1 — PRIMER MINIRETO
Configuración del proyecto y exploración de los datos.

## Diccionario de datos — Punto 5, primer minireto

| Propiedad | Tipo   | Significado |
|-----------|--------|-------------|
| id        | number | Identificador único y consecutivo de la venta. |
| fecha     | string | Fecha de la venta en formato AAAA-MM-DD (texto, no objeto Date). |
| cliente   | string | Código del cliente que compró (ej. "C01"). |
| producto  | string | Nombre del producto vendido, incluye la presentación (ej. "Origen Huila 500 g"). |
| ciudad    | string | Ciudad donde se hizo la venta o entrega. |
| cantidad  | number | Unidades vendidas en esa venta. |
| precio    | number | Precio por unidad en pesos colombianos (COP). El total es cantidad × precio. |

## Casos borde detectados — Punto 6, primer minireto

1. **Ciudad escrita distinto**: el id 5 tiene "medellín" (minúscula) y los demás "Medellín".
   Al agrupar por ciudad, JavaScript las vería como dos ciudades distintas.
   **Decisión:** no modifico `datos.js` (es el dato original); normalizaré el texto
   (primera letra en mayúscula) en `analitica.js` antes de agrupar.

2. **Cantidad = 0**: el id 8 (cliente C06) tiene cantidad 0, o sea, no se vendió nada.
   Puede ser una venta cancelada o un error de digitación.
   **Decisión:** lo excluyo de ingresos y del conteo de ventas válidas, pero lo dejo
   documentado como dato sospechoso.

3. **Clientes con una sola compra o sin compra real**: C04, C05, C07 y C08 aparecen
   una vez, y C06 solo aparece en la venta con cantidad 0. En cambio, C01 compra 3 veces.
   **Decisión:** C06 no cuenta como cliente activo, y los de una sola compra se
   tratan como clientes ocasionales al medir recurrencia.

4. **`precio` es unitario, no total**: puede confundirse con el valor de la venta.
   **Decisión:** el ingreso de cada venta se calculará siempre como cantidad × precio.

---

# SEGUNDO MINIRETO

# DÍA 1 — SEGUNDO MINIRETO
Indicadores de negocio calculados con ciclos manuales.

## Plan en pseudocódigo — Punto 1, segundo minireto

**valorVenta(venta)**
- Devuelve cantidad × precio de esa venta.

**totalVendido(ventas)**
- Inicio: total = 0 (acumulador)
- Recorro: cada venta del arreglo
- Condición: ninguna (si cantidad es 0, suma 0 y no afecta)
- Acumulo: total = total + valorVenta(venta)
- Devuelvo: total

**unidadesVendidas(ventas)**
- Inicio: unidades = 0 (acumulador)
- Recorro: cada venta
- Condición: ninguna
- Acumulo: unidades = unidades + venta.cantidad
- Devuelvo: unidades

**ventaMayor(ventas)**
- Inicio: mayor = null (todavía no he visto ninguna venta)
- Recorro: cada venta
- Condición: si mayor es null O valorVenta(venta) > valorVenta(mayor)
- Acción: mayor = venta (guardo el registro completo)
- Devuelvo: mayor

**ticketPromedio(ventas)**
- Inicio: total = 0 (acumulador), validas = 0 (contador)
- Recorro: cada venta
- Condición: venta.cantidad > 0
- Acumulo: total = total + valorVenta(venta); validas = validas + 1
- Si validas es 0, devuelvo 0 (evito dividir entre cero)
- Devuelvo: total / validas

**ventasPorCiudad(ventas, ciudad)**
- Inicio: total = 0 (acumulador)
- Recorro: cada venta
- Condición: ciudad de la venta == ciudad buscada, ignorando mayúsculas y espacios sobrantes
- Acumulo: total = total + valorVenta(venta)
- Devuelvo: total

## Decisiones con arreglo vacío — Punto 6, segundo minireto

| Función | Devuelve con [] | Por qué |
|---|---|---|
| totalVendido | 0 | No hay ventas, el acumulador queda en su valor inicial. |
| unidadesVendidas | 0 | Igual: no se vendió nada. |
| ventaMayor | null | No existe ningún registro que devolver; null indica "no hay venta mayor". |
| ticketPromedio | 0 | Sin ventas válidas no se puede dividir; devuelvo 0 en vez de NaN o Infinity. |
| ventasPorCiudad | 0 | Ninguna venta coincide, el acumulador queda en 0. |

Caso extra: con solo la venta id 8 (cantidad 0), ticketPromedio devuelve 0 porque no hay ventas válidas.

## Verificación a mano (tablas de traza) — Punto 7, segundo minireto

### totalVendido y unidadesVendidas (inician en 0)

| Vuelta (id) | valorVenta | total acumulado | unidades acumuladas |
|---|---|---|---|
| 1  | 2 × 42000 = 84000   | 84000  | 2  |
| 2  | 1 × 26000 = 26000   | 110000 | 3  |
| 3  | 1 × 95000 = 95000   | 205000 | 4  |
| 4  | 1 × 42000 = 42000   | 247000 | 5  |
| 5  | 3 × 45000 = 135000  | 382000 | 8  |
| 6  | 2 × 26000 = 52000   | 434000 | 10 |
| 7  | 1 × 120000 = 120000 | 554000 | 11 |
| 8  | 0 × 42000 = 0       | 554000 | 11 |
| 9  | 2 × 45000 = 90000   | 644000 | 13 |
| 10 | 4 × 42000 = 168000  | 812000 | 17 |
| 11 | 1 × 95000 = 95000   | 907000 | 18 |
| 12 | 3 × 26000 = 78000   | 985000 | 21 |

Resultado a mano: total = 985000 y unidades = 21. Coincide con el programa.

### ventaMayor (inicia con mayor = null)

| Vuelta (id) | valorVenta | ¿Supera al mayor? | mayor después |
|---|---|---|---|
| 1  | 84000  | sí (era null)     | id 1  (84000)  |
| 2  | 26000  | no                | id 1  |
| 3  | 95000  | sí                | id 3  (95000)  |
| 4  | 42000  | no                | id 3  |
| 5  | 135000 | sí                | id 5  (135000) |
| 6  | 52000  | no                | id 5  |
| 7  | 120000 | no                | id 5  |
| 8  | 0      | no                | id 5  |
| 9  | 90000  | no                | id 5  |
| 10 | 168000 | sí                | id 10 (168000) |
| 11 | 95000  | no                | id 10 |
| 12 | 78000  | no                | id 10 |

Resultado a mano: la venta mayor es el id 10 (168000). Coincide con el programa.

### ticketPromedio

Ventas válidas (cantidad > 0): 11 (todas menos el id 8).
Total válido: 985000. Ticket promedio = 985000 / 11 ≈ 89545.45. Coincide con el programa.

---

# TERCER MINIRETO

# DÍA 1 — TERCER MINIRETO
Indicadores con métodos de arreglo, agrupaciones y rankings.

## Preguntas que responde cada función — Punto 6, tercer minireto

### totalVendidoM
- ¿Qué recorro? Todas las ventas (con reduce).
- ¿Qué filtro? Nada.
- ¿Qué transformo? Cada venta en su valor con valorVenta.
- ¿Qué acumulo? La suma de los valores, iniciando en 0.
- ¿Cómo agrupo? No agrupo.

### unidadesVendidasM
- ¿Qué recorro? Todas las ventas (con reduce).
- ¿Qué filtro? Nada.
- ¿Qué transformo? Nada, uso venta.cantidad directamente.
- ¿Qué acumulo? La suma de las cantidades, iniciando en 0.
- ¿Cómo agrupo? No agrupo.

### ventasPorCiudadM
- ¿Qué recorro? Todas las ventas.
- ¿Qué filtro? Con filter, las ventas cuya ciudad normalizada coincide con la buscada.
- ¿Qué transformo? Con map, cada venta filtrada en su valor.
- ¿Qué acumulo? Con reduce, la suma de esos valores, iniciando en 0.
- ¿Cómo agrupo? No agrupo, devuelvo un solo total.

### totalPorCiudad
- ¿Qué recorro? Todas las ventas (con reduce).
- ¿Qué filtro? Nada.
- ¿Qué transformo? El nombre de la ciudad (sin espacios sobrantes y con mayúscula inicial) y la venta en su valor.
- ¿Qué acumulo? El dinero de cada ciudad dentro de un objeto que inicia vacío ({}).
- ¿Cómo agrupo? Con un objeto como diccionario, donde la clave es la ciudad normalizada.

### unidadesPorProducto
- ¿Qué recorro? Todas las ventas (con reduce).
- ¿Qué filtro? Nada; la venta con cantidad 0 suma 0.
- ¿Qué transformo? Nada, uso venta.cantidad.
- ¿Qué acumulo? Las unidades de cada producto, en un objeto que inicia vacío ({}).
- ¿Cómo agrupo? Con un objeto como diccionario, donde la clave es el producto.

### topProductosPorValor
- ¿Qué recorro? Todas las ventas (con reduce) y después las entradas del diccionario.
- ¿Qué filtro? Con slice(0, k) me quedo solo con los k primeros.
- ¿Qué transformo? Cada venta en su valor, y cada par [producto, total] en un objeto { producto, total }.
- ¿Qué acumulo? El dinero de cada producto.
- ¿Cómo agrupo? Por producto, con un diccionario; luego ordeno de mayor a menor un arreglo nuevo (Object.entries) para no modificar el original.

### Resultado con arreglo vacío
- totalPorCiudad([]) y unidadesPorProducto([]) devuelven {}.
- topProductosPorValor([], 3) devuelve [].
- Las versiones M devuelven 0, igual que las versiones con ciclo.

## Resultado de verificar.js — Punto 7, tercer minireto

Ejecuté verificar.js con el arreglo completo, un solo elemento, el arreglo vacío y la venta con cantidad 0.
Todas las comparaciones entre ciclo y métodos dieron OK y el resultado final fue TODO OK.


---

# CUARTO MINIRETO

# DÍA 1 — CUARTO MINIRETO
Reporte de negocio (v0.1) y depuración de errores reportados.

## Error 1: "Bogotá" aparece dos veces — Punto 4, cuarto minireto

- **Síntoma:** en la versión preliminar, una misma ciudad aparece como dos grupos distintos en el reporte (por ejemplo "Bogotá" y "Bogotá ").
- **Entrada que lo produce:** ventas cuya ciudad está escrita distinto: con un espacio al final ("Bogotá ") o en minúscula ("medellín", id 5 de los datos reales).
- **Hipótesis:** el agrupamiento usa el texto de la ciudad tal cual, y en un objeto cada texto distinto es una clave distinta.
- **Prueba realizada:** ejecuté la versión preliminar en src/depurar.js y mostré las claves con Object.keys. Con la entrada de Bogotá devolvió ['Bogotá', 'Bogotá '], y con los datos reales separó 'Medellín' y 'medellín'.
- **Causa:** no se normalizaba el nombre de la ciudad antes de usarlo como clave del grupo.
- **Corrección:** totalPorCiudad aplica titulo() (quita espacios sobrantes, pasa a minúsculas y pone mayúscula inicial) antes de agrupar.
- **Demostración en mi versión:** Object.keys(totalPorCiudad(...)) devuelve ['Bogotá'] y ['Medellín', 'Bogotá', 'Cali', 'Pereira']; la prueba sinDuplicados da OK.

## Error 2: el ticket promedio da NaN en un día sin ventas — Punto 4, cuarto minireto

- **Síntoma:** al filtrar un día sin ventas, el ticket promedio aparece como NaN.
- **Entrada que lo produce:** un arreglo vacío, por ejemplo las ventas del día "2026-09-07" (no existe ninguna).
- **Hipótesis:** se divide el total (0) entre la cantidad de ventas (0), y 0 / 0 no es un número válido.
- **Prueba realizada:** en src/depurar.js filtré el día sin ventas (resultado []), mostré 0 / 0 (da NaN) y ejecuté la versión preliminar, que devolvió NaN.
- **Causa:** la versión preliminar divide entre ventas.length sin revisar si es 0.
- **Corrección:** ticketPromedio cuenta solo las ventas válidas (cantidad > 0) y, si ese contador es 0, devuelve 0 antes de dividir. ventasDelDia reutiliza esa función.
- **Demostración en mi versión:** ticketPromedio([]) devuelve 0 y Number.isNaN da false; ventasDelDia(ventas, "2026-09-07") devuelve ticketPromedio 0 y el reporte muestra "Sin ventas registradas este día".

## Verificación del reporte — Punto 6, cuarto minireto

Ejecuté reporte.js y busqué "NaN" y "undefined" en su salida con findstr: sin coincidencias.
Cada ciudad y cada producto aparece una sola vez. verificar.js terminó en TODO OK y depurar.js confirmó que mi versión no repite grupos ni devuelve NaN.



---

# DÍA 2 — MINIRETO 1
Generador de datos y medición del crecimiento del trabajo.

## Predicción antes de medir — Punto 3, minireto 1 del día 2

**Reglas de conteo:** sumo 1 cada vez que visito un elemento del arreglo y 1 por cada comparación (incluida la búsqueda de una clave en el diccionario).

**Pregunta:** si n se multiplica por 10, ¿cuánto se multiplica el número de operaciones de cada función?

| Función | Si n se multiplica por 10, las operaciones... | Razón |
|---|---|---|
| totalVendido | se multiplican por 10 | Un solo ciclo que visita cada venta una vez. |
| ventaMayor | se multiplican por 10 | Un solo ciclo; en cada vuelta hace un número fijo de comparaciones. |
| totalPorCiudad | se multiplican por 10 | Un solo ciclo; en cada vuelta hace un número fijo de pasos, porque hay pocas ciudades y el diccionario encuentra el grupo directamente. |
| primeraVenta | no cambian (×1) | Accede directo a la posición 0 sin recorrer nada. |

**Predicción numérica con n = 100:** totalVendido ≈ 100, ventaMayor ≈ 300, totalPorCiudad ≈ 200, primeraVenta = 1.

## Resultados, comparación con la predicción y clasificación — Punto 6, minireto 1 del día 2

### Resultados medidos (operaciones)

| n | totalVendido | ventaMayor | totalPorCiudad | primeraVenta |
|---|---|---|---|---|
| 100 | 100 | 299 | 200 | 1 |
| 1.000 | 1.000 | 2.999 | 2.000 | 1 |
| 10.000 | 10.000 | 29.999 | 20.000 | 1 |
| 100.000 | 100.000 | 299.999 | 200.000 | 1 |

### Predicción contra resultado

| Función | Predicción | Resultado | ¿Acerté? |
|---|---|---|---|
| totalVendido | ×10 | ×10.00 | Sí |
| ventaMayor | ×10 | ×10.03 y luego ×10.00 | Sí |
| totalPorCiudad | ×10 | ×10.00 | Sí |
| primeraVenta | ×1 | ×1.00 | Sí |

Predicción numérica con n = 100: totalVendido ≈ 100, ventaMayor ≈ 300 y totalPorCiudad ≈ 200. Resultado: 100, 299 y 200. El pequeño desvío de ventaMayor (299 en vez de 300) es porque la comparación de valores empieza desde la segunda venta.

### Clasificación

| Función | Clasificación | Justificación con el código | Justificación con los números |
|---|---|---|---|
| totalVendido | O(n) | Un solo ciclo for...of que visita cada venta una vez. | Hace exactamente n operaciones; al multiplicar n por 10, se multiplican por 10. |
| ventaMayor | O(n) | Un solo ciclo con un número fijo de comparaciones por vuelta. | Hace 3n − 1 operaciones; la razón de crecimiento es ≈ 10. |
| totalPorCiudad | O(n) | Un solo ciclo; cada vuelta busca la clave directamente en el diccionario, sin recorrer los grupos. | Hace 2n operaciones; la razón de crecimiento es 10.00. |
| primeraVenta | O(1) | Accede a ventas[0] sin ciclo. | Siempre hace 1 operación, con 100 o con 100.000 ventas. |

### Observaciones
- Ninguna función es O(n²), porque ninguna tiene un ciclo dentro de otro ciclo. Si existiera una, al multiplicar n por 10 sus operaciones se multiplicarían por 100.
- Las constantes (3n − 1, 2n) no cambian la clasificación: lo que importa es que el trabajo crece en proporción directa a n.
- Para sumar n ventas hay que visitarlas todas, así que O(n) es lo mínimo posible en estas tres funciones; no se puede hacer mejor.