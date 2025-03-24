const express = require("express");
const TareasService = require("../services/TareasService");

const router = express.Router();

router.get("/", async (req, res) =>{
    const tareasService = new TareasService();
    res.json(await tareasService.obtenerTodas());
});

router.post("/", async (req, res) => {
    const tareasService = new TareasService();
    const tarea = req.body;
    // TODO: Validar datos de la tarea
    const idTarea = await tareasService.guardarNueva(tarea);
    res.status(201).json({message: "Tarea creada exitosamente", idTarea});
});

module.exports = router;
