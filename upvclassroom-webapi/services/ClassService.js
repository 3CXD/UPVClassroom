const db = require("../dataAccess/db");

class ClassService {

    async createClass(className, teacherId, description = null) {
        try {
            const [result] = await db.execute(
                `INSERT INTO Classes (class_name, teacher_id, description) VALUES (?, ?, ?)`,
                [className, teacherId, description]
            );
            console.log(`Inserted class with ID: ${result.insertId}`);
            return { class_id: result.insertId, class_name: className, description };
        } catch (error) {
            console.error("Error creating class:", error);
            return { error: "Error creating class." };
        }
    }

    async getClasses() {
        try {
            const [classes] = await db.execute(
                `SELECT class_id, class_name FROM Classes`
            );

            if (classes.length === 0) {
                console.log(`No classes found.`);
                return { message: `No classes found.` };
            }
            
            return classes;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return { error: "Error fetching classes." };
        }
    }

    async getTeacherClasses(teacherId) {
        try {
            const [classes] = await db.execute(
                `SELECT class_id, class_name FROM Classes WHERE teacher_id = ?`,
                [teacherId]
            );

            if (classes.length === 0) {
                console.log(`No classes found for teacher with ID ${teacherId}.`);
                return { message: `No classes found for teacher with ID ${teacherId}.` };
            }
            
            return classes;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return { error: "Error fetching classes." };
        }
    }

}

module.exports = ClassService;