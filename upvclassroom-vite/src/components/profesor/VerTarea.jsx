import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function VerTareaProfesor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assignmentId, classData, teacher_Id } = location.state || {};

  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/assignments/${assignmentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error fetching assignment details.");
        }

        setAssignmentDetails(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching assignment details.");
      }
    };

    const fetchStudentsAndSubmissions = async () => {
      try {
        const studentsResponse = await fetch(`http://localhost:3001/classes/${classData.class_id}/students`);
        const studentsData = await studentsResponse.json();

        if (!studentsResponse.ok) {
          throw new Error(studentsData.error || "Error fetching students.");
        }

        setStudents(studentsData);

        const submissionsResponse = await fetch(`http://localhost:3001/classes/assignment/${assignmentId}/submissions`);
        let submissionsData = [];

        if (submissionsResponse.ok) {
          submissionsData = await submissionsResponse.json();
        } else if (submissionsResponse.status === 404) {
          console.log("No submissions found for this assignment.");
        } else {
          throw new Error("Error fetching submissions.");
        }

        const submissionsMap = {};
        submissionsData.forEach((submission) => {
          submissionsMap[submission.student_id] = submission;
        });

        setSubmissions(submissionsMap);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching data.");
      }
    };

    fetchAssignmentDetails();
    fetchStudentsAndSubmissions();
  }, [assignmentId, classData.class_id]);

  const handleGradeSubmission = async (studentId, grade) => {
    try {
      const response = await fetch(`http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error grading submission.");
      }

      setSubmissions((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], grade },
      }));

      alert("Grade updated successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error grading submission.");
    }
  };

  const volver = () => {
    navigate('/cursosprofesor/claseprofesor', {
      state: { 
        class_id: classData.class_id, 
        class_name: classData.class_name, 
        description: classData.description, 
        progam: classData.progam, 
        teacher_Id 
      }
    });
  };

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={volver}>Volver</button>
      </div>
    );
  }

  return (
    <div className="bodyCursos">
        <div className="headerCursos">
            <div className="columnasCursos">
                <div className="primerColumnaCursos">

                </div>
                <div className="segundaColumnaCursos">
                    <h1>Detalles de Tarea</h1>
                </div>
                <div className="tercerColumnaCursos">
                <button className='logoutButton' onClick={volver}>Volver</button>
                </div>
            </div>
        </div>
        <div className="vistaDeTareasDeAlumnos">
          <h1>{assignmentDetails?.title || "No existe el título"}</h1>
          <h2>Descripción:</h2>
          <p> {assignmentDetails?.description || "Sin descripción disponible"}</p>
          <h3>
            Due Date: {assignmentDetails?.due_date ? new Date(assignmentDetails.due_date.replace(' ', 'T')).toLocaleString() : "No due date available"}
          </h3>

          <h2>Submissions</h2>
          <div className="submissionsGrid">
            {students.map((student) => {
              const submission = submissions[student.user_id];
              return (
                <div key={student.user_id} className="submissionCard">
                  <h3>{student.first_name} {student.last_name}</h3>
                  {submission ? (
                    <>
                      <p>Subido el: {new Date(submission.submitted_at).toLocaleString()}</p>
                      <p>Calificación: {submission.grade !== null ? submission.grade : "Sin calificar"}</p>
                      {submission.files && submission.files.length > 0 && (
                        <div>
                          <h4>Archivos adjuntos:</h4>
                          <ul>
                            {submission.files.map((file, index) => (
                              <li key={index}>
                                <a
                                  className="btnBlanco"
                                  href={`http://localhost:3001/${file.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {file.original_name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button
                        className='btnBlanco'
                        onClick={() => {
                          const grade = prompt("Ingresa la calificación (0-100):", submission.grade || "");
                          if (grade !== null) {
                            const numericGrade = parseFloat(grade);
                            if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
                              alert("Por favor ingrese un valor válido entre 0 y 100.");
                            } else {
                              handleGradeSubmission(student.user_id, numericGrade);
                            }
                          }
                        }}
                      >
                        {submission.grade !== null ? "Actualizar Calificación" : "Calificar Tarea"}
                      </button>
                    </>
                  ) : (
                    <p>Sin entregar aún.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      
    </div>
  );
}

export default VerTareaProfesor;