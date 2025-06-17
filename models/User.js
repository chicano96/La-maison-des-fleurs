const mongoose = require('mongoose');

// --- Esquema y Modelo de Usuario ---
const userSchema = new mongoose.Schema({
    nombre_completo: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true // Asegura que el correo sea único
    },
    password: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    numero_telefonico: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 
