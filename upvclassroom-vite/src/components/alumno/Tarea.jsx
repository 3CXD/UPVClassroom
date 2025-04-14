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
  try {
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
  } catch (err) {
    console.error("Error guardando borrador:", err);
  }
}

async function loadDraft(assignmentId, studentId) {
  try {
    const db = await setupDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const draft = await store.get([assignmentId, studentId]);
    return draft?.files ? draft.files.map(fileData => 
      new File([fileData.buffer], fileData.name, { type: fileData.type })
    ) : [];
  } catch (err) {
    console.error("Error cargando borrador:", err);
    return [];
  }
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
    let isMounted = true;
    const saveDraftDebounced = async () => {
      if (isMounted && assignmentId && studentId && !submission && files.length > 0) {
        try {
          await saveDraft(assignmentId, studentId, files);
        } catch (err) {
          console.error("Error en autoguardado:", err);
        }
      }
    };

    const timer = setTimeout(saveDraftDebounced, 1000);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [files, assignmentId, studentId, submission]);

  useEffect(() => {
    const fetchData = async () => {
      if (assignmentId && studentId) {
        try {
          const [draftFiles, assignmentRes, submissionRes] = await Promise.all([
            loadDraft(assignmentId, studentId),
            fetch(`http://localhost:3001/classes/assignments/${assignmentId}`),
            fetch(`http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`)
          ]);

          setFiles(draftFiles);

          const assignmentData = await assignmentRes.json();
          if (assignmentRes.ok) {
            setAssignment(assignmentData);
          } else {
            setError(assignmentData.error || "Error al cargar la tarea");
          }

          const submissionData = await submissionRes.json();
          if (submissionRes.ok) {
            setSubmission(submissionData);
          }
        } catch (err) {
          console.error("Error cargando datos:", err);
          setError("Error cargando datos");
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
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!assignment) {
      alert("Detalles de la tarea no disponibles");
      return;
    }

    if (new Date() > new Date(assignment.due_date)) {
      alert("La fecha límite ha expirado");
      return;
    }

    if (files.length === 0) {
      alert("Selecciona al menos un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", studentId);
    files.forEach(file => formData.append("files", file));

    try {
      const response = await fetch(
        `http://localhost:3001/classes/assignment/${assignmentId}/submit`,
        { method: "POST", body: formData }
      );


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al entregar");
      }

      try {
        const db = await setupDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.delete([assignmentId, studentId]);
      } catch (err) {
        console.error("Error eliminando borrador:", err);
      }

      const submissionResponse = await fetch(
        `http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`
      );
      
      if (!submissionResponse.ok) {
          throw new Error("Error obteniendo datos actualizados");
      }

      const submissionData = await submissionResponse.json();
      
      setSubmission(submissionData);
      setSuccessMessage("¡Tarea entregada correctamente!");
      setFiles([]);

    } catch (err) {
      console.error("Error de entrega:", err);
      setError("Error de entrega");
    }
  };

  const handleUndoSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/classes/assignment/${assignmentId}/submission/${studentId}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      if (response.ok) {
        setSubmission(null);
        setSuccessMessage("Entrega cancelada");
      } else {
        setError(data.error || "Error al cancelar");
      }
    } catch (err) {
      console.error("Error cancelando:", err);
      setError("Error cancelando");
    }
  };

  const handleBack = () => {
    navigate('/cursosalumno/clasealumno', {
      state: { ...classData, teacher_name, studentId }
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

  if (!assignment) return <p>Cargando...</p>;

  return (
    <div className="bodyCursos">
        <div className="headerCursos">
            <div className="columnasCursos">
                <div className="primerColumnaCursos">

                </div>
                <div className="segundaColumnaCursos">
                <h1>Detalles de la Tarea</h1>
                </div>
                <div className="tercerColumnaCursos">
                  <button className='logoutButton' onClick={handleBack} style={{ marginTop: '2rem' }}>
                    Regresar
                  </button>
                </div>
            </div>
        </div>
      <div className='columnasMaterial'>
        <div className='columnaGrandeTarea'>
          <h1>{assignment.title}</h1>
          <h2>Descripción:</h2>
          <p>{assignment.description}</p>
          <h3>Fecha límite: {new Date(assignment.due_date).toLocaleString()}</h3>
        </div>
        <div className='columnaPequenaTarea'>
          <div className="cuadroMorado">
            {submission ? (
              <div>
                <p>Fecha de entrega: {new Date(submission.submitted_at).toLocaleString()}</p>
                {submission.files?.length > 0 ? (
                  <div>
                    <h4>Archivos Entregados:</h4>
                    <ul>
                      {submission.files.map((file, index) => (
                        <li key={index}>
                          <a
                            className='btnTarea' 
                            href={`http://localhost:3001/${file.file_path}`} target="_blank" rel="noreferrer">
                            {file.original_name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : <p>Sin archivos adjuntos</p>}
                <p>Calificación: {submission.grade ?? "Sin calificar"}</p>
                {!submission.grade && <button className="btnTarea" onClick={handleUndoSubmit}>Cancelar Entrega</button>}
              </div>
            ) : (
              <div>
                <h2>Entregar Trabajo</h2>
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    id="fileInput"
                    style={{ display: 'none' }}
                  />
                  <button className='btnTarea' onClick={() => document.getElementById('fileInput').click()}>
                    Seleccionar Archivos
                  </button>
                  
                  {files.length > 0 && (
                    <div>
                      <h4>Archivos en borrador:</h4>
                      <ul>
                        {files.map((file, index) => (
                          <li key={index}>
                            {file.name}
                            <button className='btnTarea' onClick={() => removeFile(index)}>Eliminar</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className='btnTarea' onClick={handleSubmit} style={{ marginTop: '1rem' }}>
                  Entregar Tarea
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}

export default TareaAlumno;