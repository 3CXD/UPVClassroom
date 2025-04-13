import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { openDB } from 'idb';

const DB_NAME = 'draftsDB';
const STORE_NAME = 'drafts';

async function setupDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, {
        keyPath: ['assignmentId', 'studentId']
      });
    },
  });
}

async function saveDraft(assignmentId, studentId, files) {
  const filesData = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      type: file.type,
      buffer: await file.arrayBuffer(),
    }))
  );

  const db = await setupDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({ assignmentId, studentId, files: filesData });
  await tx.done;
}

async function loadDraft(assignmentId, studentId) {
  const db = await setupDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const draft = await store.get([assignmentId, studentId]);
  if (draft?.files) {
    return draft.files.map(fileData => 
      new File([fileData.buffer], fileData.name, { type: fileData.type })
    );
  }
  return [];
}

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
    const fetchData = async () => {
      if (assignmentId && studentId) {
        try {
          // Cargar borrador
          const draftFiles = await loadDraft(assignmentId, studentId);
          setFiles(draftFiles);

          // Cargar datos de la asignación
          const assignmentResponse = await fetch(`http://localhost:3001/classes/assignments/${assignmentId}`);
          const assignmentData = await assignmentResponse.json();

          if (assignmentResponse.ok) {
            setAssignment(assignmentData);
          } else {
            setError(assignmentData.error || "Error al cargar los detalles de la tarea.");
          }

          // Cargar entrega existente
          const submissionResponse = await fetch(
            `http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`
          );
          const submissionData = await submissionResponse.json();

          if (submissionResponse.ok) {
            setSubmission(submissionData);
          }
        } catch (err) {
          console.error("Error cargando datos:", err);
          setError("Error cargando datos.");
        }
      }
    };
    fetchData();
  }, [assignmentId, studentId]);

  useEffect(() => {
    if (error) {
      alert(error);
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      setSuccessMessage(null);
    }
  }, [successMessage]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveDraft = async () => {
    if (!assignmentId || !studentId) return;
    
    try {
      await saveDraft(assignmentId, studentId, files);
      setSuccessMessage("Borrador guardado correctamente.");
      setError(null);
    } catch (err) {
      console.error("Error guardando borrador:", err);
      setError("Error al guardar el borrador.");
    }
  };

  const handleSubmit = async () => {
    if (!assignment) {
      alert("No hay detalles disponibles de la tarea.");
      return;
    }

    if (new Date() > new Date(assignment.due_date)) {
      alert("La fecha límite de esta tarea ha expirado.");
      return;
    }

    if (files.length === 0) {
      alert("Por favor selecciona al menos un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", studentId);
    files.forEach(file => formData.append("files", file));

    try {
      const response = await fetch(
        `http://localhost:3001/classes/assignment/${assignmentId}/submit`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Eliminar borrador
        try {
          const db = await setupDB();
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          await store.delete([assignmentId, studentId]);
        } catch (err) {
            console.error("Error eliminando borrador:", err);
        }

        // Actualizar estado
        const submissionResponse = await fetch(
          `http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`
        );
        const submissionData = await submissionResponse.json();
        
        setSubmission(submissionData);
        setSuccessMessage("¡Tarea entregada correctamente!");
        setFiles([]);
      } else {
        setError(data.error || "Error al entregar la tarea.");
      }
    } catch (err) {
      console.error("Error entregando tarea:", err);
      setError("Error entregando tarea.");
    }
  };

  const handleUndoSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Entrega cancelada correctamente.");
        setSubmission(null);
      } else {
        setError(data.error || "Error al cancelar la entrega.");
      }
    } catch (err) {
      console.error("Error cancelando entrega:", err);
      setError("Error cancelando entrega.");
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
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Detalles de la Tarea</h1>
      <p>Título: {assignment.title}</p>
      <p>Descripción: {assignment.description}</p>
      <p>Fecha límite: {new Date(assignment.due_date).toLocaleString()}</p>

      {submission ? (
        <div>
          <p>
            Fecha de entrega:{" "}
            {submission.submitted_at
              ? new Date(submission.submitted_at).toLocaleString()
              : "No disponible"}
          </p>
          {submission.files && submission.files.length > 0 ? (
            <div>
              <h4>Archivos Entregados:</h4>
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
          ) : (
            <p>No hay archivos adjuntos.</p>
          )}
          <p>Calificación: {submission.grade !== null ? submission.grade : "Sin calificar"}</p>
          <button onClick={handleUndoSubmit}>Cancelar Entrega</button>
        </div>
      ) : (
        <div>
          <h3>Entregar Trabajo</h3>
          <button onClick={() => document.getElementById('fileInput').click()}>
            Seleccionar Archivos
          </button>
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {files.length > 0 && (
            <div>
              <h4>Archivos seleccionados:</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <button onClick={() => removeFile(index)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSubmit} style={{ marginRight: '1rem' }}>
              Entregar Tarea
            </button>
            <button onClick={handleSaveDraft}>Guardar Borrador</button>
          </div>
        </div>
      )}

      <button onClick={handleBack} style={{ marginTop: '2rem' }}>
        Regresar
      </button>
    </div>
  );
}

export default TareaAlumno;