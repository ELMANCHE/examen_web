'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
require('dotenv').config();

const router = express.Router();

// Registra un nuevo usuario con correo, contraseña (hash) y rol
router.post('/registro', async (req, res) => {
    const { correo, contrasena, rol = 'usuario' } = req.body;

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const nuevoUsuario = new Usuario({ correo, contrasena: hashedPassword, rol });

        // Guardar usuario en la base de datos
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

//Inicia sesión con correo y contraseña, devolviendo un token JWT
//access Público
 
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        // Validar credenciales
        if (!usuario || !await bcrypt.compare(contrasena, usuario.contrasena)) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar token
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET || '@martina2190', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
