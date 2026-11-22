# Café Origen – Motor de analítica de ventas (v0.1)

## ¿Qué es?
Un programa en JavaScript (Node.js) que lee el historial de ventas de Café Origen y genera un reporte de negocio legible en la consola, sin necesidad de abrir el código.

## Requisitos
- Node.js instalado (versión 18 o superior).

## Cómo ejecutarlo
Desde la carpeta del proyecto:

    node src\reporte.js

Otros comandos:

    node src\explorar.js    (exploración inicial de los datos)
    node src\verificar.js   (comprueba que los ciclos y los métodos dan lo mismo)
    node src\depurar.js     (reproduce y demuestra la corrección de errores reportados)
    node src\medir.js       (cuenta las operaciones de cada función al crecer los datos)
    node src\medirRecurrentes.js   (mide el tiempo de clientesRecurrentes al crecer los datos)
    node src\comparar.js   (compara tiempo y memoria de una cadena de métodos y un recorrido único)

Si las tildes se ven raras en cmd, ejecuta antes `chcp 65001`.

## ¿Qué preguntas responde?
- ¿Cuánto se vendió en total?
- ¿Cuántas unidades salieron?
- ¿Cuál fue la venta más grande?
- ¿Cuánto gasta en promedio un cliente por compra (ticket promedio)?
- ¿Cuánto se vendió en cada ciudad?
- ¿Qué productos vendieron más unidades?
- ¿Cuáles son los 3 productos que más dinero generaron?
- ¿Cómo le fue a la tienda en un día específico (incluso si no hubo ventas)?
- ¿Cuánto crece el trabajo de cada función cuando crecen los datos?
- ¿Qué clientes compraron más de una vez?
- ¿Cuánta memoria adicional usa cada versión de un cálculo?

## Estructura
- `src/datos.js`: ventas originales (12 registros, con sus errores)
- `src/analitica.js`: funciones de análisis (ciclos y métodos de arreglo)
- `src/reporte.js`: reporte de negocio por consola
- `src/explorar.js`: exploración inicial de los datos
- `src/verificar.js`: verificación de ciclos contra métodos
- `src/depurar.js`: reproducción de errores reportados
- `bitacora.md`: decisiones, casos borde y depuración
- `src/generador.js`: genera historiales de ventas de tamaño n
- `src/medir.js`: cuenta las operaciones de cada función al crecer n
- `src/medirRecurrentes.js`: mide y estima el tiempo de clientesRecurrentes
- `src/comparar.js`: compara una cadena de métodos con un recorrido único

## Decisiones importantes
- Las ventas con cantidad 0 no cuentan como ventas válidas en el ticket promedio.
- Los nombres de ciudad se normalizan, así "Bogotá", "Bogotá " y "bogotá" son el mismo grupo.
- Si un día no tiene ventas, el reporte lo indica y el ticket promedio es 0 (no NaN).