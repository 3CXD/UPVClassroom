const mysql = require("mysql2/promise");

async function seedClasses(db) {
    try {
        const [teacher] = await db.execute(
            `SELECT user_id FROM Users WHERE email = ? AND role = ?`,
            ["teacher1@example.com", "teacher"]
        );

        if (teacher.length === 0) {
            console.error("No teacher found with the specified email.");
            return;
        }

        const teacherId = teacher[0].user_id;

        const classes = [
            {
                class_name: "Mathematics 101",
                description: "An introductory course to mathematics.",
                teacher_id: teacherId,
                progam: "Mathematics Engineering",
                semester: "1st Semester",
            },
        ];

        for (const cls of classes) {
            const [result] = await db.execute(
                `INSERT INTO Classes (class_name, description, teacher_id, progam, semester) VALUES (?, ?, ?, ?, ?)`,
                [cls.class_name, cls.description, cls.teacher_id, cls.progam, cls.semester]
            );
            console.log(`Inserted class with ID: ${result.insertId}`);
        }

        console.log("Class seeding completed.");
    } catch (error) {
        console.error("Error seeding classes:", error);
    }
}

module.exports = { seedClasses };