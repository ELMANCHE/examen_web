'use strict';

const express = require('express');
const Producto = require('../models/productos');
const { validarToken, verificarAdmin } = require('../helpers/auth');
const productoController = require('../controllers/productos');

const router = express.Router();

// Obtener todos los productos (Disponible para todos)
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Crear un producto (Solo administradores)
router.post('/productos', validarToken, verificarAdmin, async (req, res) => {
    const { titulo, descripcion, precio } = req.body;
    if (!titulo || !descripcion || !precio) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoProducto = new Producto({ titulo, descripcion, precio });

    try {
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

module.exports = router;
