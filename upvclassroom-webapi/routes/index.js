const express = require("express");
const classesRouter = require("./classes.router");
const userRouter = require("./user.router");
const enrollRouter = require("./enroll.router");
const e = require("express");

function routerApi(app) {

    const router = express.Router();

    app.use("/", router); //quiensabesiseanecesario//TODO:checar esto

    router.use("/classes", classesRouter);
    router.use("/user", userRouter);
    router.use("/enroll", enrollRouter);
    
}

module.exports = routerApi;