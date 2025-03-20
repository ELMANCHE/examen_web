'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarios');
const productoRoutes = require('./routes/productos');

const app = express();
app.use(bodyParser.json());

// Rutas
app.use('/api', usuarioRoutes);
app.use('/api', productoRoutes);

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/desarrolloweb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Base de datos conectada");
    app.listen(6542, () => console.log("Servidor corriendo en http://localhost:6542"));
}).catch(err => console.error("Error al conectar a la base de datos", err));
