const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Asegúrate de la ruta correcta a tu modelo User

// Middleware de protección de ruta para asegurar que el usuario esté logeado
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta página.');
    res.redirect('/login');
}

// Ruta GET para mostrar el formulario de registro
router.get('/registro', (req, res) => {
    res.render('registro');
});

// Ruta POST para manejar el registro de nuevos usuarios
router.post('/registro', async (req, res) => {
    const { nombre_completo, correo, password, confirm_password, ciudad, direccion, numero_telefonico } = req.body;

    // Validación básica de que las contraseñas coincidan
    if (password !== confirm_password) {
        req.flash('error_msg', 'Las contraseñas no coinciden.');
        return res.redirect('/registro');
    }

    try {
        // Verificar si el correo ya existe
        let user = await User.findOne({ correo });
        if (user) {
            req.flash('error_msg', 'El correo ya está registrado. Por favor, inicia sesión o usa otro correo.');
            return res.redirect('/login');
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        user = new User({
            nombre_completo,
            correo,
            password: hashedPassword,
            ciudad,
            direccion,
            numero_telefonico
        });

        await user.save(); // Guarda el usuario en la base de datos

        // Establece el mensaje de éxito antes de redirigir
        req.flash('success_msg', '¡Te has registrado con éxito! Ahora puedes iniciar sesión.');
        res.redirect('/login'); // Redirige a la página de login

    } catch (err) {
        console.error(err); // Esto imprimirá el error real en tu terminal del servidor
        req.flash('error_msg', 'Hubo un error al registrarte. Inténtalo de nuevo.');
        res.redirect('/registro');
    }
});

// Ruta GET para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta POST para manejar el inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por correo
        const user = await User.findOne({ correo: email });

        if (!user) {
            req.flash('error_msg', 'Credenciales inválidas.');
            return res.redirect('/login');
        }

        // Comparar la contraseña ingresada con la contraseña hasheada en la BD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash('error_msg', 'Credenciales inválidas.');
            return res.redirect('/login');
        }

        // Si las credenciales son correctas, iniciar sesión
        req.session.user = {
            id: user._id,
            nombre_completo: user.nombre_completo,
            correo: user.correo,
            ciudad: user.ciudad,
            direccion: user.direccion,
            numero_telefonico: user.numero_telefonico
        };

        req.flash('success_msg', `¡Bienvenido, ${user.nombre_completo}!`);
        res.redirect('/perfil'); // Redirige al perfil después de un login exitoso

    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al iniciar sesión.');
        res.redirect('/login');
    }
});

// Ruta para cerrar sesión
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            req.flash('error_msg', 'No se pudo cerrar la sesión.');
            return res.status(500).send('No se pudo cerrar la sesión.');
        }
        req.flash('success_msg', 'Has cerrado sesión correctamente.');
        res.redirect('/login');
    });
});

// **********************************************
// RUTAS PARA EL PERFIL DE USUARIO
// **********************************************

// Ruta GET para mostrar la página de perfil del usuario
router.get('/perfil', ensureAuthenticated, (req, res) => {
    // req.session.user ya contiene los datos actualizados del usuario
    res.render('perfil', { user: req.session.user });
});


// Ruta GET para mostrar el formulario de modificación de perfil
// ¡CAMBIADO: /perfil/modificar!
router.get('/perfil/modificar', ensureAuthenticated, async (req, res) => {
    try {
        // Obtenemos el usuario de la base de datos para asegurarnos de tener los datos más recientes
        const user = await User.findById(req.session.user.id);
        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado.');
            return res.redirect('/perfil');
        }
        // ¡CAMBIADO: renderiza 'modificar-perfil' para que coincida con el nombre de archivo sugerido!
        res.render('modificar-perfil', { user: user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al cargar los datos del perfil para modificar.');
        res.redirect('/perfil');
    }
});

// Ruta POST para manejar la actualización de los datos del perfil
// ¡CAMBIADO: /perfil/modificar!
router.post('/perfil/modificar', ensureAuthenticated, async (req, res) => {
    const { nombre_completo, correo, password, confirm_password, ciudad, direccion, numero_telefonico } = req.body;

    try {
        let user = await User.findById(req.session.user.id);

        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado.');
            return res.redirect('/perfil');
        }

        // Actualizar campos del usuario
        user.nombre_completo = nombre_completo;
        user.ciudad = ciudad;
        user.direccion = direccion;
        user.numero_telefonico = numero_telefonico;
        // El correo no se actualiza aquí porque se marcó como readonly en el formulario EJS
        // Si quieres que el correo sea editable, necesitarías un proceso de verificación adicional.

        // Si se ingresó una nueva contraseña, validarla y hashearla
        if (password) {
            if (password !== confirm_password) {
                // ¡IMPORTANTE: La redirección también se cambia a /perfil/modificar!
                req.flash('error_msg', 'Las nuevas contraseñas no coinciden.');
                return res.redirect('/perfil/modificar');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save(); // Guarda los cambios en la base de datos

        // Actualiza los datos del usuario en la sesión para que reflejen los cambios inmediatamente
        req.session.user = {
            id: user._id,
            nombre_completo: user.nombre_completo,
            correo: user.correo,
            ciudad: user.ciudad,
            direccion: user.direccion,
            numero_telefonico: user.numero_telefonico
        };

        req.flash('success_msg', '¡Perfil actualizado con éxito!');
        res.redirect('/perfil'); // Redirige de vuelta a la página de perfil después de guardar

    } catch (err) {
        console.error(err);
        // ¡IMPORTANTE: La redirección también se cambia a /perfil/modificar!
        req.flash('error_msg', 'Error al actualizar el perfil.');
        res.redirect('/perfil/modificar');
    }
});


module.exports = router;