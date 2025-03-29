const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
require("dotenv").config();

const EnrollmentService = require("./services/EnrollmentService");
const UserService = require("./services/UserService");
const ClassService = require("./services/ClassService");

const salt = 10;
const app = express();
const PORT = 3001;
const saltRounds = 10;

app.use(cookieParser());
dotenv.config();
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true}
));

///////////////////////// GET ///////////////////////// 

app.get("/", (req, res) =>{
    console.log("ejecutando el handing del root app");
    res.send("Hola desde Express")
});

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

///////////////////////// POST ///////////////////////// 

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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Email:", email,"Passowrd:", password);

    try {
        const userService = new UserService();
        const user = await userService.login(email, password);
        console.log(user.error);

        /*if (user.error) {
            return res.status(500).json({ error: user.error });
        }*/

        if (user.message === "User not found.") {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.message === "Wrong Password.") {
            return res.status(401).json({ error: "Wrong Password." });
        }

        const token = jwt.sign(
            { id: user.user_id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2m" }
        );

        res.cookie("token", token);
        console.log("ashuda");
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).send("Error logging in: " + error.message);
        console.log(error.message);
        console.log("JWT Secret:", process.env.JWT_SECRET);

    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT token cookie
    return res.status(200).json({ message: 'Logout successful' });
});

app.listen(PORT, () =>{
    console.log("Aplicación Express corriendo...");
});