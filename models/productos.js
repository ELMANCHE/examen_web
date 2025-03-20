'use strict';

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    titulo: { type: String, required: true }, // Título del producto (obligatorio)
    descripcion: { type: String, required: true }, // Descripción del producto (obligatoria)
    precio: { 
        type: Number, 
        required: true, 
        min: [0, 'El precio no puede ser negativo'] 
    }, // Precio del producto (obligatorio y no puede ser negativo)
    stock: { 
        type: Number, 
        required: true, 
        min: [0, 'El stock no puede ser negativo'] 
    }, // Cantidad disponible en inventario (obligatorio)
    imagen: { type: String }, // URL de la imagen del producto (opcional)
    categoria: { type: String } // Categoría del producto (opcional)
});

// Exportamos el modelo de Producto
module.exports = mongoose.model('Producto', productoSchema);
