const express = require("express");
const elementosRouter = require("./elementos.router");
const productosRouter = require("./productos.router");
const tareasRouter = require("./tareas.router");
const accountsRouter = require("./account.router");

function routerApi(app) {
    const router = express.Router();
    app.use("/api/v1/" , router);
    router.use("/elementos", elementosRouter);
    router.use("/productos", productosRouter);
    router.use("/tareas", tareasRouter);
    router.use("/account", accountsRouter);
}

module.exports = routerApi;