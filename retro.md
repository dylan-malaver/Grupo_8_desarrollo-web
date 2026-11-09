
## Comenzar a hacer
- Crear cada rama a partir de la rama anterior y verificar con `git log` que tiene mi código antes de empezar.
- Abrir VS Code directamente en la carpeta interna del proyecto para no ejecutar comandos en la carpeta equivocada.

## Hacer más
- Probar cada funcionalidad apenas la termino (registro, login, perfil, cookies) en lugar de dejarlo para el final.
- Hacer commits pequeños después de cada parte que funciona.

## Continuar haciendo
- Mantener la estructura MVC y separar rutas, controladores, middlewares y vistas.
- Reutilizar los partials (head, header, footer).
- Guardar las contraseñas encriptadas con bcrypt y validar los datos también en el servidor.

## Hacer menos
- Ejecutar comandos de Git sin revisar antes con `git status` y `git branch` en qué rama estoy.
- Depender de datos de prueba en archivos JSON.

## Dejar de hacer
- Crear ramas desde la página de GitHub sin comprobar de qué commit parten: las ramas Sprint-5 y Sprint-6 quedaron copiadas de `main` y hubo que reemplazarlas.

## Principales dificultades
- El historial de la rama Sprint-5 en GitHub era distinto al local y tuve que resolverlo con un stash y un push con `--force-with-lease`.
- Los comandos de Git con llaves (`stash@{0}`) fallaron en PowerShell hasta que los escribí entre comillas.
- Confundir la carpeta externa con la interna del proyecto al ejecutar `npm`.

## Aprendizajes
Los middlewares permiten reutilizar la lógica de acceso (huéspedes, usuarios y recordar sesión) sin repetir código, y las sesiones y cookies son la base de cualquier sitio con usuarios.