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

module.exports = router;