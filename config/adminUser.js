// =========================================================
// Usuario administrador (versión provisional para el Sprint 3)
//
// Todavía no hay base de datos de usuarios, así que el acceso de
// administrador usa un correo y una contraseña fijos aquí.
//
// IMPORTANTE: esto es temporal. En el sprint de "Middlewares + Auth"
// esto se reemplaza por usuarios guardados en base de datos, con
// contraseñas cifradas (por ejemplo con bcrypt). No es seguro para
// un sitio en producción, solo sirve para la demostración del curso.
// =========================================================
module.exports = {
    email: 'admin@floristeriaandrea.com',
    password: 'Andrea2026'
};