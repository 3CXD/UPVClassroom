const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const routerApi = require("./routes");

const EnrollmentService = require("./services/EnrollmentService");
const UserService = require("./services/UserService");
const ClassService = require("./services/ClassService");

const salt = 10;
const app = express();
const PORT = 3001;
const saltRounds = 10;

app.use(cookieParser());
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.get("/", (req, res) => {
    console.log("ejecutando el handing del root app");
    res.send("Hola desde Express");
});

// LOGEARSE
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Email:", email, "Password:", password);

    try {
        const userService = new UserService();
        const user = await userService.login(email, password);
        console.log(user.error);

        if (user.message === "User not found.") {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.message === "Wrong Password.") {
            return res.status(401).json({ error: "Wrong Password." });
        }

        const token = jwt.sign(
            { id: user.user_id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token);
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).send("Error logging in: " + error.message);
        console.log(error.message);
        console.log("JWT Secret:", process.env.JWT_SECRET);
    }
});

// DESLOGEARSE
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
});

routerApi(app);

app.get('/cursosprofesor', async (req, res) => {
    const userId = req.query.userId;
    try {
        const classService = new ClassService();
        const userService = new UserService();

        const classes = await classService.getTeacherClasses(userId);
        const user = await userService.getUserById(userId);
        const profesor = user?.username || 'Profesor desconocido';

        res.status(200).json({ cursos: classes, profesor });
    } catch (error) {
        console.error('Error al obtener las clases:', error);
        res.status(500).json({ error: 'Error al obtener las clases' });
    }
});

app.post('/cursosprofesor/crearclase', async (req, res) => {
    const { class_name, class_description, academic_program, group_code, semester, teacher_id } = req.body;
    console.log("Datos recibidos para crear clase:", req.body);
    try {
        const classService = new ClassService();
        const result = await classService.createClass(
            class_name,
            academic_program,
            group_code,
            semester,
            class_description,
            teacher_id
        );
        console.log(result);
        res.status(200).json({ message: "Clase creada con éxito", result });
    } catch (error) {
        console.error('Error al crear la clase:', error);
        res.status(500).json({ error: 'Error al crear la clase' });
    }
});

app.listen(PORT, () => {
    console.log("Aplicación Express corriendo...");
});