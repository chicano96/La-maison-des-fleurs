const mongoose = require('mongoose');

// Define productSchema si es un documento incrustado dentro de Order
const productSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    cantidad: Number,
    // Aca podemos añadir más campos como id del producto si vienen de otra colección
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productos: [productSchema], 
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
