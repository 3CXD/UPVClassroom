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

//CREAR UNA CLASE (Necesita el id del teacher)
router.post("/createclass", async (req, res) => {
    const { className, teacher_Id, description, progam, semester } = req.body; 
    const teacherId = teacher_Id;
    console.log(semester);

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

module.exports = router;