const express = require("express");
//const cors = require("cors");

const app = express();
const PORT = 3002;


app.get("/", (req, res) =>{
    console.log("ejecutando el handing del root app");
    res.send("Hola desde Express")
});

