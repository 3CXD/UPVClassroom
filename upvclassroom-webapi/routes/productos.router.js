const express = require("express");

const router = express.Router();

const productos = [
    {id: 1, nombre: "Proyecto 1"},
    {id: 2, nombre: "Proyecto 2"},
    {id: 3, nombre: "Proyecto 3"},
    {id: 4, nombre: "Proyecto 4"}
];

router.get("/", (req, res) => {
    const resObj = {
        message: "Listado de productos obtenido exitosamente",
        data: productos
    };
    res.json(resObj);
});

module.exports = router;