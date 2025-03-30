import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ClaseAlumno() {
  const navigate = useNavigate();
  const location = useLocation();
  const { class_id, class_name, description, teacher_name, studentId } = location.state || {};

  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  const volver = () => {
    navigate('/cursosalumno', { state: { user_id: studentId} });
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

  return (
    <div>
      <button onClick={volver}>Volver</button>
      <h1>{class_name || 'Clase no encontrada'}</h1>
      <h2>Profesor que imparte la clase:</h2>
      <h3>{teacher_name || 'Sin profesor asignado'}</h3>
      <h2>Descripción de la clase:</h2>
      <h3>{description || 'Sin descripción'}</h3>
      <h2>Tablón</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
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
    </div>
  );
}

export default ClaseAlumno;