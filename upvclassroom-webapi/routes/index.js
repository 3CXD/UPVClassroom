const express = require("express");
const classesRouter = require("./classes.router");

function routerApi(app) {

    const router = express.Router();

    app.use("/", router); //quiensabesiseanecesario//TODO:checar esto

    router.use("/classes", classesRouter);
    
}

module.exports = routerApi;