const express = require("express");
const UserService = require("../services/UserService");

const router = express.Router();

//TODAS LAS DE AQUI EMPIEZAN CON /user/

router.get("/students", async (req, res) => {

    try {
        const userService = new UserService();
        const students = await userService.getStudents();
        res.json(students);
    } catch (error) {
        console.error("Error fetching student classes:", error);
        res.status(500).send("Error fetching student classes: " + error.message);
    }

})



module.exports = router;