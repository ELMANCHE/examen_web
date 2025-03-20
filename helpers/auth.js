'use strict';

// Importamos las dependencias necesarias
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

const claveSecreta = process.env.JWT_SECRET || '@martina2190'; // Clave secreta para firmar el token


function generarToken(usuario) {
    const contenido = {
        sub: usuario._id, // ID del usuario
        correo: usuario.correo, // Correo del usuario
        rol: usuario.rol, // Agregar rol para validaciones posteriores
        iat: moment().unix(), // Fecha de emisión
        exp: moment().add(10, 'minutes').unix() // Expira en 10 minutos
    };
    return jwt.sign(contenido, claveSecreta, { algorithm: 'HS256' }); // Algoritmo seguro
}

//Middleware para validar un token JWT
function validarToken(req, res, next) {
    const tokenUsuario = req.headers["authorization"];
    if (!tokenUsuario) {
        return res.status(403).json({ mensaje: "Token requerido" });
    }

    try {
        const tokenLimpio = tokenUsuario.replace('Bearer ', ''); // Eliminamos "Bearer " si está presente
        const contenido = jwt.verify(tokenLimpio, claveSecreta);
        req.usuario = contenido; // Guardamos la información del usuario en la petición
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
}

// Middleware para verificar si el usuario es administrador
function verificarAdmin(req, res, next) {
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: "Acceso denegado, se requiere rol de administrador" });
    }
    next();
}

// Exportamos las funciones
module.exports = { generarToken, validarToken, verificarAdmin };
