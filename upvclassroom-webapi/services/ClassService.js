const db = require("../dataAccess/db");

class ClassService {

    async createClass(className, teacherId, description = null, progam, semester)  {
        console.log("Creating class with data:", className, teacherId, description, progam, semester);
        try {
            const [result] = await db.execute(
                `INSERT INTO Classes (class_name, description, teacher_id, progam, semester) VALUES (?, ?, ?, ?, ?)`,
                [className, description, teacherId, progam, semester]
            );
            if (result.affectedRows === 0) {
                console.log("Failed to create class.");
                return { error: "Failed to create class." };
            }
            //console.log(result);
            console.log(`Inserted class with ID: ${result.insertId}`);
            return { class_id: result.insertId, class_name: className, description };
        } catch (error) {
            console.error("Error creating class:", error);
            return { error: "Error creating class." };
        }
    }

    async createAnnouncement(classId, title, message) {
        console.log("Creating announcement with data:", classId, title, message);
        try {
            const [classCheck] = await db.execute(
                `SELECT class_id FROM Classes WHERE class_id = ?`,
                [classId]
            );
            if (classCheck.length === 0) {
                console.log(`No class found with ID ${classId}.`);
                return { error: `No class found with ID ${classId}.` };
            }
            const [result] = await db.execute(
                `INSERT INTO Announcements (class_id, title, message) VALUES (?, ?, ?)`,
                [classId, title, message]
            );
            if (result.affectedRows === 0) {
                console.log("Failed to create announcement.");
                return { error: "Failed to create announcement." };
            }
            console.log(`Inserted announcement with ID: ${result.insertId}`);
            return { announcement_id: result.insertId, class_id: classId, title, message };
        } catch (error) {
            console.error("Error creating announcement:", error);
            return { error: "Error creating announcement." };
        }
    }
    

    async getAnnouncements(classId) {
        try {
            const [announcements] = await db.execute(
                `SELECT announcement_id, title, message FROM Announcements WHERE class_id = ?`,
                [classId]
            );

            if (!announcements || announcements.length === 0) {
                console.log(`No announcements found for class with ID ${classId}.`);
                return [];
            }

            for (const announcement of announcements) {
                const [files] = await db.execute(
                    `SELECT original_name, file_path FROM AnnouncementFiles WHERE announcement_id = ?`,
                    [announcement.announcement_id]
                );
                announcement.files = files;
            }

            return announcements;
        } catch (error) {
            console.error("Error fetching announcements:", error);
            return { error: "Error fetching announcements." };
        }
    }

    async getClasses(Id) {
        let classes = [];
        try {
            const [role] = await db.execute(
                `SELECT role FROM Users WHERE user_id = ?`,
                [Id]
            );
            /*
            console.log(role);
            console.log(role[0].role);
            */
            if (role.length === 0){
                console.log(`No user found with ID ${Id}.`);
                return { message: `No user found with ID ${Id}.` }; 
            }

            if (role[0].role === "student") {
                classes = await this.getStudentClasses(Id);
            }

            if (role[0].role == "teacher") {
                classes = await this.getTeacherClasses(Id);
            }
            
            return classes;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return { error: "Error fetching classes." };
        }
    }

    async getTeacherClasses(teacherId) {
        try {
            const [classes] = await db.execute(
                `SELECT class_id, class_name, description, progam FROM Classes WHERE teacher_id = ?`,
                [teacherId]
            );

            if (classes.length === 0) {
                console.log(`No classes found for teacher with ID ${teacherId}.`);
                return { message: `No classes found for teacher with ID ${teacherId}.` };
            }
            
            return classes;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return { error: "Error fetching classes." };
        }
    }

    async getStudentClasses(studentId) {
        try {
            const [classes] = await db.execute(
                `SELECT c.class_id, c.class_name FROM Classes c
                 JOIN Enrollment e ON c.class_id = e.class_id
                 WHERE e.student_id = ?`,
                [studentId]
            );
            if (classes.length === 0) {
                console.log(`No classes found for student with ID ${studentId}.`);
                return { message: `No classes found for student with ID ${studentId}.` };
            }
            return classes;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return { error: "Error fetching classes." };            
        }
    }

    async saveFile({ generated_name, original_name, file_path, entity_type, entity_id, uploaded_by }) {
        console.log("Saving file with data:", generated_name, original_name, file_path, entity_type, entity_id, uploaded_by);
        try {
            let result;

            if (entity_type === 'Announcement') {
                [result] = await db.execute(
                    `INSERT INTO AnnouncementFiles (generated_name, original_name, file_path, announcement_id, uploaded_by) VALUES (?, ?, ?, ?, ?)`,
                    [generated_name, original_name, file_path, entity_id, uploaded_by]
                );
            } else if (entity_type === 'Assignment') {
                [result] = await db.execute(
                    `INSERT INTO AssignmentFiles (generated_name, original_name, file_path, assignment_id, uploaded_by) VALUES (?, ?, ?, ?, ?)`,
                    [generated_name, original_name, file_path, entity_id, uploaded_by]
                );
            } else if (entity_type === 'Material') {
                [result] = await db.execute(
                    `INSERT INTO MaterialFiles (generated_name, original_name, file_path, material_id, uploaded_by) VALUES (?, ?, ?, ?, ?)`,
                    [generated_name, original_name, file_path, entity_id, uploaded_by]
                );
            } else {
                throw new Error(`Unsupported entity type: ${entity_type}`);
            }

            if (result.affectedRows === 0) {
                console.log("Failed to save file.");
                return { error: "Failed to save file." };
            }

            return {message: "File saved successfully"};
        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Error saving file');
        }
    }

}

module.exports = ClassService;