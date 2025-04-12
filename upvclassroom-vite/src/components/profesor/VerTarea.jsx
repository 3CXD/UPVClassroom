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
    <div>
      <button onClick={volver}>Volver</button>
      <h1>Assignment Details</h1>
      <p>Title: {assignmentDetails?.title || "No title available"}</p>
      <p>Description: {assignmentDetails?.description || "No description available"}</p>
      <p>
        Due Date: {assignmentDetails?.due_date ? new Date(assignmentDetails.due_date.replace(' ', 'T')).toLocaleString() : "No due date available"}
      </p>

      <h2>Submissions</h2>
      <div className="submissionsGrid">
        {students.map((student) => {
          const submission = submissions[student.user_id];
          return (
            <div key={student.user_id} className="submissionCard">
              <h3>{student.first_name} {student.last_name}</h3>
              {submission ? (
                <>
                  <p>Submitted At: {new Date(submission.submitted_at).toLocaleString()}</p>
                  <p>Grade: {submission.grade !== null ? submission.grade : "Not graded yet"}</p>
                  {submission.files && submission.files.length > 0 && (
                    <div>
                      <h4>Files:</h4>
                      <ul>
                        {submission.files.map((file, index) => (
                          <li key={index}>
                            <a
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
                    onClick={() => {
                      const grade = prompt("Enter the grade:", submission.grade || "");
                      if (grade !== null) {
                        handleGradeSubmission(student.user_id, grade);
                      }
                    }}
                  >
                    {submission.grade !== null ? "Update Grade" : "Grade Submission"}
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
  );
}

export default VerTareaProfesor;