const express = require('express');
const session = require('express-session');
const path = require('path');

const mainRoutes = require('./routes/mainRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos públicos (css, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Leer los datos que envían los formularios (login, crear/editar producto, etc.)
app.use(express.urlencoded({ extended: true }));

// Sesión: recuerda si hay un administrador con la sesión iniciada.
// TODO (sprint de Middlewares + Auth): mover "secret" a una variable de entorno.
app.use(session({
    secret: 'floristeria-andrea-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 4 } // la sesión dura 4 horas
}));

// Disponible en todas las vistas: para que el header sepa si hay un administrador conectado
app.use((req, res, next) => {
    res.locals.isAdmin = Boolean(req.session && req.session.isAdmin);
    res.locals.adminEmail = (req.session && req.session.adminEmail) || null;
    next();
});

// Función disponible en todas las vistas: 85000 -> "$ 85.000 COP"
app.locals.formatPrice = (value) =>
    '$ ' + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' COP';

// Rutas
app.use('/', mainRoutes);
app.use('/', productRoutes);
app.use('/', userRoutes);

// Cualquier otra dirección: página no encontrada
app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});