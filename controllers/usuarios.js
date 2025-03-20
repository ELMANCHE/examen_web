'use strict';

// Importamos el modelo de Usuarios y las dependencias necesarias
const Usuario = require('../models/usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Para manejar variables de entorno

const claveSecreta = process.env.JWT_SECRET || "secreto123"; 

// Función para crear un usuario
async function crearUsuario(req, res) {
    try {
        const { correo, contrasena, rol } = req.body;

        // Validar que todos los datos requeridos estén presentes
        if (!correo || !contrasena) {
            return res.status(400).send({ mensaje: 'Correo y contraseña son obligatorios' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).send({ mensaje: 'El correo ya está registrado' });
        }

        // Generar el hash de la contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(contrasena, salt);

        // Crear el nuevo usuario
        const nuevoUsuario = new Usuario({
            correo,
            contrasena: hashedPassword,
            rol: rol || 'usuario' // Por defecto, el rol será "usuario"
        });

        // Guardar el usuario en la base de datos
        await nuevoUsuario.save();

        res.status(201).send({ mensaje: 'Usuario creado exitosamente' });

    } catch (err) {
        res.status(500).send({ mensaje: 'Error al crear el usuario', error: err.message });
    }
}

// Función para iniciar sesión de un usuario
function iniciarSesion(req, res) {
    var parametros = req.body;

    Usuario.findOne({ correo: parametros.correo }).then((usuarioEncontrado) => {
        if (!usuarioEncontrado) {
            console.log("Usuario no encontrado:", parametros.correo);
            return res.status(403).send({ mensaje: 'Usuario no encontrado' });
        }

        console.log("Contraseña ingresada:", parametros.contrasena);
        console.log("Contraseña almacenada (hash):", usuarioEncontrado.contrasena);

        if (bcrypt.compareSync(parametros.contrasena, usuarioEncontrado.contrasena)) {
            console.log("Contraseña correcta, generando token...");
            const token = jwt.sign(
                { id: usuarioEncontrado._id, rol: usuarioEncontrado.rol },
                claveSecreta,
                { expiresIn: '2h' }
            );

            res.status(200).send({ mensaje: 'Inicio de sesión exitoso', token });
        } else {
            console.log("Contraseña incorrecta, no se genera token.");
            res.status(403).send({ mensaje: 'Credenciales inválidas' });
        }
    }).catch((err) => {
        console.error("Error en la búsqueda del usuario:", err);
        res.status(500).send({ mensaje: 'Error al buscar el usuario', error: err });
    });
}


// Exportamos las funciones
module.exports = { crearUsuario, iniciarSesion };
