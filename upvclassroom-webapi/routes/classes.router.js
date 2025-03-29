const express = require("express");
const ClassService = require("../services/ClassService");

const router = express.Router();

///CLASES DE QUIEN SEA (Necesita el ID)
router.get("/:Id", async (req, res) =>{
    try {
        const Id = req.params.Id;
        const classService = new ClassService();
        const classes = await classService.getClasses(Id);
        res.json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).send("Error fetching classes" + error.message);
    }
});

//CREAR UNA CLASE (Necesita el id del teacher)
router.post("/createclass", async (req, res) => {
    const { className, teacherId, description } = req.body; 

    try {
        const classService = new ClassService();
        const result = await classService.createClass(className, teacherId, description);
        res.json(result);
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).send("Error creating class: " + error.message);
    }
});

module.exports = router;