import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ClaseProfesor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { class_id, class_name, description, progam, teacher_Id } = location.state || {};

  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const volver = () => {
    navigate('/cursosprofesor/', { state: { user_id: teacher_Id } });
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/${class_id}/announcements`);
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          setAnnouncements([]);
          setError(data.message || 'Failed to fetch announcements');
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setAnnouncements([]);
        setError('Error fetching announcements');
      }
    };

    if (class_id) {
      fetchAnnouncements();
    }
  }, [class_id]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/user/students');
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
        setError(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error fetching students');
    }
  };

  const handleEnrollStudent = async (studentId) => {
    try {
      const response = await fetch('http://localhost:3001/enroll/addtoClass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, classId: class_id }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Student with ID ${studentId} successfully enrolled.`);
      } else {
        setSuccessMessage(data.error || 'Failed to enroll student.');
      }
    } catch (err) {
      console.error('Error enrolling student:', err);
      setSuccessMessage('Error enrolling student.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files); 
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('classId', class_id);
    formData.append('title', newAnnouncement.title);
    formData.append('message', newAnnouncement.message);
    formData.append('teacher_Id', teacher_Id);

    if (file) {
      Array.from(file).forEach((f) => formData.append('files', f)); 
    }

    try {
      const response = await fetch('http://localhost:3001/classes/createAnnouncement', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        const updatedResponse = await fetch(`http://localhost:3001/classes/${class_id}/announcements`);
        const updatedData = await updatedResponse.json();
        if (updatedResponse.ok && Array.isArray(updatedData)) {
          setAnnouncements(updatedData);
        }

        setNewAnnouncement({ title: '', message: '' });
        setFile(null);
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to create announcement');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Error creating announcement');
    }
  };

  return (
    <div className="bodyClase">
      <div className="headerClase">
        <div className="columnasClase">
          <div className="primerColumnaClase">
            
          </div>
          <div className="segundaColumnaClase">
            <h1>{class_name || 'Clase no encontrada'}</h1>
            <h2>Descripción de la clase:</h2>
            <p>{description || 'Sin descripción'}</p>
            <h3>Programa:</h3>
            <p>{progam || 'Sin programa'}</p>
          </div>
          <div className="tercerColumnaClase">
            <button className="backButton" onClick={volver}>Volver</button>
            <button className="backButton" onClick={() => { setShowStudentModal(true); fetchStudents(); }}>
              Enroll Students
            </button>
          </div>
        </div>
      </div>
      
      
      <h2 className="cosoParaQueNoSeDesacomode">Anuncios</h2>
      <div className="tableroClase">
        <div className="acomodar">
          <div
            className="agregarAnuncio"
            onClick={() => setShowForm(true)}
          >
            <h3>+ Agregar Anuncio</h3>
          </div>

          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div
                key={announcement.announcement_id}
                className="tarjetaAnuncio"
              >
                <h3>{announcement.title}</h3>
                <p>{announcement.message}</p>
                {announcement.files && announcement.files.length > 0 && (
                  <div>
                    <h4>Archivos:</h4>
                    <ul>
                      {announcement.files.map((file, index) => (
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
              </div>
            ))
          ) : (
            <p>No announcements available.</p>
          )}
        </div>
      </div>
      

      

      {showStudentModal && (
        <div
          className="miniForm"
        >
          <h2>Enroll Students</h2>
          <ul>
            {students.map((student) => (
              <li key={student.user_id} style={{ marginBottom: '10px' }}>
                {student.username}
                <button
                  className="btnMiniFormCrearClase2"
                  onClick={() => handleEnrollStudent(student.user_id)}
                >
                  Enroll
                </button>
              </li>
            ))}
          </ul>
          <button className="btnMiniFormCrearClase" onClick={() => setShowStudentModal(false)}>Close</button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {showForm && (
        <div
          className="miniForm"
        >
          <h2>Crear Nuevo Anuncio</h2>
          <form onSubmit={handleCreateAnnouncement} className="formNuevaClase">
            <input
              className="inputNuevaClase"
              type="text"
              name="title"
              placeholder="Título"
              value={newAnnouncement.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              className="inputNuevaClase"
              name="message"
              placeholder="Mensaje"
              value={newAnnouncement.message}
              onChange={handleInputChange}
              required
            />
            <input className="inputDeArchivos" type="file" multiple onChange={handleFileChange} /> {/* Allow multiple files */}
            <button className="btnMiniFormCrearClase" type="submit">Crear Anuncio</button>
            <button className="btnMiniFormCrearClase" type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default ClaseProfesor;