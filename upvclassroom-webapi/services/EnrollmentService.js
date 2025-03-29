const db = require("../dataAccess/db");

class EnrollmentService {

    async getEnrolledStudents(classId) {
        //checa si la clase existe
        try {
            const [classExists] = await db.execute(
                `SELECT class_id FROM Classes WHERE class_id = ?`,
                [classId]
            );
    
            if (classExists.length === 0) {
                console.error(`Class with ID ${classId} does not exist.`);
                return { error: `Class with ID ${classId} does not exist.` };
            }
        } catch (error) {
            console.error("Error checking if class exists:", error);
            return { error: "Error checking if class exists." };
        }

        //Si existe, checa si hay estudiantes inscritos
        try {
            const [students] = await db.execute(
                `SELECT user_id, username FROM Users WHERE user_id IN (SELECT student_id FROM Enrollment WHERE class_id = ?)`,
                [classId]
            );

            if (students.length === 0) {
                console.log(`No students are enrolled in class with ID ${classId}.`);
                return { message: `No students are enrolled in class with ID ${classId}.` };
            }
            
            return students;
        } catch (error) {
            console.error("Error fetching enrolled students:", error);
            return { error: "Error fetching enrolled students." };
        }
    }
}

module.exports = EnrollmentService;
