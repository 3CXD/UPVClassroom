const mysql = require("mysql2/promise");

async function seedUsers(db) {

    const users = [
        {
            username: "teacher1",
            email: "teacher1@example.com",
            password_hash: "password1",
            role: "teacher",
        },
        {
            username: "student1",
            email: "student1@example.com",
            password_hash: "password2",
            role: "student",
        },
        {
            username: "student2",
            email: "student2@example.com",
            password_hash: "password2",
            role: "student",
        },
        {
            username: "student3",
            email: "student3@example.com",
            password_hash: "password3",
            role: "student",
        },
        {
            username: "student4",
            email: "student4@example.com",
            password_hash: "password4",
            role: "student",
        },
    ];

    try {
        for (const user of users) {
            const [result] = await db.execute(
                `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                [user.username, user.email, user.password_hash, user.role]
            );
            console.log(`Inserted user with ID: ${result.insertId}`);
        }
        console.log("User seeding completed.");
    } catch (error) {
        console.error("Error seeding users:", error);
    }
}

module.exports = { seedUsers };