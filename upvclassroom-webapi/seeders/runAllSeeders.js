const mysql = require("mysql2/promise");

const userSeeder = require("./userSeeder");
const classSeeder = require("./classSeeder");
const enrollmentSeeder = require("./enrollmentSeeder");

const db = require("../dataAccess/db");

async function runAllSeeders() {
    try {
        console.log("Running User Seeder...");
        await userSeeder.seedUsers(db);

        console.log("Running Class Seeder...");
        await classSeeder.seedClasses(db);

        console.log("Running Enrollment Seeder...");
        await enrollmentSeeder.seedEnrollments(db);

        console.log("All seeders executed successfully!");
    } catch (error) {
        console.error("Error running seeders:", error);
    } finally {
        await db.end();
    }
}

runAllSeeders();