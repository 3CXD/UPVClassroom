const express = require("express");
const UserService = require("../services/UserService");

const router = express.Router();

//TODAS LAS DE AQUI EMPIEZAN CON /user/

router.get("/students", async (req, res) => {
  const search = req.query.search || '';

  try {
    const userService = new UserService();
    const students = await userService.getStudents(search);
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Error fetching students: " + error.message);
  }
});

router.post("/create", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userService = new UserService();
    const result = await userService.createUser(username, email, password, role);
    res.json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user: " + error.message);
  }
});

module.exports = router;