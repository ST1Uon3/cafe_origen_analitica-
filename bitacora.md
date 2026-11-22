# Bitácora – Café Origen Analítica

---

# Semana 1

---

## Día 1

## PRIMER MINIRETO
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

## SEGUNDO MINIRETO
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

## TERCER MINIRETO
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