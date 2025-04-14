import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ClaseAlumno() {
  const navigate = useNavigate();
  const location = useLocation();
  const { class_id, class_name, description, teacher_name, studentId } = location.state || {};
  
  const classData = {
    class_id,
    class_name,
    description,
  };
  
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);

  const volver = () => {
    navigate('/cursosalumno', { state: { user_id: studentId } });
  };

  const handleMaterialClick = (materialId) => {
    navigate(`/cursosalumno/clasealumno/vermaterialalumno`, {
      state: { 
        materialId, 
        studentId, 
        classData, 
        teacher_name 
      }
    });
  };

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/cursosalumno/clasealumno/vertareaalumno`, {
      state: { 
        assignmentId, 
        studentId, 
        classData, 
        teacher_name 
      }
    });
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

  useEffect(() => {
    const fetchTopicsWithContent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/${class_id}/topics`);
        const topicsData = await response.json();

        if (response.ok && Array.isArray(topicsData)) {
          const topicsWithContent = await Promise.all(
            topicsData.map(async (topic) => {
              try {
                const contentResponse = await fetch(
                  `http://localhost:3001/classes/${class_id}/topicContent/${topic.topic_id}`
                );
                const contentData = await contentResponse.json();

                if (contentResponse.ok) {
                  return { ...topic, content: contentData };
                } else {
                  console.error(`Failed to fetch content for topic ${topic.topic_id}`);
                  return { ...topic, content: [] };
                }
              } catch (err) {
                console.error(`Error fetching content for topic ${topic.topic_id}:`, err);
                return { ...topic, content: [] };
              }
            })
          );

          setTopics(topicsWithContent);
        } else {
          setTopics([]);
          setError(topicsData.message || 'Failed to fetch topics');
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
        setTopics([]);
        setError('Error fetching topics');
      }
    };

    if (class_id) {
      fetchTopicsWithContent();
    }
  }, [class_id]);

  return (
    <div className="bodyClase">
      <div className="headerClase">
        <div className="columnasClase">
          <div className="primerColumnaClase"></div>
          <div className="segundaColumnaClase">
            <h1>{class_name || 'Clase no encontrada'}</h1>
            <h2>Profesor que imparte la clase:</h2>
            <h3>{teacher_name || 'Sin profesor asignado'}</h3>
            <h2>Descripción de la clase:</h2>
            <h3>{description || 'Sin descripción'}</h3>
          </div>
          <div className="tercerColumnaClase">
            <button className="backButton" onClick={volver}>Volver</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tabButton ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Anuncios
        </button>
        <button
          className={`tabButton ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          Contenido
        </button>
      </div>

      {activeTab === 'announcements' && (
        <div className="tabContent">
          <div className="tableroClase">
            <h2>Tablón</h2>
            <div className="acomodar">
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <div key={announcement.announcement_id} className="tarjetaAnuncio">
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
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="tabContent">
          <div className="tableroClase">
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <div key={`topic-${topic.topic_id}-${index}`} className="topicCard">
                  <div className="topicHeader">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <div className="topicContent">
                    {topic.content && topic.content.length > 0 ? (
                      <div className="contentGrid">
                        {topic.content.map((item, contentIndex) => (
                          <div
                            key={`content-${item.id}-${contentIndex}`}
                            className={`contentItem ${item.type}`}
                            onClick={() =>
                              item.type === 'Material'
                                ? handleMaterialClick(item.id)
                                : handleAssignmentClick(item.id)
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            <p>{item.type === 'Material' ? 'Material' : 'Tarea'}</p> {/* Add this line */}
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                            {item.files && item.files.length > 0 && (
                              <ul>
                                {item.files.map((file, fileIndex) => (
                                  <li key={`file-${file.file_path}-${fileIndex}`}>
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
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No content available for this topic.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No topics available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaseAlumno;