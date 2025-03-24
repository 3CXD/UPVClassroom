const bcrypt = require('bcrypt');
const pool = require('../dataAccess/db');

const saltRounds = 12; // Work factor para bcrypt

class UserService {
    static async registerUser(nombre, apellidos, username, password) {
        try {
            // Validar si el usuario ya existe
            const [userExists] = await pool.query(
                'SELECT id FROM usuarios WHERE username = ?', [username]
            );

            if (userExists.length > 0) {
                return { success: false, message: "El username ya existe." };
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insertar usuario en la base de datos
            await pool.query(
                'INSERT INTO usuarios (nombre, apellidos, username, password, tipo_usuario, activo) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, apellidos || null, username, hashedPassword, 'user', 1]
            );

            return { success: true, message: "Usuario registrado exitosamente." };
        } catch (error) {
            console.error(error);
            return { success: false, message: "Error al registrar el usuario." };
        }
    }
}

module.exports = UserService;
