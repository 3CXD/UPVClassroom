const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const routerApi = require("./routes"); //TODO: CREAR RUTAS POR FIXEADAS

const EnrollmentService = require("./services/EnrollmentService");
const UserService = require("./services/UserService");
const ClassService = require("./services/ClassService");

const app = express();
const PORT = 3001;
const saltRounds = 10;

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true}
));

app.get("/", (req, res) =>{
    console.log("ejecutando el handing del root app");
    res.send("Hola desde Express")
});


//LOGEARSE
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Email:", email,"Passowrd:", password);

    try {
        const userService = new UserService();
        const user = await userService.login(email, password);

        if (user.error) {
            return res.status(500).json({ error: user.error });
        }

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
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).send("Error logging in: " + error.message);
    }
});

//DESLOGEARSE
app.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT token cookie
    return res.status(200).json({ message: 'Logout successful' });
});

routerApi(app);

app.listen(PORT, () =>{
    console.log("Aplicación Express corriendo...");
});