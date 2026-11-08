const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

const mainRoutes = require('./routes/mainRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const SECRET = process.env.SESSION_SECRET || 'floristeria-andrea-secret';

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos públicos (css, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Leer los datos que envían los formularios
app.use(express.urlencoded({ extended: true }));

// PUT y DELETE desde formularios HTML con ?_method=PUT o ?_method=DELETE
app.use(methodOverride('_method'));

// Sesión (4 horas)
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 4 }
}));

// Cookies firmadas (para "recordarme")
app.use(cookieParser(SECRET));

// Middleware de aplicación: recuerda al usuario y lo expone como "userLogged"
app.use(userLoggedMiddleware);

// Disponible en todas las vistas: administrador conectado
app.use((req, res, next) => {
    res.locals.isAdmin = Boolean(req.session && req.session.isAdmin);
    res.locals.adminEmail = (req.session && req.session.adminEmail) || null;
    next();
});

// 85000 -> "$ 85.000 COP"
app.locals.formatPrice = (value) =>
    '$ ' + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' COP';

// Rutas
app.use('/', mainRoutes);
app.use('/', productRoutes);
app.use('/', userRoutes);

// Página no encontrada
app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});