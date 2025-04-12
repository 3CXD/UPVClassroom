import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ClaseProfesor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { class_id, class_name, description, progam, teacher_Id } = location.state || {};

  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);    
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    due_time: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', description: '' });

  const volver = () => {
    navigate('/cursosprofesor/', { state: { user_id: teacher_Id } });
  };

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

  useEffect(() => {
    if (class_id) {
      fetchAnnouncements();
    }
  }, [class_id]);

  useEffect(() => {
    const fetchTopicsWithContent = async () => {
      try {
        console.log("Fetching topics for class ID:", class_id);
        const response = await fetch(`http://localhost:3001/classes/${class_id}/topics`);
        const topicsData = await response.json();

        if (response.ok && Array.isArray(topicsData)) {
          const topicsWithContent = await Promise.all(
            topicsData.map(async (topic) => {
              console.log("Processing topic:", topic);
              if (!class_id || !topic.topic_id) {
                console.error("Invalid class_id or topic_id:", { class_id, topic_id: topic.topic_id });
                return { ...topic, content: [] };
              }

              try {
                const contentResponse = await fetch(
                  `http://localhost:3001/classes/${class_id}/topicContent/${topic.topic_id}`
                );
                const contentData = await contentResponse.json();
                console.log("Content data for topic:", contentData);

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

  const handleOpenMaterialModal = (topicId) => {
    setSelectedTopicId(topicId);
    setShowMaterialModal(true);
  };

  const handleCloseMaterialModal = () => {
    setShowMaterialModal(false);
    setNewMaterial({ title: '', description: '' });
    setFile(null);
  };

  const handleMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAssignmentModal = (topicId) => {
    setSelectedTopicId(topicId);
    setShowAssignmentModal(true);
  };
  
  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    setNewAssignment({ title: '', description: '', due_date: '' });
    setFile(null);
  };
  
  const handleAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('classId', class_id);
    formData.append('topicId', selectedTopicId);
    formData.append('title', newMaterial.title);
    formData.append('description', newMaterial.description);
    formData.append('teacher_Id', teacher_Id);

    if (file) {
      Array.from(file).forEach((f) => formData.append('files', f));
    }

    try {
      const response = await fetch('http://localhost:3001/classes/createMaterial', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        handleCloseMaterialModal();

        const contentResponse = await fetch(
          `http://localhost:3001/classes/${class_id}/topicContent/${selectedTopicId}`
        );
        const updatedContent = await contentResponse.json();

        if (contentResponse.ok) {
          setTopics((prevTopics) =>
            prevTopics.map((topic) =>
              topic.topic_id === selectedTopicId
                ? { ...topic, content: updatedContent } /* keep it like this */ 
                : topic
            )
          );
        }

        alert('Material creado exitosamente.');
      } else {
        setError(data.error || 'Failed to create material');
      }
    } catch (err) {
      console.error('Error creating material:', err);
      setError('Error creating material');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    const dueDateTime = `${newAssignment.due_date} ${newAssignment.due_time}:00`;

    const formData = new FormData();
    formData.append('classId', class_id);
    formData.append('topicId', selectedTopicId);
    formData.append('title', newAssignment.title);
    formData.append('description', newAssignment.description);
    formData.append('due_date', dueDateTime);
    formData.append('teacher_Id', teacher_Id);

    if (file) {
      Array.from(file).forEach((f) => formData.append('files', f));
    }

    try {
      const response = await fetch('http://localhost:3001/classes/createAssignment', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        handleCloseAssignmentModal();

        const contentResponse = await fetch(
          `http://localhost:3001/classes/${class_id}/topicContent/${selectedTopicId}`
        );
        const updatedContent = await contentResponse.json();

        if (contentResponse.ok) {
          setTopics((prevTopics) =>
            prevTopics.map((topic) =>
              topic.topic_id === selectedTopicId
                ? { ...topic, content: updatedContent } /* keep it like this */
                : topic
            )
          );
        }

        alert('Tarea creada exitosamente.');
      } else {
        setError(data.error || 'Failed to create assignment');
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError('Error creating assignment');
    }
  };

  const handleOpenTopicModal = () => {
    setShowTopicModal(true);
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
    setNewTopic({ title: '', description: '' });
  };

  const handleTopicInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/classes/createTopic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: class_id, topicName: newTopic.title, topicDescription: newTopic.description }),
      });
      const data = await response.json();
      if (response.ok) {
        setTopics((prevTopics) => [
          { topic_id: data.topic_id, title: newTopic.title, description: newTopic.description, content: [] },
          ...prevTopics,
        ]);
        handleCloseTopicModal();
        alert('Tema creado exitosamente.');
      } else {
        setError(data.error || 'Failed to create topic');
      }
    } catch (err) {
      console.error('Error creating topic:', err);
      setError('Error creating topic');
    }
  };

  const handleMaterialClick = (materialId) => {
    navigate(`/cursosprofesor/claseprofesor/vermaterial`, {
      state: { 
        materialId, 
        classData: { class_id, class_name, description, progam }, 
        teacher_Id 
      }
    });
  };

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/cursosprofesor/claseprofesor/vertareaprofesor`, {
      state: { 
        assignmentId, 
        classData: { class_id, class_name, description, progam }, 
        teacher_Id 
      }
    });
  };
  return (
    <div className="bodyClase">
      <div className="headerClase">
        <div className="columnasClase">
          <div className="primerColumnaClase"></div>
          <div className="segundaColumnaClase">
            <h1>{class_name || 'Clase no encontrada'}</h1>
            <h2>Descripción de la clase:</h2>
            <p>{description || 'Sin descripción'}</p>
            <h3>Programa:</h3>
            <p>{progam || 'Sin programa'}</p>
          </div>
          <div className="tercerColumnaClase">
            <button className="backButton" onClick={volver}>Volver</button>
            <button className="backButton" onClick={() => { setShowStudentModal(true);}}> {/* keep it like this */ }
              Enroll Students
            </button>
          </div>
        </div>
      </div>

{/* Tabs for switching between Announcements and Topics */}
      <div className="tabs">
        <button
          className={`tabButton ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('announcements');
            fetchAnnouncements();
          }}
        >
          Anuncios
        </button>
        <button
          className={`tabButton ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => {setActiveTab('topics')}}
        >
          Contenido
        </button>
      </div>

{/* Content for Announcements */}
      {activeTab === 'announcements' && (
        <div className="tabContent">
          <div className="tableroClase">
            <div className="acomodar">
              <div className="agregarAnuncio" onClick={() => setShowForm(true)}>
                <h3>+ Agregar Anuncio</h3>
              </div>

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
      )}

      {activeTab === 'topics' && (
        <div className="tabContent">
          <button className="btnAddTopic" onClick={handleOpenTopicModal}>+ Agregar Tema</button>
          <div className="tableroClase">
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <div key={`topic-${topic.topic_id}-${index}`} className="topicCard">
                  <div className="topicHeader">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                    <div className="topicActions">
                      <button
                        className="btnAddMaterial"
                        onClick={() => handleOpenMaterialModal(topic.topic_id)}
                      >
                        Agregar Material
                      </button>
                      <button
                        className="btnAddAssignment"
                        onClick={() => handleOpenAssignmentModal(topic.topic_id)}
                      >
                        Agregar Tarea
                      </button>
                    </div>
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
                            <p>
                              {item.type === 'Material' ? 'Material' : 'Tarea'}
                            </p>
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

      {/* Form for creating announcements */}
      {showForm && (
        <div className="miniForm">
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
            <input className="inputDeArchivos" type="file" multiple onChange={handleFileChange} />
            <button className="btnMiniFormCrearClase" type="submit">Crear Anuncio</button>
            <button className="btnMiniFormCrearClase" type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {showStudentModal && (
        <div className="miniForm">
          <h2>Enroll Students</h2>
          <input
            type="text"
            className="inputNuevaClase"
            placeholder="Search by username"
            onChange={(e) => {
              const searchQuery = e.target.value.trim();
              if (searchQuery) {
                fetchStudents(searchQuery);
              } else {
                setStudents([]);
              }
            }}
          />
          <ul>
            {students.length > 0 ? (
              students.map((student) => (
                <li key={student.user_id} style={{ marginBottom: '10px' }}>
                  {student.username}
                  <button
                    className="btnMiniFormCrearClase2"
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
          <button className="btnMiniFormCrearClase" onClick={() => setShowStudentModal(false)}>Close</button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {showMaterialModal && (
        <div className="miniForm">
          <h2>Agregar Material</h2>
          <form onSubmit={handleCreateMaterial} className="formNuevaClase">
            <input
              className="inputNuevaClase"
              type="text"
              name="title"
              placeholder="Título"
              value={newMaterial.title}
              onChange={handleMaterialInputChange}
              required
            />
            <textarea
              className="inputNuevaClase"
              name="description"
              placeholder="Descripción"
              value={newMaterial.description}
              onChange={handleMaterialInputChange}
              required
            />
            <input className="inputDeArchivos" type="file" multiple onChange={handleFileChange} />
            <button className="btnMiniFormCrearClase" type="submit">Crear Material</button>
            <button className="btnMiniFormCrearClase" type="button" onClick={handleCloseMaterialModal}>
              Cancelar
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
      {showAssignmentModal && (
        <div className="miniForm">
          <h2>Agregar Tarea</h2>
          <form onSubmit={handleCreateAssignment} className="formNuevaClase">
            <input
              className="inputNuevaClase"
              type="text"
              name="title"
              placeholder="Título"
              value={newAssignment.title}
              onChange={handleAssignmentInputChange}
              required
            />
            <textarea
              className="inputNuevaClase"
              name="description"
              placeholder="Descripción"
              value={newAssignment.description}
              onChange={handleAssignmentInputChange}
              required
            />
            <input
              className="inputNuevaClase"
              type="date"
              name="due_date"
              value={newAssignment.due_date}
              onChange={handleAssignmentInputChange}
              min={new Date().toISOString().split('T')[0]} // Set the minimum date to today
              required
            />
            <input
              className="inputNuevaClase"
              type="time"
              name="due_time"
              value={newAssignment.due_time || ''}
              onChange={handleAssignmentInputChange}
              required
            />
            <input className="inputDeArchivos" type="file" multiple onChange={handleFileChange} />
            <button className="btnMiniFormCrearClase" type="submit">Crear Tarea</button>
            <button className="btnMiniFormCrearClase" type="button" onClick={handleCloseAssignmentModal}>
              Cancelar
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {showTopicModal && (
        <div className="miniForm">
          <h2>Agregar Tema</h2>
          <form onSubmit={handleCreateTopic} className="formNuevaClase">
            <input
              className="inputNuevaClase"
              type="text"
              name="title"
              placeholder="Título"
              value={newTopic.title}
              onChange={handleTopicInputChange}
              required
            />
            <textarea
              className="inputNuevaClase"
              name="description"
              placeholder="Descripción"
              value={newTopic.description}
              onChange={handleTopicInputChange}
              required
            />
            <button className="btnMiniFormCrearClase" type="submit">Crear Tema</button>
            <button className="btnMiniFormCrearClase" type="button" onClick={handleCloseTopicModal}>
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