const db = require("../dataAccess/db");

class UserService {

    async login(email, password) {
        try {
            const [user] = await db.execute(
                `SELECT user_id, username, role FROM Users WHERE email = ? AND password_hash = ?`,
                [email, password]
            );
            /*
            Para cuando bycrypt
            const [user] = await db.execute(
                `SELECT user_id, username, role, password_hash FROM Users WHERE username = ?`,
                [username]
            );
            */
            //console.log( await this.userExists(username));
            if ( await this.userExists(email) === true && user.length === 0) {
                return { message: `Wrong Password.` };
            }

            /*
            Para cuando se use bcrypt
            const isPasswordValid = await bcrypt.compare(password, user[0].password_hash);
            if (!isPasswordValid) {
                return { message: `Wrong Password.` };
            }
            */

            if (user.length === 0) {
                return { message: `User not found.` };
            }
            
            /*Para cuando se use bcrypt
            const { password_hash, ...userWithoutPassword } = user[0];
            return userWithoutPassword;
            */
           //console.log("SQL result:", user);
           //console.log("SQL result:", user[0]);

            return user[0];
        } catch (error) {
            return { error: "Error logging in" + error.message };
        }
    }

    async userExists(email) {
        try {
            const [user] = await db.execute(
                `SELECT user_id FROM Users WHERE email = ?`,
                [email]
            );

            if (user.length === 0) {
                console.log(`User not found.`);
                return false;
            }
            //console.log(`User found.`);         
            return true;
        } catch (error) {
           return false;
        }
    }

    async getTeachers() {
        try {
            const [teachers] = await db.execute(
                `SELECT user_id, username FROM Users WHERE role = 'teacher'`
            );

            if (teachers.length === 0) {
                console.log(`No teachers found.`);
                return { message: `No teachers found.` };
            }
            
            return teachers;
        } catch (error) {
            console.error("Error fetching teachers:", error);
            return { error: "Error fetching teachers." };
        }
    }

    async getStudents() {
        try {
            const [students] = await db.execute(
                `SELECT user_id, username FROM Users WHERE role = 'student'`
            );

            if (students.length === 0) {
                console.log(`No students found.`);
                return { message: `No students found.` };
            }
            
            return students;
        } catch (error) {
            console.error("Error fetching students:", error);
            return { error: "Error fetching students." };
        }
    }

    async getUserById(userId) {
        try {
            const query = 'SELECT username FROM Users WHERE user_id = ?';
            const [rows] = await db.execute(query, [userId]);
            return rows[0]; // Devuelve el primer resultado
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            throw error;
        }
    }

}

module.exports = UserService;
