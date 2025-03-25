const mysql = require("mysql2/promise");

async function seedEnrollments(db) {
    try {
        const [classes] = await db.execute(
            `SELECT class_id FROM Classes WHERE class_name = ?`,
            ["Mathematics 101"]
        );

        if (classes.length === 0) {
            console.error("No class found with the specified name.");
            return;
        }

        const classId = classes[0].class_id;

        const [students] = await db.execute(
            `SELECT user_id FROM Users WHERE role = ?`,
            ["student"]
        );

        if (students.length === 0) {
            console.error("No students found in the database.");
            return;
        }

        for (const student of students) {
            const [result] = await db.execute(
                `INSERT INTO Enrollment (class_id, student_id) VALUES (?, ?)`,
                [classId, student.user_id]
            );
            console.log(`Enrolled student with ID: ${student.user_id} into class ID: ${classId}`);
        }

        console.log("Enrollment seeding completed.");
    } catch (error) {
        console.error("Error seeding enrollments:", error);
    }
}

module.exports = { seedEnrollments };