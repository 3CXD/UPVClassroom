const mysql = require("mysql2/promise");

const db = require("../dataAccess/db");

async function truncateTables() {
    const tables = [
        "Submissions",
        "Assignments",
        "Announcements",
        "Enrollment",
        "Materials",
        "Topics",
        "Classes",
        "Users",
    ];

    try {
        // Disable foreign key 
        await db.execute("SET FOREIGN_KEY_CHECKS = 0");

        for (const table of tables) {
            await db.execute(`TRUNCATE TABLE ${table}`);
            console.log(`Truncated table: ${table}`);
        }

        // Re-enable foreign key
        await db.execute("SET FOREIGN_KEY_CHECKS = 1");

        console.log("All tables truncated successfully.");
    } catch (error) {
        console.error("Error truncating tables:", error);
    } finally {
        await db.end();
    }
}

truncateTables();