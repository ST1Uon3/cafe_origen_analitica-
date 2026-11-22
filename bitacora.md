## Diccionario de datos

| Propiedad | Tipo   | Significado |
|-----------|--------|-------------|
| id        | number | Identificador único y consecutivo de la venta. |
| fecha     | string | Fecha de la venta en formato AAAA-MM-DD (texto, no objeto Date). |
| cliente   | string | Código del cliente que compró (ej. "C01"). |
| producto  | string | Nombre del producto vendido, incluye la presentación (ej. "Origen Huila 500 g"). |
| ciudad    | string | Ciudad donde se hizo la venta o entrega. |
| cantidad  | number | Unidades vendidas en esa venta. |
| precio    | number | Precio por unidad en pesos colombianos (COP). El total es cantidad × precio. |

## Casos borde detectados

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