LA-MAISON-DES-FLEURS: Tienda Online de Perfumes

👥 Integrantes del Equipo

MATURÍN LAO, CESAR IVAN.
VALENZUELA BENITEZ, JOSE IGNACIO.

Culiacán, Sinaloa, México. Junio de 2025.

📋 Tabla de Contenidos
1.  Introducción
2.  Resumen del Sistema
3.  Requisitos
    * Funcionales y No Funcionales
    * Técnicos
4.  Arquitectura del Sistema
5.  Tecnologías Utilizadas
6.  Estructura del Proyecto
7.  Instalación
    * Prerrequisitos
    * Configuración del Entorno
    * Ejecución del Proyecto
8.  Uso del Sistema
    * Clase CRUD Implementada
    * Flujo de Uso
    * Rutas de la Aplicación Web
9.  Base de Datos (Modelado)
10. Mantenimiento y Actualizaciones
11. Seguridad


1. Introducción

LA-MAISON-DES-FLEURS es un sitio web de venta de perfumes diseñado para ofrecer a los usuarios una experiencia de compra intuitiva y agradable. Ante la creciente demanda de comercio electrónico y la conveniencia de adquirir productos desde la comodidad del hogar, este sistema busca proporcionar una plataforma robusta y segura donde los clientes puedan explorar un catálogo de perfumes, gestionar sus pedidos y mantener un perfil personalizado.

Este documento y el código adjunto corresponden al desarrollo inicial del portal web, incluyendo la autenticación de usuarios y la implementación de funcionalidades CRUD esenciales para la gestión de usuarios y pedidos.

2. Resumen del Sistema

LA-MAISON-DES-FLEURS es una plataforma de comercio electrónico dedicada a la venta de perfumes. Su objetivo principal es facilitar la compra online de fragancias, permitiendo a los usuarios registrarse, explorar productos, añadir artículos al carrito de compra, gestionar sus pedidos y actualizar su información personal. El sistema está diseñado para ser amigable y eficiente, brindando una experiencia de compra fluida.

3. Requisitos

Funcionales y No Funcionales

Requisitos Funcionales:
RF1: Autenticación de Usuarios:
    * RF1.1: El sistema debe permitir a los usuarios registrarse con un nombre de usuario/correo electrónico y contraseña.
    * RF1.2: El sistema debe permitir a los usuarios iniciar sesión con sus credenciales registradas.
    * RF1.3: El sistema debe mantener la sesión del usuario activa mientras navega por las páginas protegidas (ej. carrito de compra, perfil, mis pedidos).
    * RF1.4: El sistema debe permitir a los usuarios cerrar sesión de forma segura.
RF2: Gestión de Usuarios (CRUD):
    * RF2.1: El sistema debe permitir a los usuarios [Crear/Registrar] nuevos perfiles (registro).
    * RF2.2: El sistema debe permitir a los usuarios [Leer/Ver] su información de perfil.
    * RF2.3: El sistema debe permitir a los usuarios [Actualizar/Modificar] su información de perfil (ej. datos personales, dirección).
RF3: Gestión de Pedidos (CRUD):
    * RF3.1: El sistema debe permitir a los usuarios [Crear/Realizar] nuevos pedidos.
    * RF3.2: El sistema debe permitir a los usuarios [Leer/Ver] el historial de sus pedidos.
RF4: Navegación y Catálogo:
    * RF4.1: El sistema debe permitir a los usuarios explorar un catálogo de perfumes por categorías (ej. caballero, dama).
    * RF4.2: El sistema debe permitir añadir productos al carrito de compra.
RF5: Interfaz de Usuario:
    * RF5.1: La interfaz del portal web debe ser intuitiva y fácil de usar.
    * RF5.2: El sistema debe mostrar mensajes claros de éxito o error al usuario (notificaciones flash).

Requisitos No Funcionales
RNF1: Usabilidad:
    * RNF1.1: La interfaz de usuario debe ser responsiva y adaptarse correctamente a diferentes tamaños de pantalla (escritorio, tabletas, móviles).
    * RNF1.2: El flujo de registro e inicio de sesión, así como el proceso de compra, debe ser directo y sin pasos innecesarios.
RNF2: Rendimiento:
    * RNF2.1: El tiempo de respuesta de las operaciones principales (login, registro, visualización de productos, añadir al carrito) no debe exceder los 3 segundos.
RNF3: Seguridad:
    * RNF3.1: Las contraseñas de los usuarios deben ser almacenadas de forma segura (encriptadas).
    * RNF3.2: Las sesiones de usuario deben ser gestionadas de forma segura.
    * RNF3.3: Los datos sensibles de los usuarios (ej. información de pago, aunque no completamente implementada en esta fase) deben ser protegidos.
RNF4: Mantenibilidad:
    * RNF4.1: El código debe estar organizado y comentado para facilitar su comprensión y futuras modificaciones.



Técnicos

Entorno de Desarrollo: Node.js.
Gestor de Paquetes: npm.
Base de Datos: MongoDB.
Navegador Web: Compatible con los navegadores modernos (Chrome, Firefox, Edge, Safari).

 4. Arquitectura del Sistema

El sistema LA-MAISON-DES-FLEURS sigue una arquitectura **Cliente-Servidor en Capas**, diseñada para ser modular, escalable y fácil de mantener. Se compone principalmente de un portal web, un servidor backend y una base de datos.

Componentes Principales:
Portal Web: Representa la interfaz de usuario a través de la cual los clientes interactúan con el sistema para explorar productos y realizar compras.
Servidor Backend: El corazón de la aplicación, implementado con Node.js y Express.js, encargado de la lógica de negocio, procesamiento de solicitudes, gestión de autenticación, control de stock (futuro) y comunicación con la base de datos.
Base de Datos (MongoDB): Almacena de forma persistente toda la información del sistema, como datos de usuarios, productos, pedidos, etc.
API REST: El canal de comunicación estandarizado que permite la interacción entre el cliente (portal web) y el servidor backend.

Esta arquitectura fue elegida por su **modularidad**, **facilidad de mantenimiento** y **escalabilidad**, permitiendo que los componentes funcionen de forma independiente y facilitando futuras mejoras y adaptaciones.

5. Tecnologías Utilizadas

Frontend (Portal Web)

HTML5: Estructura de la página web.
CSS3: Estilos y diseño responsivo.
EJS (Embedded JavaScript): Motor de plantillas para renderizar vistas dinámicas desde el servidor.
JavaScript : Lógica del lado del cliente para interactividad (ej. mostrar/ocultar contraseña, validaciones básicas de formularios).

Backend (Parte del servidor para este proyecto)

Node.js: Entorno de ejecución JavaScript del lado del servidor.
Express.js: Framework web para Node.js, utilizado para construir la API y gestionar rutas.
express-session: Middleware para manejar sesiones de usuario.
connect-flash: Middleware para mensajes flash (notificaciones temporales).
Passport & passport-local:** Módulos para autenticación de usuarios (estrategia local con usuario y contraseña).
bcryptjs: Librería para cifrado de contraseñas (hashing).
Mongoose: Librería para modelado de objetos MongoDB en Node.js, facilitando la interacción con la base de datos.

Base de Datos

MongoDB: Base de datos NoSQL orientada a documentos.



6. Estructura del Proyecto

├── .vscode/ # Configuraciones de Visual Studio Code
├── Models/ # Definición de esquemas y modelos de Mongoose
│ ├── Order.js # Esquema y modelo para pedidos
│ └── User.js # Esquema y modelo para usuarios
├── node_modules/ # Dependencias de Node.js instaladas
├── public/ # Archivos estáticos (CSS, JS del cliente, imágenes)
│ ├── css/
│ │ └── style.css # Estilos globales
│ ├── images/
├── routes/ # Archivos de definición de rutas de Express.js
├── views/ # Archivos de plantillas EJS para las vistas
│ ├── partials/ # Archivos parciales reutilizables (ej. cabecera, pie de página)
│ ├── bienvenida.ejs # Página de bienvenida después de login
│ ├── caballero.ejs # Página de productos para caballero
│ ├── carrocompra.ejs # Página del carrito de compras
│ ├── dama.ejs # Página de productos para dama
│ ├── formapago.ejs # Página de selección de forma de pago
│ ├── inicio.ejs # Página de inicio/landing page
│ ├── login.ejs # Página de inicio de sesión
│ ├── mispedidos.ejs # Página para ver el historial de pedidos del usuario
│ ├── modificar-perfil.ejs # Página para modificar el perfil del usuario
│ ├── pedidoconfirmado.ejs # Página de confirmación de pedido
│ ├── perfil.ejs # Página de perfil del usuario
│ └── registro.ejs # Página de registro de usuarios
├── package-lock.json # Bloqueo de versiones de dependencias
├── package.json # Metadatos del proyecto y dependencias
├── README.md # Este archivo
└── server.js # Archivo principal de la aplicación Node.js

7. Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

Prerrequisitos

Asegúrate de tener instalado lo siguiente:
Node.js (versión 14 o superior recomendada)
Npm (viene con Node.js)
MongoDB Server

Configuración del Entorno

1.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    ```

2.  Configura tu base de datos MongoDB:
    Asegúrate de que tu servidor MongoDB esté corriendo.
CMD escribimos mongod

Ejecución del Proyecto

1.  Inicia el servidor MongoDB.

2.  Ejecuta la aplicación Node.js:
    ```bash
    npm start
    ```
    o si no tienes `npm start` configurado en `package.json` (asegúrate de que tu `server.js` sea el script principal):
    ```bash
    node server.js
    ```

3.  Accede a la aplicación: Abre tu navegador web y navega a `http://localhost:3000` (o el puerto que hayas configurado en `server.js`).

8. Uso del Sistema

Clase CRUD Implementada

La funcionalidad CRUD principal implementada en este proyecto se centra en:
* **Usuarios:** Permite **Crear** (registro), **Leer** (ver perfil), y **Actualizar** (modificar perfil) la información de los usuarios.
* **Pedidos:** Permite **Crear** (realizar un nuevo pedido) y **Leer** (ver el historial de pedidos) para los usuarios.

Flujo de Uso

1.  Registro: Los nuevos usuarios pueden registrarse proporcionando la información requerida.
2.  Inicio de Sesión: Los usuarios registrados pueden iniciar sesión para acceder a las funcionalidades del sitio.
3.  Exploración Navegar por el catálogo de perfumes (dama, caballero).
4.  Carrito de Compras: Añadir productos al carrito.
5.  Proceso de Pago: Proceder al checkout y seleccionar la forma de pago (simplificado para esta fase).
6.  Mis Pedidos: Ver un historial de los pedidos realizados.
7.  Perfil: Ver y modificar la información personal del usuario.
8.  Cerrar Sesión: Salir de la sesión de forma segura.

Rutas de la Aplicación Web

`/`: Página de inicio (puede redirigir a `/login` o `/inicio` si hay sesión).
`/login`: Página de inicio de sesión.
`/registro`: Página de registro de nuevos usuarios.
`/logout`: Cierra la sesión del usuario.
`/bienvenida`: Página de bienvenida post-login.
`/inicio`: Página principal del sitio web.
`/caballero`: Muestra el catálogo de perfumes para caballero.
`/dama`: Muestra el catálogo de perfumes para dama.
`/carrocompra`: Muestra el contenido del carrito de compras.
`/formapago`: Página para seleccionar la forma de pago.
`/mispedidos`: Historial de pedidos del usuario.
`/modificar-perfil`: Página para actualizar la información del perfil.
`/pedidoconfirmado`: Página de confirmación de un pedido exitoso.
`/perfil`: Muestra la información del perfil del usuario.

9. Base de Datos (Modelado)

El sistema utiliza MongoDB para el almacenamiento de datos. A continuación, se describen los modelos principales:

User (Usuario):
    * Representa a un cliente del sitio web.
    * Campos principales: `nombre`, `apellido`, `email` (único), `password` (encriptado), `direccion`, `telefono`.
    * Este modelo está en `Models/User.js`.

Order (Pedido):
    * Representa un pedido realizado por un usuario.
    * Campos principales: `userId` (referencia al usuario), `fechaPedido`, `estado` (ej. 'pendiente', 'enviado', 'entregado'), `total`, `items` (array de productos en el pedido, con cantidad y precio), `direccionEnvio`.
    * Este modelo está en `Models/Order.js`.

*(Podrías considerar un modelo `Product` si aún no lo tienes para el catálogo de perfumes, con campos como `nombre`, `descripcion`, `precio`, `categoria`, `imagen`, `stock`.)*

10. Mantenimiento y Actualizaciones

El código está estructurado para facilitar la incorporación de nuevas funcionalidades y el mantenimiento.
Las dependencias se gestionan a través de `package.json` y `package-lock.json`, lo que simplifica las actualizaciones.
Se recomienda seguir buenas prácticas de codificación y documentación para futuras expansiones.

11. Seguridad

Las contraseñas de los usuarios se almacenan utilizando `bcryptjs` para asegurar que no se guarden en texto plano.
 La gestión de sesiones se realiza a través de `express-session` y `passport`, implementando prácticas seguras de autenticación.
Es crucial seguir implementando medidas de seguridad adicionales, como validación de entrada de datos, protección contra ataques XSS y CSRF en futuras fases.


