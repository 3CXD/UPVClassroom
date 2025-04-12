import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function TareaAlumno() {
  const location = useLocation();
  const navigate = useNavigate();
  const { assignmentId, studentId, classData, teacher_name } = location.state || {};

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/assignments/${assignmentId}`);
        const data = await response.json();

        if (response.ok) {
          setAssignment(data);
        } else {
          setError(data.error || "Error fetching assignment details.");
        }
      } catch (err) {
        console.error("Error fetching assignment details:", err);
        setError("Error fetching assignment details.");
      }
    };

    const fetchSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`);
        const data = await response.json();

        if (response.ok) {
          setSubmission(data);
        } else {
          setSubmission(null);
        }
      } catch (err) {
        console.error("Error fetching submission details:", err);
      }
    };

    if (assignmentId) {
      fetchAssignment();
      fetchSubmission();
    }
  }, [assignmentId, studentId]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!assignment) {
      alert("Assignment details are not available.");
      return;
    }
  
    if (new Date() > new Date(assignment.due_date)) {
      alert("The deadline for this assignment has passed. You cannot submit it anymore.");
      return;
    }
  

    const formData = new FormData();
    formData.append("studentId", studentId);
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch(`http://localhost:3001/classes/assignment/${assignmentId}/submit`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Assignment submitted successfully!");
        setError(null);
        setSubmission(data);
      } else {
        setError(data.error || "Error submitting assignment.");
      }
    } catch (err) {
      console.error("Error submitting assignment:", err);
      setError("Error submitting assignment.");
    }
  };

  const handleUndoSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Submission undone successfully.");
        setSubmission(null);
      } else {
        setError(data.error || "Error undoing submission.");
      }
    } catch (err) {
      console.error("Error undoing submission:", err);
      setError("Error undoing submission.");
    }
  };

  const handleBack = () => {
    navigate('/cursosalumno/clasealumno', {
      state: {
        class_id: classData.class_id,
        class_name: classData.class_name,
        description: classData.description,
        teacher_name,
        studentId,
      },
    });
  };

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={handleBack}>Regresar</button>
      </div>
    );
  }

  if (!assignment) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Assignment Details</h1>
      <p>Title: {assignment.title}</p>
      <p>Description: {assignment.description}</p>
      <p>Due Date: {new Date(assignment.due_date).toLocaleString()}</p>

      {submission ? (
        <div>
          <p>
            Submitted At:{" "}
            {submission.submitted_at
              ? new Date(submission.submitted_at).toLocaleString()
              : "Not available"}
          </p>
          {submission.files && submission.files.length > 0 ? (
            <div>
              <h4>Submitted Files:</h4>
              <ul>
                {submission.files.map((file, index) => (
                  <li key={index}>
                    <a href={`http://localhost:3001/${file.file_path}`} target="_blank" rel="noopener noreferrer">
                      {file.original_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No files attached.</p>
          )}
          {submission.grade !== null ? (
            <p>Grade: {submission.grade}</p>
          ) : (
            <button onClick={handleUndoSubmit}>Undo Submission</button>
          )}
        </div>
      ) : (
        <div>
          <h3>Submit Your Work</h3>
          <input type="file" multiple onChange={handleFileChange} />
          <button onClick={handleSubmit}>Submit Assignment</button>
        </div>
      )}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <button onClick={handleBack}>Regresar</button>
    </div>
  );
}

export default TareaAlumno;