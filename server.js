const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

// --- Importar Modelos y Rutas ---
const User = require('./models/User');
const authRoutes = require('./routes/auth');

// --- Configuración de la Base de Datos MongoDB ---
const MONGODB_URI = 'mongodb://localhost:27017/perfumeriaDB';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- Middlewares de Express ---
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(express.json()); // Middleware para parsear JSON

// Configuración de Sesiones de Express
app.use(session({
    secret: 'tu_secreto_muy_seguro',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(flash());

// Middleware para pasar los mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Configura EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas ---

// Usa las rutas de autenticación
app.use('/', authRoutes);

// Rutas generales
app.get('/', (req, res) => {
    res.render('bienvenida', { user: req.session.user });
});

app.get('/inicio', (req, res) => {
    res.render('inicio', { user: req.session.user });
});

app.get('/caballero', (req, res) => {
    res.render('caballero'); // Asegúrate de pasar 'user' si lo necesitas en el header/footer
});

app.get('/dama', (req, res) => {
    res.render('dama'); // Asegúrate de pasar 'user' si lo necesitas
});

app.get('/perfil', (req, res) => {
    res.render('perfil');

    // Asegúrate de pasar 'user' si lo necesitas en el header/footer
});
app.get('/formapago', (req, res) => {
    res.render('formapago'); // Asegúrate de pasar 'user' si lo necesitas
});

// **********************************************
// RUTAS PARA EL CARRITO DE COMPRAS
// app.js (o donde tengas tus rutas)

// ... tus require, configuración de Express, sesiones, flash, etc. ...

app.get('/formapago', (req, res) => {
    // Es crucial pasar el carrito y el total a la vista
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => {
        total += item.precio * item.cantidad;
    });

    res.render('formapago', {
        cart: cart,     // Pasa el carrito a la vista para el resumen
        total: total,   // Pasa el total a la vista
        user: req.session.user // Pasa el objeto de usuario (para precargar nombre)
    });
});

// También necesitarás una ruta para procesar el formulario de pago
app.post('/procesar-pago', (req, res) => {
    // Aquí es donde procesarías la información del formulario de pago
    // (nombre, dirección, datos de tarjeta, etc.)
    const { nombre_envio, direccion, ciudad, estado, codigo_postal, telefono,
            tipo_tarjeta, numero_tarjeta, fecha_expiracion, cvv, nombre_titular } = req.body;

    // TODO:
    // 1. Validar los datos de entrada.
    // 2. Integrar con una pasarela de pago (Stripe, PayPal, MercadoPago, etc.).
    //    Para un proyecto simple sin pagos reales, puedes simularlo.
    // 3. Guardar la orden en tu base de datos (con los productos del carrito, datos de envío, etc.).
    // 4. Vaciar el carrito de la sesión.

    if (/* pago y orden exitosos */ true) { // Reemplaza 'true' con tu lógica real de éxito
        req.session.cart = []; // Vaciar el carrito
        req.flash('success_msg', '¡Tu compra ha sido confirmada con éxito!');
        res.redirect('/pedidoconfirmado'); // Redirige a una página de confirmación
    } else {
        req.flash('error_msg', 'Hubo un error al procesar tu pago. Inténtalo de nuevo.');
        res.redirect('/formapago'); // Vuelve a la página de pago con el error
    }
});
// **********************************************

// Esta ruta recibe el formulario POST de "Comprar"
app.post('/agregar-al-carrito', (req, res) => {
    const { nombre, precio, imagen } = req.body;

    // Inicializa el carrito en la sesión si no existe
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Agrega el producto al carrito
    req.session.cart.push({
        nombre,
        precio: parseFloat(precio),
        imagen,
        cantidad: 1
    });

    req.flash('success_msg', `${nombre} ha sido añadido al carrito.`);
    // ¡¡¡LUEGO DE PROCESAR, REDIRIGE A LA PÁGINA DEL CARRITO (GET /carrocompra)!!!
    res.redirect('/carrocompra');
});

// Esta ruta renderiza la página del carrito
app.get('/carrocompra', (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => {
        total += item.precio * item.cantidad;
    });

    res.render('carrocompra', {
        cart: cart,
        total: total,
        user: req.session.user
    });
});

// Rutas para vaciar y eliminar del carrito
app.post('/vaciar-carrito', (req, res) => {
    req.session.cart = [];
    req.flash('success_msg', 'El carrito ha sido vaciado.');
    res.redirect('/carrocompra');
});

app.post('/eliminar-del-carrito', (req, res) => {
    const { index } = req.body;
    if (req.session.cart && req.session.cart[index]) {
        const removedItem = req.session.cart.splice(index, 1);
        req.flash('success_msg', `${removedItem[0].nombre} ha sido eliminado del carrito.`);
    } else {
        req.flash('error_msg', 'No se pudo eliminar el producto del carrito.');
    }
    res.redirect('/carrocompra');
});


// ... (resto de tus rutas como /formapago, /pedidoconfirmado, /registrodatos) ...

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La maison des fleurs está en línea ahora http://localhost:${port}`);
});