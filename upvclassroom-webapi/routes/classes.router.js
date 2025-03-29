const express = require("express");
const ClassService = require("../services/ClassService");

const router = express.Router();

//TODAS LAS DE AQUI EMPIEZAN CON /classes/

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
    const { className, teacher_Id, description, progam, semester } = req.body; 
    const teacherId = teacher_Id;
    console.log("Creating class with data:", className, teacherId, description, progam, semester);

    try {
        const classService = new ClassService();
        const result = await classService.createClass(className, teacherId, description, progam, semester);
        if (result.error && result.error === "Failed to create class.") {
            console.log("Failed to create class.");
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).send("Error creating class: " + error.message);
    }
});

module.exports = router;