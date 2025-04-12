const express = require("express");
const ClassService = require("../services/ClassService");
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).array('files');

//TODAS LAS DE AQUI EMPIEZAN CON /classes/

///CLASES DE QUIEN SEA (Necesita el ID)
router.get("/:Id", async (req, res) =>{
    try {
        const Id = req.params.Id;
        const classService = new ClassService();
        const classes = await classService.getClasses(Id);
        res.json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).send("Error fetching classes" + error.message);
    }
});

router.get("/:Id/announcements", async (req, res) => {
    try {
        const classId = req.params.Id;
        const classService = new ClassService();
        const announcements = await classService.getAnnouncements(classId);
        res.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).send("Error fetching announcements" + error.message);
    }
});

router.get("/:Id/topics", async (req, res) => {
    try {
        const classId = req.params.Id;
        const classService = new ClassService();
        const topics = await classService.getTopics(classId);
        res.json(topics);
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).send("Error fetching topics" + error.message);
    }
});

router.get("/:classId/students", async (req, res) => {
    const { classId } = req.params;

    try {
        const classService = new ClassService();
        const students = await classService.getStudentsByClassId(classId);

        if (!students || students.length === 0) {
            return res.status(404).json({ error: "No students found for this class." });
        }

        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send("Error fetching students: " + error.message);
    }
});

router.get("/:classId/material/:materialId", async (req, res) => {
    try {
        const { materialId } = req.params;
        const classService = new ClassService();
        const material = await classService.getMaterialById(materialId);

        if (material.error) {
            return res.status(404).json({ error: material.error });
        }

        res.json(material);
    } catch (error) {
        console.error("Error fetching material by ID:", error);
        res.status(500).send("Error fetching material by ID: " + error.message);
    }
});

router.get('/assignments/:assignmentId', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const classService = new ClassService();
        const assignment = await classService.getAssignmentById(assignmentId);

        if (assignment.error) {
            return res.status(404).json({ error: assignment.error });
        }

        res.json(assignment);
    } catch (error) {
        console.error('Error fetching assignment details:', error);
        res.status(500).send({ error: 'Error fetching assignment details: ' + error.message });
    }
});

router.get("/assignment/:assignmentId/submissions", async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const classService = new ClassService();
        const submissions = await classService.getSubmissionsByAssignmentId(assignmentId);

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ error: "No submissions found for this assignment." });
        }

        res.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).send("Error fetching submissions: " + error.message);
    }
});

router.get('/assignment/:assignmentId/submission/:studentId', async (req, res) => {
    const { assignmentId, studentId } = req.params;

    try {
        const classService = new ClassService();
        const submission = await classService.getSubmission(assignmentId, studentId);

        if (submission.error) {
            return res.status(404).json({ error: submission.error });
        }

        res.json(submission);
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).send('Error fetching submission: ' + error.message);
    }
});

router.get("/:Id/topicContent/:topicId", async (req, res) => {
    try {
        const classId = req.params.Id;
        const topicId = req.params.topicId;
        const classService = new ClassService();
        const content = await classService.getTopicContent(classId, topicId);
        res.json(content);
    } catch (error) {
        console.error("Error fetching topic content:", error);
        res.status(500).send("Error fetching topic content: " + error.message);
    }
});

//CREAR UNA CLASE (Necesita el id del teacher)
router.post("/createclass", async (req, res) => {
    const { className, teacher_Id, description, progam, semester } = req.body; 
    const teacherId = teacher_Id;

    try {
        const classService = new ClassService();
        const result = await classService.createClass(className, teacherId, description, progam, semester);
        if (result.error && result.error === "Failed to create class.") {
            console.log("Failed to create class.");
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).send("Error creating class: " + error.message);
    }
});

router.post('/createAnnouncement', upload, async (req, res) => {
  const { classId, title, message, teacher_Id } = req.body;
  const files = req.files;

  console.log("TeacherId", teacher_Id);

  try {
    const classService = new ClassService();
    const result = await classService.createAnnouncement(classId, title, message);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    if (files && files.length > 0) {
      for (const file of files) {
        console.log("File", file);
        const relativePath = `uploads/${file.filename}`;
        const fileresult = await classService.saveFile({
          generated_name: file.filename,
          original_name: file.originalname,
          file_path: relativePath,
          entity_type: 'Announcement',
          entity_id: result.announcement_id,
          uploaded_by: teacher_Id
        });
        
        if (fileresult.error) {
          console.log("Failed to save file.");
          return res.status(400).json({ error: fileresult.error });
        }

      }
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).send('Error creating announcement: ' + error.message);
  }
});

router.post('/createTopic', async (req, res) => {
    const { classId, topicName, topicDescription } = req.body;

    try {
        const classService = new ClassService();
        const result = await classService.createTopic(classId, topicName, topicDescription);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating topic:", error);
        res.status(500).send("Error creating topic: " + error.message);
    }
});

router.post('/createMaterial', upload, async (req, res) => {
    const { classId, topicId, title, description, teacher_Id } = req.body;
    const files = req.files;

    console.log("TeacherIdasdadasd" , teacher_Id);

    try {
        const classService = new ClassService();
        const result = await classService.createMaterial(classId, topicId, title, description);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        if (files && files.length > 0) {
            for (const file of files) {
                const relativePath = `uploads/${file.filename}`;
                const fileresult = await classService.saveFile({
                    generated_name: file.filename,
                    original_name: file.originalname,
                    file_path: relativePath,
                    entity_type: 'Material',
                    entity_id: result.material_id,
                    uploaded_by: teacher_Id
                });

                if (fileresult.error) {
                    return res.status(400).json({ error: fileresult.error });
                }
            }
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).send('Error creating material: ' + error.message);
    }
});

router.post('/createAssignment', upload, async (req, res) => {
    const { classId, topicId, title, description, teacher_Id, due_date } = req.body;
    const files = req.files;

    try {
        const classService = new ClassService();
        const result = await classService.createAssignment(classId, topicId, title, description, due_date);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        if (files && files.length > 0) {
            for (const file of files) {
                const relativePath = `uploads/${file.filename}`;
                const fileresult = await classService.saveFile({
                    generated_name: file.filename,
                    original_name: file.originalname,
                    file_path: relativePath,
                    entity_type: 'Assignment',
                    entity_id: result.assignment_id,
                    uploaded_by: teacher_Id
                });

                if (fileresult.error) {
                    return res.status(400).json({ error: fileresult.error });
                }
            }
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).send('Error creating assignment: ' + error.message);
    }
});

router.post('/assignment/:assignmentId/submit', upload, async (req, res) => {
    const { assignmentId } = req.params;
    const { studentId } = req.body;
    const files = req.files;

    try {
        const classService = new ClassService();
        const result = await classService.submitAssignment(assignmentId, studentId, files);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).send('Error submitting assignment: ' + error.message);
    }
});

router.post("/assignment/:assignmentId/submission/:studentId/grade", async (req, res) => {
    const { assignmentId, studentId } = req.params;
    const { grade } = req.body;

    try {
        const classService = new ClassService();
        const result = await classService.gradeSubmission(assignmentId, studentId, grade);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.json({ message: "Grade updated successfully." });
    } catch (error) {
        console.error("Error grading submission:", error);
        res.status(500).send("Error grading submission: " + error.message);
    }
});

router.delete('/assignment/:assignmentId/submission/:studentId', async (req, res) => {
    const { assignmentId, studentId } = req.params;

    try {
        const classService = new ClassService();
        const result = await classService.deleteSubmission(assignmentId, studentId);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.json({ message: "Submission deleted successfully." });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).send('Error deleting submission: ' + error.message);
    }
});

module.exports = router;