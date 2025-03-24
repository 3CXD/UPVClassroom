const express = require("express");
const cors = require("cors");

const routerApi = require("./routes");
const requestLogger = require("./middlewares/requestLogger");
const auth = require("./middlewares/auth");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("Middleware para autenticación");
    req.username = "usuario_x";
    next();
});

app.use(requestLogger);
/*
app.use("/", auth);
app.use("/json", auth);
*/
app.use((req, res, next) => {
    try {
        next();
    }
    catch (err) {
        res.status(500).json({mesage: "error"});
    }
    console.log("Este middleware se debería ejecutar al último");
});

app.get("/", (req, res) =>{
    console.log("ejecutando el handing del root app");
    res.send("Hola desde Express")
});

app.get("/json", (req, res) => {
    const resObj = {
        id: 23435,
        nombre: "Nombre del object",
        descripcion: "Descripción del object"
    };
    res.json(resObj);
});

routerApi(app);


app.listen(PORT, () => {
    console.log("Aplicación Express corriendo...");
})