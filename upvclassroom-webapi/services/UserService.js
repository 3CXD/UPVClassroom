const db = require("../dataAccess/db");

class UserService {

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


}

module.exports = UserService;