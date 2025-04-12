const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");
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
        "SubmissionFiles",
        "AssignmentFiles",
        "MaterialFiles",
        "AnnouncementFiles",
    ];

    const uploadsDir = path.join(__dirname, "../uploads"); // Path to the uploads folder

    try {
        // Delete files in the uploads folder
        const files = await fs.readdir(uploadsDir);
        for (const file of files) {
            if (file === ".gitignore") {
                console.log("Skipping .gitignore file.");
                continue;
            }
            const filePath = path.join(uploadsDir, file);
            await fs.unlink(filePath);
            console.log(`Deleted file: ${file}`);
        }
        console.log("All files in uploads folder deleted successfully.");

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
        console.error("Error truncating tables or deleting files:", error);
    } finally {
        await db.end();
    }
}

truncateTables();