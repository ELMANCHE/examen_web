'use strict';

var Producto = require("../models/productos"); // Importa el modelo de Producto

// Función para crear un producto con validación de rol
function crearProducto(req, res) {
    if (req.usuario.rol !== "admin") {
        return res.status(403).send({ mensaje: "No autorizado. Solo administradores pueden crear productos." });
    }

    var productoReqBody = req.body;
    var nuevoProducto = new Producto();
    nuevoProducto.nombre = productoReqBody.nombre;
    nuevoProducto.descripcion = productoReqBody.descripcion;
    nuevoProducto.precio = productoReqBody.precio;
    nuevoProducto.stock = productoReqBody.stock;

    if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '' ||
        !nuevoProducto.precio || nuevoProducto.precio <= 0 ||
        !nuevoProducto.stock || nuevoProducto.stock < 0) {
        return res.status(400).send({ 'mensaje': 'Uno o más campos requeridos no fueron enviados o son inválidos' });
    }

    nuevoProducto.save().then(
        (productoGuardado) => {
            res.status(200).send({ 'mensaje': 'Producto creado exitosamente', 'producto': productoGuardado });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al crear el producto', 'error': err });
        }
    );
}

// Función para editar un producto
function editarProducto(req, res) {
    var idProducto = req.params._id;
    var nuevosValoresProducto = req.body;

    Producto.findByIdAndUpdate(idProducto, nuevosValoresProducto, { new: true }).then(
        (productoEditado) => {
            if (!productoEditado) {
                return res.status(404).send({ 'mensaje': 'El producto no fue encontrado' });
            }
            res.status(200).send({ 'mensaje': 'Producto editado exitosamente', 'producto': productoEditado });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al editar el producto', 'error': err });
        }
    );
}

// Función para eliminar un producto
function eliminarProducto(req, res) {
    var idProducto = req.params._id;

    Producto.findByIdAndDelete(idProducto).then(
        (productoEliminado) => {
            if (!productoEliminado) {
                return res.status(404).send({ 'mensaje': 'El producto no fue encontrado' });
            }
            res.status(200).send({ 'mensaje': 'Producto eliminado exitosamente', 'producto': productoEliminado });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al eliminar el producto', 'error': err });
        }
    );
}

// Función para buscar un producto por ID
function buscarProductoPorId(req, res) {
    var idProducto = req.params._id;

    Producto.findById(idProducto).then(
        (productoEncontrado) => {
            if (!productoEncontrado) {
                return res.status(404).send({ 'mensaje': 'El producto no fue encontrado' });
            }
            res.status(200).send({ 'producto': productoEncontrado });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al buscar el producto', 'error': err });
        }
    );
}

// Función para buscar todos los productos
function buscarTodosLosProductos(req, res) {
    Producto.find({}).then(
        (productosEncontrados) => {
            res.status(200).send({ 'productos': productosEncontrados });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al buscar los productos', 'error': err });
        }
    );
}

// Función para buscar productos con un precio específico
function buscarProductosConPrecioIgualA(req, res) {
    var precioBuscar = req.params.precio;

    Producto.find({ precio: precioBuscar }).then(
        (productosEncontrados) => {
            res.status(200).send({ 'productos': productosEncontrados });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al buscar los productos', 'error': err });
        }
    );
}

// Función para buscar productos con precio mayor a un valor y nombre que coincida
function buscarProductosConPrecioYNombre(req, res) {
    var precioBuscar = req.params.precio;
    var nombreBuscar = req.params.nombre;

    Producto.find({
        precio: { $gt: precioBuscar },
        nombre: { $regex: nombreBuscar, $options: 'i' } // Búsqueda insensible a mayúsculas/minúsculas
    }).then(
        (productosEncontrados) => {
            res.status(200).send({ 'productos': productosEncontrados });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al buscar los productos', 'error': err });
        }
    );
}

// Función para buscar productos con precio mayor a un valor o nombre que coincida
function buscarProductosConPrecioONombre(req, res) {
    var precioBuscar = req.params.precio;
    var nombreBuscar = req.params.nombre;

    Producto.find({
        $or: [
            { precio: { $gt: precioBuscar } },
            { nombre: { $regex: nombreBuscar, $options: 'i' } } // Búsqueda insensible a mayúsculas/minúsculas
        ]
    }).then(
        (productosEncontrados) => {
            res.status(200).send({ 'productos': productosEncontrados });
        },
        (err) => {
            res.status(500).send({ 'mensaje': 'Ocurrió un error al buscar los productos', 'error': err });
        }
    );
}
//filtro
async function buscarProductosPorFiltro(req, res) {
    try {
        let filtro = {};
        if (req.query.precio) filtro.precio = req.query.precio;
        if (req.query.nombre) filtro.titulo = { $regex: req.query.nombre, $options: 'i' }; // Búsqueda insensible a mayúsculas

        const productos = await Producto.find(filtro);
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar productos", error });
    }
}

// Exportamos las funciones
module.exports = {
    crearProducto,
    editarProducto,
    eliminarProducto,
    buscarProductoPorId,
    buscarTodosLosProductos,
    buscarProductosConPrecioIgualA,
    buscarProductosConPrecioYNombre,
    buscarProductosConPrecioONombre,
    buscarProductosPorFiltro
};
