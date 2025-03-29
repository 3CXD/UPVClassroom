import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import EnrollmentService from './services/EnrollmentService.js';
import UserService from './services/UserService.js';
import ClassService from './services/ClassService.js';

const salt = 10;
const app = express();
const PORT = 3001;
//const EnrollmentService = require("./services/EnrollmentService");
//const UserService = require("./services/UserService");
//const ClassService = require("./services/ClassService");
//const e = require("express");
//const express = require("express");
//const cors = require("cors");
const saltRounds = 10;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'upvclassroom',
    "port": 3306,
    "waitForConnections": true,
    "connectionLimit": 64,
    "queueLimit": 0
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "You are not authenticated"})
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "Token is not ok"});
            } else {
                req.name = decoded.name;
                next();
            }
        })
    }
}


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true}
));

//app.use(cors)

// (CESAR) Muestra las clases del estudiante loggeado
app.get('/cursosalumno',verifyUser, (req, res) => {
    return res.json({Status: "Success", name: req.name});
})

// (CESAR) REgistra un nuevo usuario en la base de datos
app.post('/register', (req, res) => {
    const sql = "Insert INTO Users (username, email, password_hash) values (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error for hasshing password"})
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) => {
            if(err) return res.json({Error: "Inserting data Error in server"});
            return res.json({Status: "Success"});
        })
    })
})

// (WALLE) Obtiene los estudientes de una clase
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

// (WALLE) Obtiene los profesores
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

// (WALLE) Obtiene todos los estudiantes
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

// (WALLE) Ver las clases que tiene el alumno
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

// (WALLE) Obtiene el profesor de una clase
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

// (WALLE) Crear una clase nueva
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

// (CESAR) Login de usuario, falta verificar qué rol tiene
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM Users WHERE email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if(err ) return res.json({Error: "Login error in server"});
        if(data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password_hash, (err, response) => {
                if(err) return res.json({Error: "Password compare error"});
                if(response){
                    const name = data[0].username;
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '2m'});
                    res.cookie('token', token);
                    return res.json({Status: "Success"});
                } else {
                    return res.json({Error: "Password not matched"});
                }
            })
        }else {
            return res.json({Error: "No email existed"});
        }
    })
})

// (CESAR) Manejar el logout del usuario
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});

})

// (CESAR) Comprobar si la eplicación está corriendo
app.listen(PORT, () =>{
    console.log("Aplicación Express corriendo...");
});