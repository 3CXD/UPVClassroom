import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
const salt = 10;

const app = express();
const PORT = 3001;

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true}
));
app.use(express.json());
app.use(cookieParser());

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

app.get('/cursosalumno',verifyUser, (req, res) => {
    return res.json({Status: "Success", name: req.name});
})

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

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});

})

app.listen(PORT, () => {
    console.log("Aplicación Express corriendo...");
})