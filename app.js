const express = require('express');
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

// Leer datos de formularios (req.body) enviados por POST
app.use(express.urlencoded({ extended: true }));

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