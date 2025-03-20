'use strict';

var express = require('express');
var bodyParser = require('body-parser');

// Importamos las rutas actualizadas
var rutasProducto = require('./routes/productos'); // Rutas para productos
var rutasUsuario = require('./routes/usuarios'); // Rutas para usuarios

var aplicacion = express();

// Middleware para procesar JSON y datos codificados en URL
aplicacion.use(bodyParser.json());
aplicacion.use(bodyParser.urlencoded({ extended: false }));

// Usamos las rutas actualizadas
aplicacion.use(rutasProducto); // Rutas para productos
aplicacion.use(rutasUsuario); // Rutas para usuarios

module.exports = aplicacion;

