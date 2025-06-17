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
const Order = require('./models/Order');
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
    res.locals.user = req.session.user || null; // Pasa el usuario a todas las vistas
    res.locals.cart = req.session.cart || [];
    next();
});

// Configura EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de protección de ruta para asegurar que el usuario esté logeado
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta página.');
    res.redirect('/login');
}

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

app.get('/perfil', ensureAuthenticated, (req, res) => { // Asegúrate de proteger la ruta de perfil
    res.render('perfil');
});

// **********************************************
// RUTAS PARA EL CARRITO DE COMPRAS


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
    // 3. Guardar la orden en base de datos (con los productos del carrito, datos de envío, etc.).
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
    // ... (Tu código para agregar al carrito) ...
    const { nombre, precio, imagen } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = req.session.cart.findIndex(item => item.nombre === nombre);

    if (existingItemIndex > -1) {
        // Si existe, incrementa la cantidad
        req.session.cart[existingItemIndex].cantidad += 1;
    } else {
        // Si no existe, añádelo como nuevo producto
        req.session.cart.push({
            nombre,
            precio: parseFloat(precio),
            imagen,
            cantidad: 1
        });
    }
    req.flash('success_msg', `${nombre} ha sido añadido al carrito.`);
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

// --- RUTA PARA MOSTRAR LA FORMA DE PAGO ---
app.get('/formapago', ensureAuthenticated, (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => {
        total += item.precio * item.cantidad;
    });

    if (cart.length === 0) {
        req.flash('error_msg', 'Tu carrito está vacío. No puedes proceder al pago.');
        return res.redirect('/carrocompra');
    }

    res.render('formapago', {
        cart: cart,
        total: total,
        user: req.session.user
    });
});

// --- RUTA PARA PROCESAR EL PAGO Y CREAR LA ORDEN ---
app.post('/procesar-pago', ensureAuthenticated, async (req, res) => {
    const cart = req.session.cart || [];
    const userId = req.session.user.id; // Obtenemos el ID del usuario de la sesión

    if (cart.length === 0) {
        req.flash('error_msg', 'Tu carrito está vacío. No se puede procesar el pago.');
        return res.redirect('/carrocompra');
    }

    let total = 0;
    const productosEnOrden = cart.map(item => {
        total += item.precio * item.cantidad;
        return {
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad
        };
    });

    try {
        const newOrder = new Order({
            userId: userId,
            productos: productosEnOrden,
            total: total,
            estado: 'procesando' 
        });

        await newOrder.save();

        // Vaciar el carrito después de crear la orden
        req.session.cart = [];
        req.flash('success_msg', '¡Tu pedido ha sido confirmado con éxito!');
        res.redirect('/pedidoconfirmado');

    } catch (err) {
        console.error('Error al procesar el pago y crear la orden:', err);
        req.flash('error_msg', 'Hubo un error al procesar tu pago y crear el pedido. Inténtalo de nuevo.');
        res.redirect('/formapago');
    }
});


// Ruta para la confirmación del pedido
app.get('/pedidoconfirmado', ensureAuthenticated, (req, res) => {
    res.render('pedidoconfirmado');
});

// --- RUTA PARA MOSTRAR EL HISTORIAL DE PEDIDOS DEL USUARIO ---
app.get('/perfil/mis-pedidos', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id; 

        // Buscamos todas las órdenes asociadas a este userId, ordenadas por fecha descendente
        // .lean() convierte los documentos de Mongoose a objetos JavaScript planos para un mejor rendimiento
        const orders = await Order.find({ userId: userId }).sort({ fecha: -1 }).lean();

        res.render('mispedidos', {
            orders: orders,
            user: req.session.user 
        });

    } catch (err) {
        console.error('Error al obtener el historial de pedidos:', err);
        req.flash('error_msg', 'Hubo un error al cargar tus pedidos. Inténtalo de nuevo.');
        res.redirect('/perfil'); // Redirige de vuelta al perfil si hay un error
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La maison des fleurs está en línea ahora http://localhost:${port}`);
});
