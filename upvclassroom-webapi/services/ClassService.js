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
            console.log(`Inserted class with ID: ${result.insert_Id}`);
            return { class_id: result.insert_Id, class_name: className, description };
        } catch (error) {
            console.error("Error creating class:", error);
            return { error: "Error creating class." };
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
                `SELECT class_id, class_name FROM Classes WHERE teacher_id = ?`,
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

}

module.exports = ClassService;
