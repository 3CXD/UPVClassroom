const db = require("../dataAccess/db");

class ClassService {

    async createClass(className, teacherId, description, program, semester) {
        console.log("Creating class with data:", className, program, semester, description, teacherId);
        try {
            const [result] = await db.execute(
                `INSERT INTO Classes (class_name, progam, semester, description, teacher_id) VALUES (?, ?, ?, ?, ?)`,
                [className, program, semester, description, teacherId]
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

    async createTopic (classId, topicName, description) {
        console.log("Creating topic with data:", classId, topicName, description);
        const [classCheck] = await db.execute(
            `SELECT class_id FROM Classes WHERE class_id = ?`,
            [classId]
        );
        if (classCheck.length === 0) {
            console.log(`No class found with ID ${classId}.`);
            return { error: `No class found with ID ${classId}.` };
        }

        try {
            const [result] = await db.execute(
                `INSERT INTO Topics (class_id, title, description) VALUES (?, ?, ?)`,
                [classId, topicName, description]
            );
            if (result.affectedRows === 0) {
                console.log("Failed to create topic.");
                return { error: "Failed to create topic." };
            }
            console.log(`Inserted topic with ID: ${result.insertId}`);
            return { topic_id: result.insertId,topicName, description};
        } catch (error) {
            console.error("Error creating topic:", error);
            return { error: "Error creating topic." };
        }

    }

    async createMaterial(classId, topicId, title, description) {
        console.log("Creating material with data:", classId, topicId, title, description);
        const [classCheck] = await db.execute(
            `SELECT class_id FROM Classes WHERE class_id = ?`,
            [classId]
        );
        if (classCheck.length === 0) {
            console.log(`No class found with ID ${classId}.`);
            return { error: `No class found with ID ${classId}.` };
        }
        const [topicCheck] = await db.execute(
            `SELECT topic_id, title FROM Topics WHERE topic_id = ?`,
            [topicId]
        );
        if (topicCheck.length === 0) {
            console.log(`No topic found with ID ${topicId}.`);
            return { error: `No topic found with ID ${topicId}.` };
        }

        console.log(topicCheck);
    
        try {
            const [result] = await db.execute(
                `INSERT INTO Materials (class_id, topic_id, title, description) VALUES (?, ?, ?, ?)`,
                [classId, topicId, title, description]
            );
            if (result.affectedRows === 0) {
                console.log("Failed to create material.");
                return { error: "Failed to create material." };
            }
            console.log(`Inserted material with ID: ${result.insertId}`);
    
            const announcementTitle = `New Material Added: ${title}`;
            const announcementMessage = `A new material titled "${title}" has been added to the "${topicCheck[0].title}".`;
            await this.createAnnouncement(classId, announcementTitle, announcementMessage);
    
            return { material_id: result.insertId, title, description };
        } catch (error) {
            console.error("Error creating material:", error);
            return { error: "Error creating material." };
        }
    }

    async createAssignment(classId, topicId, title, description, dueDate) {
        console.log("Creating assignment with data:", classId, topicId, title, description, dueDate);
        const [classCheck] = await db.execute(
            `SELECT class_id FROM Classes WHERE class_id = ?`,
            [classId]
        );
        if (classCheck.length === 0) {
            console.log(`No class found with ID ${classId}.`);
            return { error: `No class found with ID ${classId}.` };
        }
        const [topicCheck] = await db.execute(
            `SELECT topic_id, title FROM Topics WHERE topic_id = ?`,
            [topicId]
        );
        if (topicCheck.length === 0) {
            console.log(`No topic found with ID ${topicId}.`);
            return { error: `No topic found with ID ${topicId}.` };
        }

        const now = new Date();
        const dueDateTime = new Date(dueDate);

        if (dueDateTime < now) {
            return { error: "The due date cannot be in the past." };
        }

        try {
            const [result] = await db.execute(
                `INSERT INTO Assignments (class_id, topic_id ,title, description, due_date) VALUES (?, ?, ?, ?, ?)`,
                [classId, topicId , title, description, dueDate]
            );
            if (result.affectedRows === 0) {
                console.log("Failed to create assignment.");
                return { error: "Failed to create assignment." };
            }

            const announcementTitle = `New Assignment Added: ${title}`;
            const announcementMessage = `A new material titled "${title}" has been added to the "${topicCheck[0].title}".`;
            await this.createAnnouncement(classId, announcementTitle, announcementMessage);
            console.log(`Inserted assignment with ID: ${result.insertId}`);
            return { assignment_id: result.insertId, title, description };
        } catch (error) {
            console.error("Error creating assignment:", error);
            return { error: "Error creating assignment." };
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
    
    async submitAssignment(assignmentId, studentId, files) {
        console.log("Submitting assignment with data:", assignmentId, studentId, files);
    
        try {
            const [assignmentCheck] = await db.execute(
                `SELECT due_date FROM Assignments WHERE assignment_id = ?`,
                [assignmentId]
            );
    
            if (assignmentCheck.length === 0) {
                console.log(`No assignment found with ID ${assignmentId}.`);
                return { error: `No assignment found with ID ${assignmentId}.` };
            }
    
            const dueDate = new Date(assignmentCheck[0].due_date);
            const now = new Date();
    
            if (now > dueDate) {
                return { error: "The deadline for this assignment has passed." };
            }
    
            const [submissionResult] = await db.execute(
                `INSERT INTO Submissions (assignment_id, student_id, submitted_at) VALUES (?, ?, ?)`,
                [assignmentId, studentId, now]
            );
    
            if (submissionResult.affectedRows === 0) {
                return { error: "Failed to submit assignment." };
            }
    
            const submissionId = submissionResult.insertId;
    
            if (files && files.length > 0) {
                for (const file of files) {
                    await db.execute(
                        `INSERT INTO SubmissionFiles (generated_name, original_name, file_path, submission_id, uploaded_by) 
                         VALUES (?, ?, ?, ?, ?)`,
                        [file.filename, file.originalname, `uploads/${file.filename}`, submissionId, studentId]
                    );
                }
            }
    
            return { message: "Assignment submitted successfully.", submission_id: submissionId };
        } catch (error) {
            console.error("Error submitting assignment:", error);
            return { error: "Error submitting assignment." };
        }
    }

    async gradeSubmission(assignmentId, studentId, grade) {
        try {
            const [submissionCheck] = await db.execute(
                `SELECT submission_id FROM Submissions WHERE assignment_id = ? AND student_id = ?`,
                [assignmentId, studentId]
            );
    
            if (submissionCheck.length === 0) {
                return { error: "No submission found for this assignment and student." };
            }
    
            const [result] = await db.execute(
                `UPDATE Submissions 
                 SET grade = ?, graded_at = NOW() 
                 WHERE assignment_id = ? AND student_id = ?`,
                [grade, assignmentId, studentId]
            );
    
            if (result.affectedRows === 0) {
                return { error: "Failed to update grade." };
            }
    
            return { message: "Grade updated successfully." };
        } catch (error) {
            console.error("Error grading submission:", error);
            throw new Error("Error grading submission.");
        }
    }

    async deleteSubmission(assignmentId, studentId) {
        try {
            // Verificar si la entrega ya fue calificada
            const [submission] = await db.execute(
                `SELECT grade FROM Submissions WHERE assignment_id = ? AND student_id = ?`,
                [assignmentId, studentId]
            );
    
            if (submission.length === 0) {
                return { error: "No submission found to delete." };
            }
    
            if (submission[0].grade !== null) {
                return { error: "Cannot delete a graded submission." };
            }
    
            // Eliminar archivos asociados a la entrega
            await db.execute(
                `DELETE FROM SubmissionFiles WHERE submission_id = (
                    SELECT submission_id FROM Submissions WHERE assignment_id = ? AND student_id = ?
                )`,
                [assignmentId, studentId]
            );
    
            // Eliminar la entrega
            const [result] = await db.execute(
                `DELETE FROM Submissions WHERE assignment_id = ? AND student_id = ?`,
                [assignmentId, studentId]
            );
    
            if (result.affectedRows === 0) {
                return { error: "Failed to delete submission." };
            }
    
            return { message: "Submission deleted successfully." };
        } catch (error) {
            console.error("Error deleting submission:", error);
            return { error: "Error deleting submission." };
        }
    }

    async getAnnouncements(classId) {
        try {
            const [announcements] = await db.execute(
                `SELECT announcement_id, title, created_at, message 
                 FROM Announcements 
                 WHERE class_id = ? 
                 ORDER BY created_at DESC`,
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

    async getMaterialById(materialId) {
        try {
            const [material] = await db.execute(
                `SELECT material_id, class_id, topic_id, title, description, created_at 
                 FROM Materials 
                 WHERE material_id = ?`,
                [materialId]
            );
    
            if (!material || material.length === 0) {
                console.log(`No material found with ID ${materialId}.`);
                return { error: `No material found with ID ${materialId}.` };
            }
    
            const [files] = await db.execute(
                `SELECT original_name, file_path 
                 FROM MaterialFiles 
                 WHERE material_id = ?`,
                [materialId]
            );
    
            material[0].files = files || [];
            return material[0];
        } catch (error) {
            console.error("Error fetching material by ID:", error);
            return { error: "Error fetching material by ID." };
        }
    }

    async getAssignmentById(assignmentId) {
        try {
            const [assignment] = await db.execute(
                `SELECT assignment_id, class_id, topic_id, title, description, due_date, created_at 
                 FROM Assignments 
                 WHERE assignment_id = ?`,
                [assignmentId]
            );
    
            if (!assignment || assignment.length === 0) {
                return { error: `No assignment found with ID ${assignmentId}.` };
            }
    
            const [files] = await db.execute(
                `SELECT original_name, file_path 
                 FROM AssignmentFiles 
                 WHERE assignment_id = ?`,
                [assignmentId]
            );
    
            assignment[0].files = files || [];
            return assignment[0];
        } catch (error) {
            console.error("Error fetching assignment by ID:", error);
            return { error: "Error fetching assignment by ID." };
        }
    }

    async getSubmission(assignmentId, studentId) {
        try {
            const [submission] = await db.execute(
                `SELECT s.submission_id, s.submitted_at, s.grade 
                 FROM Submissions s 
                 WHERE s.assignment_id = ? AND s.student_id = ?`,
                [assignmentId, studentId]
            );
    
            if (submission.length === 0) {
                return { error: "No submission found for this assignment and student." };
            }
    
            const [files] = await db.execute(
                `SELECT original_name, file_path 
                 FROM SubmissionFiles 
                 WHERE submission_id = ?`,
                [submission[0].submission_id]
            );
    
            submission[0].files = files || [];
            return submission[0];
        } catch (error) {
            console.error("Error fetching submission:", error);
            return { error: "Error fetching submission." };
        }
    }

    async getSubmissionsByAssignmentId(assignmentId) {
        try {
            const [submissions] = await db.execute(
                `SELECT s.submission_id, s.student_id, s.submitted_at, s.grade, u.first_name, u.last_name
                 FROM Submissions s
                 JOIN Users u ON s.student_id = u.user_id
                 WHERE s.assignment_id = ?`,
                [assignmentId]
            );
    
            for (const submission of submissions) {
                const [files] = await db.execute(
                    `SELECT original_name, file_path 
                     FROM SubmissionFiles 
                     WHERE submission_id = ?`,
                    [submission.submission_id]
                );
                submission.files = files || [];
            }
    
            return submissions;
        } catch (error) {
            console.error("Error fetching submissions by assignment ID:", error);
            throw new Error("Error fetching submissions by assignment ID.");
        }
    }

    async getTopicContent(classId, topicId) {
        try {
            const [materials] = await db.execute(
                `SELECT material_id AS id, title, description, created_at, 'Material' AS type 
                 FROM Materials 
                 WHERE class_id = ? AND topic_id = ?`,
                [classId, topicId]
            );
    
            const [assignments] = await db.execute(
                `SELECT assignment_id AS id, title, description, due_date, created_at, 'Assignment' AS type 
                 FROM Assignments 
                 WHERE class_id = ? AND topic_id = ?`,
                [classId, topicId]
            );

            if (!assignments || assignments.length === 0) {
                console.log(`No assignments found for class with ID ${classId} and topic with ID ${topicId}.`);
                return materials;
            }
    
            const combinedContent = [...materials, ...assignments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            for (const content of combinedContent) {
                if (content.type === 'Material') {
                    const [files] = await db.execute(
                        `SELECT original_name, file_path FROM MaterialFiles WHERE material_id = ?`,
                        [content.id]
                    );
                    content.files = files;
                } else if (content.type === 'Assignment') {
                    const [files] = await db.execute(
                        `SELECT original_name, file_path FROM AssignmentFiles WHERE assignment_id = ?`,
                        [content.id]
                    );
                    content.files = files;
                }
            }
    
            return combinedContent;
        } catch (error) {
            console.error("Error fetching topic content:", error);
            return { error: "Error fetching topic content." };
        }
    }

    async getTopics(classId) {
        try {
            const [topics] = await db.execute(
                `SELECT topic_id, title, description FROM Topics WHERE class_id = ? ORDER BY created_at DESC`,
                [classId]
            );
            if (!topics || topics.length === 0) {
                console.log(`No topics found for class with ID ${classId}.`);
                return [];
            }
            return topics;
        } catch (error) {
            console.error("Error fetching topics:", error);
            return { error: "Error fetching topics." };
        }
    }

    async getStudentsByClassId(classId) {
        try {
            const [students] = await db.execute(
                `SELECT u.user_id, u.first_name, u.last_name, u.email 
                 FROM Users u
                 JOIN Enrollment e ON u.user_id = e.student_id
                 WHERE e.class_id = ?`,
                [classId]
            );
    
            return students;
        } catch (error) {
            console.error("Error fetching students by class ID:", error);
            throw new Error("Error fetching students by class ID.");
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
                `SELECT 
                    c.class_id, 
                    c.class_name, 
                    (SELECT username FROM Users WHERE user_id = c.teacher_id) AS teacher_name,
                    c.description 
                 FROM Classes c
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
