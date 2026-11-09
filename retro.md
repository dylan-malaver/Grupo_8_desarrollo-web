
## Comenzar a hacer
- Probar cada validación apenas la escribo, con casos buenos y malos.
- Escribir mensajes de error claros que le digan al usuario qué corregir.

## Hacer más
- Probar el sitio con JavaScript desactivado, para comprobar que el servidor valida por sí solo.
- Hacer commits pequeños después de cada parte que funciona.

## Continuar haciendo
- Separar el código en carpetas (rutas, controladores, validaciones, modelos y vistas).
- Usar la base de datos MySQL con Sequelize en lugar de archivos JSON.
- Guardar las contraseñas encriptadas.

## Hacer menos
- Ejecutar comandos sin comprobar en qué carpeta y en qué rama estoy.

## Dejar de hacer
- Crear ramas desde la página de GitHub sin revisar de qué commit parten.

## Principales dificultades
- Entender cómo se relacionan las tablas (por ejemplo, productos y colores en una relación muchos a muchos).
- Pasar el CRUD de archivos JSON a Sequelize, porque cambian los ids y la forma de leer los datos.
- Un archivo se cortó al copiarlo y el sitio no arrancaba; lo resolví leyendo el error de la terminal.

## Aprendizajes
Una base de datos bien diseñada y Sequelize hacen el sitio más ordenado y escalable, y separar el modelo, las rutas, los controladores y las vistas facilita encontrar y corregir errores.