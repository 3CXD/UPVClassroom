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

  const fetchStudents = async (searchQuery = '') => {
    try {
      const response = await fetch(`http://localhost:3001/user/students?search=${searchQuery}`);
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
    <div>
      <button onClick={volver}>Volver</button>
      <h1>{class_name || 'Clase no encontrada'}</h1>
      <hr />
      <h2>Descripción de la clase:</h2>
      <p>{description || 'Sin descripción'}</p>
      <h3>Programa:</h3>
      <p>{progam || 'Sin programa'}</p>

      <h2>Anuncios</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div
          style={{
            border: '1px solid black',
            padding: '20px',
            width: '200px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setShowForm(true)}
        >
          <h3>+ Agregar Anuncio</h3>
        </div>

        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.announcement_id}
              style={{
                border: '1px solid black',
                padding: '20px',
                width: '200px',
                textAlign: 'center',
              }}
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

      <button onClick={() => setShowStudentModal(true)}>
        Enroll Students
      </button>

      {showStudentModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: 1000,
            width: '400px',
          }}
        >
          <h2>Enroll Students</h2>
          <input
            type="text"
            placeholder="Search by username"
            onChange={(e) => {
              const searchQuery = e.target.value.trim();
              if (searchQuery) {
                fetchStudents(searchQuery);
              } else {
                setStudents([]);
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <ul>
            {students.length > 0 ? (
              students.map((student) => (
                <li key={student.user_id} style={{ marginBottom: '10px' }}>
                  {student.username}
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleEnrollStudent(student.user_id)}
                  >
                    Enroll
                  </button>
                </li>
              ))
            ) : (
              <p>No students found. Start typing to search.</p>
            )}
          </ul>
          <button onClick={() => setShowStudentModal(false)}>Close</button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: 1000,
          }}
        >
          <h2>Crear Nuevo Anuncio</h2>
          <form onSubmit={handleCreateAnnouncement}>
            <input
              type="text"
              name="title"
              placeholder="Título"
              value={newAnnouncement.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="message"
              placeholder="Mensaje"
              value={newAnnouncement.message}
              onChange={handleInputChange}
              required
            />
            <input type="file" multiple onChange={handleFileChange} /> {/* Allow multiple files */}
            <button type="submit">Crear Anuncio</button>
            <button type="button" onClick={() => setShowForm(false)}>
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