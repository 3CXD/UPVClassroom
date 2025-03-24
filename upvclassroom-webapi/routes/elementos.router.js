const express = require("express");

const router = express.Router();

router.post("/", (req, res)=>{
    const reqObj = req.body;
    const resObj = {
        message: "Elemento guardado correctamente",
        data: reqObj
    };
    res.json(resObj);
});

router.get("/:id", (req, res)=>{
    const {id} = req.params;
    const resObj = {
        id,
        nombre: `Elemento ${id}`,
        descripcion: `Descripción del elemento ${id}`
    };
    res.json(resObj);
});

module.exports = router;