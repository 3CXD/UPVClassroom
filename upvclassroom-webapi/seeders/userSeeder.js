const mysql = require("mysql2/promise");

async function seedUsers(db) {

    const users = [
        {
            username: "teacher1",
            email: "teacher1@example.com",
            first_name: "Alonso",
            last_name: "Gonzalez",
            password_hash: "passwordteacher1",
            role: "teacher",
        },
        {
            username: "teacher2",
            email: "teacher2@example.com",
            first_name: "Ana",
            last_name: "Barbera",
            password_hash: "passwordteacher2",
            role: "teacher",
        },
        {
            username: "student1",
            email: "student1@example.com",
            first_name: "Juan",
            last_name: "Perez",
            password_hash: "password2",
            role: "student",
        },
        {
            username: "student2",
            email: "student2@example.com",
            first_name: "Karla",
            last_name: "Lopez",
            password_hash: "password2",
            role: "student",
        },
        {
            username: "student3",
            email: "student3@example.com",
            first_name: "Luis",
            last_name: "Martinez",
            password_hash: "password3",
            role: "student",
        },
        {
            username: "student4",
            email: "student4@example.com",
            first_name: "Pedro",
            last_name: "Fernandez",
            password_hash: "password4",
            role: "student",
        },
        {
            username: "AngelCamacho",
            email: "student5@example.com",
            password_hash: "password5",
            role: "student",
        },
    ];

    try {
        for (const user of users) {
            const [result] = await db.execute(
                `INSERT INTO Users (username, email, first_name, last_name, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)`,
                [user.username, user.email, user.first_name, user.last_name, user.password_hash, user.role]
            );
            console.log(`Inserted user with ID: ${result.insertId}`);
        }
        console.log("User seeding completed.");
    } catch (error) {
        console.error("Error seeding users:", error);
    }
}

module.exports = { seedUsers };