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


---

# DÍA 2 — MINIRETO 2
Diagnóstico de complejidad de clientesRecurrentes.

## Traza con 5 ventas y número de comparaciones — Punto 2, minireto 2 del día 2

Clientes del arreglo de prueba: [C01, C02, C03, C01, C04]

| i | j | cliente[i] | cliente[j] | ¿Iguales? | Acción | recurrentes |
|---|---|---|---|---|---|---|
| 0 | 1 | C01 | C02 | no | nada | [] |
| 0 | 2 | C01 | C03 | no | nada | [] |
| 0 | 3 | C01 | C01 | sí | includes("C01") da false, agrego C01 | [C01] |
| 0 | 4 | C01 | C04 | no | nada | [C01] |
| 1 | 2 | C02 | C03 | no | nada | [C01] |
| 1 | 3 | C02 | C01 | no | nada | [C01] |
| 1 | 4 | C02 | C04 | no | nada | [C01] |
| 2 | 3 | C03 | C01 | no | nada | [C01] |
| 2 | 4 | C03 | C04 | no | nada | [C01] |
| 3 | 4 | C01 | C04 | no | nada | [C01] |
| 4 | - | C04 | (no hay ventas después) | - | el ciclo interno no se ejecuta | [C01] |

Total: **10 comparaciones** de cliente. Resultado: [C01].

### Generalización para n ventas

Por cada i, el ciclo interno compara con (n − 1 − i) ventas:
- i = 0: n − 1 comparaciones
- i = 1: n − 2 comparaciones
- ...
- i = n − 1: 0 comparaciones

Suma = (n − 1) + (n − 2) + ... + 1 + 0 = **n(n − 1) / 2** = (n² − n) / 2.

| n | comparaciones |
|---|---|
| 5 | 10 |
| 12 | 66 |
| 1.000 | 499.500 |
| 16.000 | 127.992.000 |
| 100.000 | 4.999.950.000 |
| 1.000.000 | 499.999.500.000 |

Conclusión: el número de comparaciones crece como n² (el término dominante de (n² − n) / 2), por eso la función es O(n²).

## Tiempos medidos — Punto 3, minireto 2 del día 2

Medido en mi computador con Node.js, usando console.time y console.timeEnd, con ventas generadas al azar.

| n | tiempo (ms) | comparaciones | veces más que la fila anterior |
|---|---|---|---|
| 1.000 | 12.46 | 499.500 | '-' |
| 2.000 |  30.14 | 1.999.000 | '2.42' |
| 4.000 |  162.04 | 7.998.000 |  '5.38' |
| 8.000 |  597.74 | 31.996.000 | '3.69' |
| 16.000 | 1967.6 | 127.992.000 | '3.29' |

## Análisis de la tabla — Punto 4, minireto 2 del día 2

- **Cuando n se duplica, el tiempo se multiplica por ≈ ['2.42', '5.38', '3.69', '3.29' ]** (valores medidos en la columna "veces más que la fila anterior").
- **Relación con O(n²):** si el trabajo es proporcional a n², al duplicar n queda (2n)² = 4n². Por eso lo esperado es ×4, y lo medido se acerca a ese valor.
- **Segunda evidencia:** el tiempo por comparación (ns por comparación) se mantiene casi constante, [ 24.95, 15.08, 20.26, 18.68, 15.37 ] ns aprox., así que el tiempo total depende solo de cuántas comparaciones se hacen, y esas crecen como n(n − 1)/2.
- **Contraste con O(n):** en una función lineal, al duplicar n el tiempo se duplicaría (×2). Aquí se cuadruplica, así que el crecimiento es mucho más rápido.
- **Nota:** con n pequeño (1.000 y 2.000) la razón puede desviarse por el ruido de medir tiempos de pocos milisegundos.

## Estimación de tiempos — Punto 5, minireto 2 del día 2

Fórmula: t(n) ≈ t(16.000) × (n / 16.000)², porque el tiempo crece como n².

Dato base: con n = 16.000 la función tardó [ ] ms.

| n | Estimación | Cómo se calculó |
|---|---|---|
| 100.000 | 81.6 segundos | t(16.000) × 39,06 |
| 1.000.000 | 2.3 horas | t(16.000) × 3.906,25 |

- ¿Se ejecutó 100.000? [Sí, porque la estimación fue menor a 2 minutos].
- Resultado real con 100.000 (si se ejecutó): [81.6 segundos ] frente a la estimación de [2 minutos ].
- Con 1.000.000 de ventas no se ejecuta: la estimación es de [2.3 horas ], y harían falta unas 500.000 millones de comparaciones.

## Costo oculto de includes — Punto 6, minireto 2 del día 2

- **Qué hace includes:** recorre el arreglo recurrentes hasta encontrar el cliente. Si recurrentes tiene r elementos, hace hasta r comparaciones.
- **Dónde está:** dentro de los dos ciclos. Se ejecuta cada vez que dos ventas son del mismo cliente, incluso si ese cliente ya está en la lista.
- **Efecto en la complejidad:** el costo de includes se multiplica por el número de veces que se ejecuta.
  - Ciclos anidados: hasta n(n − 1)/2 pares → O(n²).
  - includes: hasta r comparaciones por ejecución, con r hasta n/2.
- **Peor caso:** n/2 ventas con n/4 clientes distintos (cada uno dos veces) y n/2 ventas de un mismo cliente al final.
  - Pares iguales ≈ n²/8, cada includes recorre ≈ n/4 elementos → ≈ n³/32 comparaciones.
  - Complejidad en el peor caso: **O(n³)** (cúbica).
- **Con n = 1.000 en el peor caso:** 499.500 comparaciones del ciclo doble + ≈ 31 millones de includes.
- **Prueba medida:**

| n | al azar (ms) | peor caso (ms) | peor caso: veces más que antes |
|---|---|---|---|
| 500 | [ ] | [ ] | - |
| 1.000 | [ ] | [ ] | [ ] |
| 2.000 | [ ] | [ ] | [ ] |
| 4.000 | [ ] | [ ] | [ ] |

- **Conclusión:** en el peor caso, al duplicar n el tiempo se acerca a ×8 (cúbico) en vez de ×4 (cuadrático). Con datos normales includes suma un costo del mismo orden que el ciclo doble, pero en el peor caso lo empeora un orden más.

## Conclusión para la gerente — Punto 7, minireto 2 del día 2

**¿Por qué el reporte de clientes recurrentes se vuelve lento?**

El reporte averigua quién compró más de una vez tomando cada compra y comparándola con todas las compras que vienen después. Es como si, para saber qué clientes se repiten, alguien revisara cada factura contra todas las demás una por una.

Con pocas ventas eso es instantáneo. Pero el trabajo no crece al mismo ritmo que las ventas, crece mucho más rápido: si el historial se duplica, el trabajo se multiplica por cuatro; si se multiplica por diez, el trabajo se multiplica por cien. Con un historial anual, con cientos de miles de compras, son decenas de miles de millones de comparaciones, y por eso el computador "se queda pensando varios minutos". En mis pruebas, con 16.000 ventas tardó [ ] segundos, y estimo que con un millón de ventas tardaría [ ].

Además, cada vez que el reporte encuentra un cliente repetido, vuelve a revisar desde el principio la lista de clientes que ya anotó, lo que empeora la lentitud cuando hay muchos clientes.

**No es un error ni un daño:** el reporte da resultados correctos, solo que el procedimiento es poco eficiente para volúmenes grandes. Se puede resolver cambiando la forma de contar: en vez de comparar cada compra con todas las demás, llevar una libreta donde se anote cuántas veces compró cada cliente, mirando cada compra una sola vez. Con eso el tiempo crecería solo en proporción a las ventas: el doble de ventas, el doble de tiempo.

---

# DÍA 2 — MINIRETO 3
Complejidad espacial y comparación entre cadena de métodos y recorrido único.

## Recorridos, arreglos nuevos y Big O — Punto 4, minireto 3 del día 2

Medido con n = 10.000 ventas generadas al azar y la ciudad Medellín (k = ventas de esa ciudad, k ≤ n).

| | totalCiudadCadena | totalCiudadUnaPasada |
|---|---|---|
| Recorridos | map y filter sobre las n ventas, map y reduce sobre las k de la ciudad: 2n + 2k visitas. Máximo 4 recorridos completos (si k = n). | 1 recorrido de las n ventas. |
| Visitas medidas | '9.76' (≈ 2,5 × n) | '2.50' (= n) |
| Arreglos nuevos | 3: el primer map guarda n objetos copiados, el filter guarda k y el segundo map guarda k. |  3 |
| Elementos guardados en arreglos nuevos | 15044 (n + 2k) |  0 |
| **Big O de tiempo** | **O(n)** | **O(n)** |
| **Big O de espacio** | **O(n)** | **O(1)** |

**Por qué el espacio de la cadena es O(n):** en el peor caso (k = n) guarda n + n + n elementos, o sea 3n, y la memoria adicional crece en proporción a n. Además, el primer map crea n objetos nuevos (no solo referencias), lo que es lo más costoso en memoria.

**Por qué el espacio de la versión de una pasada es O(1):** solo usa dos variables simples (buscada y total) y la memoria temporal pequeña de normalizar, que se libera enseguida. No depende de n.

## Por qué ambas son O(n) en tiempo — Punto 5, minireto 3 del día 2

- **Trabajo de cada versión:** la cadena hace 2n + 2k visitas (como máximo 4n, cuando k = n) y la de una pasada hace n.
- **Regla de simplificación:** en Big O se eliminan las constantes. 4n, 2n + 2k y n son todas O(n), porque crecen en proporción directa a n.
- **Evidencia medida:** al multiplicar n por 10, las visitas se multiplicaron por 10 en la cadena y por 10 en la de una pasada. Ambas crecen ×10.

| n | visitas cadena | visitas una pasada |
|---|---|---|
| 1.000 | '9.76' | '10.00' |
| 10.000 | '9.76' | '10.00' |
| 100.000 | '9.76' | '10.00' |

- **Qué sí cambia:** la constante. La cadena hace entre 2,5 y 4 veces más visitas que la de una pasada, así que en la práctica es más lenta, aunque pertenezca a la misma clase.
- **Conclusión:** Big O sirve para saber cómo crece el trabajo, no para decir cuál es más rápida. Para decidir entre dos versiones de la misma clase, hay que mirar la constante y también la memoria (espacio), donde sí difieren: O(n) contra O(1).

## Complejidad espacial de las funciones del motor — Punto 6, minireto 3 del día 2

Se cuenta la memoria adicional que crea cada función, sin contar el arreglo ventas que recibe. g = ciudades distintas, p = productos distintos, k = ventas filtradas (todos ≤ n).

| Función | Espacio adicional | Por qué |
|---|---|---|
| valorVenta | O(1) | Una multiplicación. |
| totalVendido, unidadesVendidas | O(1) | Un acumulador numérico. |
| ventaMayor | O(1) | Guarda una referencia al registro mayor, no una copia. |
| ticketPromedio | O(1) | Dos números: total y contador. |
| ventasPorCiudad | O(1) | Un acumulador. |
| totalVendidoM, unidadesVendidasM | O(1) | reduce usa un acumulador y no crea arreglos. |
| ventasPorCiudadM | O(n) | filter crea un arreglo de k ventas y map otro de k valores (k ≤ n). |
| totalPorCiudad | O(g) | El diccionario guarda una clave por ciudad distinta, no por venta. Con pocas ciudades es casi constante; en el peor caso (cada venta de una ciudad distinta) llega a O(n). |
| unidadesPorProducto | O(p) | Igual que totalPorCiudad: una clave por producto distinto. |
| topProductosPorValor | O(p) | Crea el diccionario de p productos y varios arreglos de tamaño p (entries, map, slice). Ordena esa copia, no las n ventas. En el peor caso p = n. |
| ventasDelDia | O(n) en el peor caso | filter crea un arreglo con las ventas del día (hasta n) y otro filter para contar las válidas. |
| totalVendidoContado, ventaMayorContada, primeraVenta | O(1) | Solo variables simples y el contador. |
| totalPorCiudadContado | O(g) | Usa un diccionario como totalPorCiudad. |
| clientesRecurrentes | O(n) en el peor caso | El arreglo recurrentes crece con los clientes repetidos (hasta n/2); includes no crea arreglos. |
| totalCiudadCadena | O(n) | Tres arreglos intermedios. |
| totalCiudadUnaPasada | O(1) | Un acumulador y una variable. |
| generarVentas | O(n) | Su resultado es un arreglo de n ventas (es la salida, no memoria auxiliar). |

### Lo que se aprende
- **Memoria adicional constante, O(1):** las funciones con un solo ciclo y un acumulador, y las que usan reduce con un acumulador.
- **Memoria proporcional a los datos, O(n):** las que crean arreglos intermedios (filter y map encadenados, ventasDelDia) o copias.
- **totalPorCiudad y topProductosPorValor** no dependen de n sino del número de grupos (ciudades o productos). Como en este negocio hay pocos grupos, en la práctica gastan poco, pero no son O(1): si los grupos crecen, la memoria también.
- Usar filter y map encadenados es cómodo, pero cada paso reserva memoria nueva. Un solo reduce o un ciclo con acumulador evita esos arreglos.

## Decisión: qué versión de totalCiudad queda en el motor — Punto 7, minireto 3 del día 2

**Decisión:** dejo totalCiudadUnaPasada en el motor.

**Justificación:**
- **Recursos:** usa memoria adicional O(1) frente a O(n) de la cadena, que crea 3 arreglos y copia n objetos en el primer map. En un servidor con memoria limitada, eso decide.
- **Tiempo:** ambas son O(n), pero la de una pasada hace entre 2,5 y 4 veces menos visitas.
- **Legibilidad:** la cadena se lee como una receta, pero el ciclo ya es corto y claro (una condición y un acumulador). Con un comentario, la diferencia de claridad es pequeña.
- **Cuándo aceptaría la cadena:** con pocos datos, código que se ejecuta una sola vez, o un equipo que prefiera el estilo declarativo y no tenga límite de memoria.
- **Alternativa intermedia no elegida:** un solo reduce con la condición adentro (una pasada, sin arreglos intermedios, estilo funcional).
- **Observación:** totalCiudadUnaPasada es funcionalmente igual a ventasPorCiudad (primer día). No las unifico ahora para no romper verificar.js ni reporte.js.
- **Qué hice con la otra:** totalCiudadCadena sale del motor y se conserva en src/comparar.js solo como referencia de la comparación.


---

# DÍA 2 — MINIRETO 4
Informe técnico de rendimiento (v0.2).

## Revisión del informe y respuesta — Punto 6, minireto 4 del día 2

- **Revisor:** Claude (asistente de IA)
- **Fecha de la revisión:** 22/11/2026
- **Cómo se revisó:** leyó el contenido de RENDIMIENTO.md (estructura, justificaciones, riesgos y plan). No ejecutó el script en mi computador.

### Observación 1
- **Observación del revisor:** la complejidad espacial no tiene evidencia medida; el informe promete evidencia pero solo los tiempos se midieron.
- **Mi respuesta:** Acepto en parte.
- **Por qué:** tiene razón en que falta evidencia. No voy a medir la memoria de todas las funciones con process.memoryUsage porque el recolector de basura hace esa medición poco confiable. Sí puedo respaldar el caso más importante con un dato exacto: los arreglos nuevos y los elementos guardados que cuenta comparar.js.
- **Qué cambié en RENDIMIENTO.md:** agregué la sección "Evidencia de memoria" bajo la tabla, con los datos de comparar.js, y aclaré que el resto de la columna de espacio es análisis del código.

### Observación 2
- **Observación del revisor:** Riesgos afirma que el peor caso de clientesRecurrentes es O(n³), pero el informe no muestra la prueba.
- **Mi respuesta:** Acepto.
- **Por qué:** la medición existe (medirRecurrentes.js, tabla "datos al azar contra peor caso"), pero un lector del marketplace no ve la bitácora.
- **Qué cambié en RENDIMIENTO.md:** agregué en Riesgos la subsección "Evidencia del peor caso de clientesRecurrentes" con los tiempos medidos.

### Observación 3
- **Observación del revisor:** totalCiudadCadena aparece en el puesto 2 del ranking sin decir que no está en el motor.
- **Mi respuesta:** Acepto.
- **Por qué:** el ranking es del motor, y esa función solo se conserva como referencia (decisión del minireto 3).
- **Qué cambié en RENDIMIENTO.md:** en la tabla de Riesgos, la celda queda como "totalCiudadCadena (referencia, no está en el motor)".



---

# DÍA 3 — MINIRETO 1
Optimización del reporte de clientes recurrentes.

## Método de resolución de retos — Punto 1, minireto 1 del día 3

### 1. Entender el problema

- **Entrada:** un arreglo ventas de n objetos; de cada uno solo se usa la propiedad cliente (texto, por ejemplo "C01").
- **Salida:** un arreglo con los códigos de los clientes que compraron más de una vez, cada uno una sola vez.
- **Restricciones:**
  - Con 100.000 ventas debe responder en menos de 1 segundo (exigencia del marketplace).
  - El servidor tiene memoria limitada.
  - No debe modificar el arreglo ventas.
  - El orden del resultado no importa; las versiones se compararán ordenadas.
- **Decisiones sobre qué cuenta como compra:**
  - Cada fila de ventas es una compra, aunque tenga cantidad 0 (la versión original hace lo mismo).
  - Los códigos de cliente se comparan tal cual, sin normalizar ("C01" y "c01" serían distintos).

### 2. Ejemplos y casos borde

| Caso | Clientes de entrada | Salida esperada |
|---|---|---|
| Arreglo vacío | [] | [] |
| Una sola venta | [C01] | [] |
| Nadie repite | [C01, C02, C03] | [] |
| Dos compras del mismo cliente | [C01, C01] | [C01] |
| Un cliente compra muchas veces | [C01, C01, C01, C01] | [C01] (una sola vez) |
| Varios recurrentes | [C01, C02, C01, C02] | C01 y C02 (el orden no importa) |
| El orden puede cambiar | [A, B, B, A] | A y B (la original da [A, B], la de Set da [B, A]) |
| Datos del Día 1 | 12 ventas | C01, C02 y C03 |
| Cantidad 0 repetida | C06 con cantidad 0 y C06 con cantidad 3 | [C06] (la fila con cantidad 0 cuenta como compra) |
| Cantidad 0 sola | C06 aparece una vez, con cantidad 0 | no es recurrente |

### 3. Fuerza bruta y su complejidad

- **Idea:** comparar cada venta con todas las que vienen después. Si dos son del mismo cliente y el cliente no está en la lista de recurrentes, se agrega (es la función clientesRecurrentes original).
- **Tiempo:** O(n²), con n(n − 1)/2 comparaciones. Con 100.000 ventas son 4.999.950.000 comparaciones.
- **Costo oculto:** recurrentes.includes recorre la lista dentro de los dos ciclos; en el peor caso el total llega a O(n³).
- **Memoria:** O(r), con r = clientes recurrentes (r ≤ n/2).
- **Evidencia (Día 2):** con 16.000 ventas tardó  2.1 segundos y se estimó 2.3 horas para 1.000.000.

### 4. Idea de optimización

- **Qué trabajo se repite:** para saber si un cliente se repite, la fuerza bruta lo vuelve a buscar desde cero en cada vuelta, y includes vuelve a recorrer la lista de recurrentes.
- **Qué guardar:** una estructura de búsqueda en tiempo constante con lo que ya vimos:
  - con Set: un conjunto de clientes ya vistos y otro de recurrentes;
  - con Map: un diccionario cliente → cantidad de compras.
- **Algoritmo:** recorrer las ventas una sola vez y, para cada una, consultar y actualizar la estructura.
- **Complejidad esperada:** tiempo O(n), memoria O(c), con c = clientes distintos (c ≤ n).

## Verificación de las tres versiones — Punto 4, minireto 1 del día 3

- Ejecuté src/verificarRecurrentes.js con los datos del Día 1, 5.000 ventas generadas y los casos borde (vacío, una venta, nadie repite, un cliente 4 veces y A, B, B, A).
- Las tres versiones devolvieron los mismos clientes al compararlos ordenados, sin repetidos, y el resultado fue TODO OK.
- El orden sí cambia: con A, B, B, A, la original y la de Map dan [A, B] y la de Set da [B, A]. Por eso se compara ordenado.


## Mediciones de las tres versiones — Punto 5, minireto 1 del día 3

Medido en mi computador con Node.js, con ventas generadas al azar (src/medirOptimizacion.js). La versión original se ejecuta solo si su tiempo estimado es menor a 1 minuto.

| n | Original | Set | Map | Original ÷ Set |
|---|---|---|---|---|
| 1.000 | 4,18 ms | 480,8 µs | 326,7 µs | 9× |
| 10.000 | 779,86 ms | 1,14 ms | 1,11 ms | 682× |
| 100.000 | ≈ 78,0 s (estimado, no se ejecutó) | 16,99 ms | 13,53 ms | - |

### Original
- Al pasar de 1.000 a 10.000 ventas (n × 10), el tiempo se multiplicó por ≈ 187 (de 4,18 ms a 779,86 ms). Para O(n²) se espera ≈ ×100. Sale más porque con 4 ms pesan el calentamiento y el costo oculto de includes, que también crece con n. Lo importante es que crece mucho más rápido que ×10, que es lo esperado en O(n) y no en O(n²).
- Con 100.000 ventas no se ejecutó: la estimación fue 779,86 ms × 100 = 78,0 s, mayor al límite de 1 minuto.

### Set y Map
- Set: de 1.000 a 10.000 se multiplicó por ≈ 2,4 y de 10.000 a 100.000 por ≈ 15. Map: por ≈ 3,4 y por ≈ 12. Para O(n) se espera ≈ ×10 en cada salto. Se desvía hacia los dos lados porque a estos tiempos (microsegundos y pocos milisegundos) pesan el calentamiento, el crecimiento de la tabla hash y la caché del procesador.
- En conjunto, de 1.000 a 100.000 ventas (n × 100) el tiempo de Set se multiplicó por ≈ 35 y el de Map por ≈ 41. Es un crecimiento cercano al lineal y muy lejos del ×10.000 que tendría un algoritmo O(n²).

### Comparación
- Con 10.000 ventas, Set es 682 veces más rápido que la original.
- Con 100.000 ventas, usando la estimación de la original (78,0 s), Set sería ≈ 4.590 veces más rápido y Map ≈ 5.760 veces. Estos dos valores son estimados, porque la original no se ejecutó.

### Requisito del marketplace (menos de 1 s con 100.000 ventas)
- Set: CUMPLE con 16,99 ms (≈ 59 veces menos que el límite).
- Map: CUMPLE con 13,53 ms (≈ 74 veces menos que el límite).
- La versión original, con una estimación de 78,0 s, no cumpliría.


## Intercambio entre tiempo y memoria — Punto 6, minireto 1 del día 3

### Qué se gana
- El tiempo baja de O(n²) a O(n). Con 100.000 ventas, de casi 5.000 millones de comparaciones a unas 100.000 visitas.
- La causa es que la búsqueda de un cliente deja de recorrer una lista y pasa a ser una consulta casi directa. Set y Map son tablas hash: calculan dónde está cada valor, así que has, add, get y set toman un tiempo casi constante en promedio.

### Qué se paga
- La memoria adicional sube. La original guardaba solo los recurrentes (O(r)). Las nuevas guardan a todos los clientes distintos:
  - Set: O(c) en vistos y O(r) en recurrentes (un cliente recurrente queda en los dos Set).
  - Map: O(c), una entrada por cliente con su cantidad de compras.
- c puede llegar a ser n (si nadie repite). En los datos generados c ≈ n/3; con 100.000 ventas son unas 33.000 entradas, que son pocos megabytes. En un negocio real suele haber muchos menos clientes que ventas.

### Valió la pena
- Sí: se paga una cantidad pequeña de memoria (decenas de miles de entradas) para pasar de minutos a milisegundos, y se cumple el requisito del marketplace de menos de 1 s con 100.000 ventas.
- Un servidor con memoria limitada soporta guardar los clientes distintos con mucho margen; no soportaría esperar minutos por cada reporte.

### Set contra Map
- Set es más simple si solo hace falta saber si un cliente se repite.
- Map guarda además cuántas veces compró cada cliente, con la misma complejidad. Eso permite otros reportes (por ejemplo el cliente que más compró) sin recorrer las ventas otra vez.
- El orden del resultado: Map conserva el orden de la primera aparición (igual que la versión original); Set sale en el orden de la segunda compra.

### Regla general
Cuando hay una búsqueda dentro de un ciclo, hay que preguntarse qué información se puede guardar para no volver a buscarla. Casi siempre se cambia un poco de memoria por mucho tiempo.