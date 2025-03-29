const db = require("../dataAccess/db");

class EnrollmentService {
    async enrollStudent(studentId, classId) {
        try {
            const [classExists] = await db.execute(
                `SELECT class_id FROM Classes WHERE class_id = ?`,
                [classId]
            );
            if (classExists.length === 0) {
                console.error(`Class with ID ${classId} does not exist.`);
                return { error: `Class with ID ${classId} does not exist.` };
            }

            const [studentExists] = await db.execute(
                `SELECT user_id FROM Users WHERE user_id = ? AND role = 'student'`,
                [studentId]
            );
            if (studentExists.length === 0) {
                console.error(`Student with ID ${studentId} does not exist.`);
                return { error: `Student with ID ${studentId} does not exist.` };
            }

            const [enrollmentExists] = await db.execute(
                `SELECT * FROM Enrollment WHERE class_id = ? AND student_id = ?`,
                [classId, studentId]
            );
            if (enrollmentExists.length > 0) {
                console.error(`Student with ID ${studentId} is already enrolled in class with ID ${classId}.`);
                return { error: `Student with ID ${studentId} is already enrolled in class with ID ${classId}.` };
            }

            const [result] = await db.execute(
                `INSERT INTO Enrollment (class_id, student_id) VALUES (?, ?)`,
                [classId, studentId]
            );

            console.log(`Student with ID ${studentId} enrolled in class with ID ${classId}.`);
            return { message: `Student with ID ${studentId} successfully enrolled in class with ID ${classId}.` };
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                console.error(`Student with ID ${studentId} is already enrolled in class with ID ${classId}.`);
                return { error: `Student with ID ${studentId} is already enrolled in class with ID ${classId}.` };
            }
            console.error("Error enrolling student:", error);
            return { error: "Error enrolling student." };
        }
    }

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