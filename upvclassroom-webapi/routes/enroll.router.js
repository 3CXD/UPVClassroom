const express = require("express");
const EnrollmentService = require("../services/EnrollmentService");

//TODAS LAS DE AQUI EMPIEZAN CON /enroll/

const router = express.Router();

//ALUMNOS DE UNA CLASE
router.get("/:classId", async (req, res) =>{
    try {
        const classId = req.params.classId;
        const enrollmentService = new EnrollmentService();
        const students = await enrollmentService.getEnrolledStudents(classId);
        res.json(students);
    } catch (error) {
        console.error("Error fetching enrolled students:", error);
        res.status(500).send("Error fetching enrolled students" + error.message);
    }
});

//INSCRIBIR ALUMNO A UNA CLASE
router.post("/addtoClass", async (req, res) => {
    const { studentId, classId } = req.body; // Assuming you send studentId and classId in the request body
    console.log("Enrolling student with data:", studentId, classId);

    try {
        const enrollmentService = new EnrollmentService();
        const result = await enrollmentService.enrollStudent(studentId, classId);
        if (result.error && result.error === "Failed to enroll student.") {
            console.log("Failed to enroll student.");
            return res.status(400).json({ error: result.error });
        }
        if (result.error && result.error.includes("already enrolled")) {
            console.log("Student is already enrolled.");
            return res.status(409).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("Error enrolling student:", error);
        res.status(500).send("Error enrolling student: " + error.message);
    }
});




module.exports = router;