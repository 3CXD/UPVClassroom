const bcrypt = require('bcrypt');
const db = require('../dataAccess/db'); // Asegúrate de que db.js esté configurado para conectar a MySQL

const registerUser = async (req, res) => {
    try {
        const { nombre, apellidos, username, password } = req.body;

        // Validar datos obligatorios
        if (!nombre || !username || !password) {
            return res.status(400).json({ message: "Nombre, usuario y contraseña son obligatorios." });
        }

        // Verificar si el usuario ya existe
        const [existingUser] = await db.query("SELECT id FROM usuarios WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "El nombre de usuario ya está en uso." });
        }

        // Cifrar la contraseña con bcrypt
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el nuevo usuario
        await db.query(
            "INSERT INTO usuarios (username, password, nombre, apellidos, tipo_usuario, activo) VALUES (?, ?, ?, ?, 'user', 1)",
            [username, hashedPassword, nombre, apellidos || null]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
        console.error("Error en registerUser:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

module.exports = { registerUser };
