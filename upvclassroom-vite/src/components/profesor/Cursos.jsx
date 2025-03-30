import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CursosProfesor() {
  const location = useLocation();
  const teacher_Id = location.state?.user_id;
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({
    className: '',
    description: '',
    progam: '',
    semester: '',
  });
  const [error, setError] = useState(null);

  const handleDelete =() => {
    axios.post('http://localhost:3001/logout')
    .then(res => {
        navigate('/');
    }).catch(err => console.log(err));
}

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/${teacher_Id}`);
        const data = await response.json();
        if (response.ok) {
          setClasses(data);
        } else {
          setError(data.message || 'Failed to fetch classes');
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Error fetching classes');
      }
    };

    if (teacher_Id) {
      fetchClasses();
    }
  }, [teacher_Id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/classes/createclass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newClass, teacher_Id }),
      });
      const data = await response.json();
      if (response.ok) {
        setClasses((prev) => [...prev, data]); 
        setNewClass({ className: '', description: '', progam: '', semester: '' });
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to create class');
      }
    } catch (err) {
      console.error('Error creating class:', err);
      setError('Error creating class');
    }
  };

  const volver = () => {
    navigate('/');
  };

  const verClase = (clase, teacher_Id) => {
    navigate('/cursosprofesor/claseprofesor', { state: { ...clase, teacher_Id } });
  };

  return (
    <div>
      <button onClick={volver}>Cerrar Sesión</button>
      <h1>Hola, AgregarUsernameAqui</h1>  
      <h3>Aquí puedes ver las clases que impartes</h3>

      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Add Class Rectangle */}
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
          <h3>+ Agregar Clase</h3>
        </div>

        {/* Class Rectangles */}
        {classes.map((clase) => (
          <div
            key={clase.class_id}
            style={{
              border: '1px solid black',
              padding: '20px',
              width: '200px',
              textAlign: 'center',
            }}
          >
            <h3>{clase.class_name}</h3>
            <p>{clase.description || 'Sin descripción'}</p>
            <button onClick={() => verClase(clase, teacher_Id)}>Ver Clase</button>
          </div>
        ))}
      </div>

      {/* Add Class Form */}
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
          <h2>Crear Nueva Clase</h2>
          <form onSubmit={handleCreateClass}>
            <input
              type="text"
              name="className"
              placeholder="Nombre de la Clase"
              value={newClass.className}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Descripción"
              value={newClass.description}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="progam"
              placeholder="Programa"
              value={newClass.progam}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="semester"
              placeholder="Semestre"
              value={newClass.semester}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Crear Clase</button>
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

export default CursosProfesor;