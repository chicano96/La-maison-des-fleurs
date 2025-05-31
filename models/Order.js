const mongoose = require('mongoose');

// Define productSchema si es un documento incrustado dentro de Order
const productSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    cantidad: Number,
    // Puedes añadir más campos como id del producto si vienen de otra colección
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Hace referencia al modelo 'User'
        required: true
    },
    productos: [productSchema], // Un array de productos comprados
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;