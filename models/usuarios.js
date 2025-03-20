'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', false); // Evita advertencias en versiones recientes

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    correo: { type: String, required: true, unique: true, trim: true },
    contrasena: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' }
});

// Middleware para encriptar la contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('contrasena')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.contrasena = await bcrypt.hash(this.contrasena, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Comparar contraseña ingresada con la almacenada en la BD
usuarioSchema.methods.compararContrasena = async function (contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
