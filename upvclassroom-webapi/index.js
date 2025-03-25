const express = require("express");
//const cors = require("cors");

const EnrollmentService = require("./services/EnrollmentService");
const UserService = require("./services/UserService");
const ClassService = require("./services/ClassService");

const app = express();
const PORT = 3002;

app.use(express.json())

app.get("/", (req, res) =>{
    console.log("ejecutando el handing del root app");
    res.send("Hola desde Express")
});

//TODO: IMPLEMENTAR getEnrolledStudents BASED ON THE CLASS ID

app.get("/enrolled/:classId", async (req, res) =>{
    try {
        const classId = req.params.classId;
        const enrollmentService = new EnrollmentService();
        const students = await enrollmentService.getEnrolledStudents(classId);
        res.json(students);
    } catch (error) {
        console.error("Error fetching enrolled students:", error);
        res.status(500).send("Error fetching enrolled students" + error.message);
    }
});

app.get("/teachers", async (req, res) =>{
    try {
        const userService = new UserService();
        const teachers = await userService.getTeachers();
        res.json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).send("Error fetching teachers" + error.message);
    }
});

app.get("/students", async (req, res) =>{
    try {
        const userService = new UserService();
        const students = await userService.getStudents();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send("Error fetching students" + error.message);
    }
});

app.get("/classes", async (req, res) =>{
    try {
        const classService = new ClassService();
        const classes = await classService.getClasses();
        res.json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).send("Error fetching classes" + error.message);
    }
});

app.get("/classes/:teacherId", async (req, res) =>{
    try {
        const teacherId = req.params.teacherId;
        const classService = new ClassService();
        const classes = await classService.getTeacherClasses(teacherId);
        res.json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).send("Error fetching classes" + error.message);
    }
});

app.post("/createclass", async (req, res) => {
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

app.listen(PORT, () =>{
    console.log("Aplicación Express corriendo...");
});