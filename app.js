const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/detalle', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/productDetail.html'));
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/productCart.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
