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

  const handleDelete = () => {
    fetch('http://localhost:3001/logout', { method: 'POST' })
        .then(() => navigate('/'))
        .catch((err) => console.error('Error logging out:', err));
  };

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

  const verClase = (clase, teacher_Id) => {
    navigate('/cursosprofesor/claseprofesor', { state: { ...clase, teacher_Id } });
  };

  return (
    <div className="bodyCursos">
      <div className="headerCursos">
        <div className="columnasCursos">
          <div className="primerColumnaCursos">

          </div>
          <div className="segundaColumnaCursos">
            <h1>Hola, AgregarUsernameAqui</h1>  
            <h3>Aquí puedes ver las clases que impartes</h3>
          </div>
          <div className="tercerColumnaCursos">
            <button className="logoutButton" onClick={handleDelete}>Cerrar Sesión</button>
          </div>
        </div>
      </div>

      <div className="tableroCursos">
        <div className="acomodar" >
          {/* Add Class Rectangle */}
          <div className="agregarClase" 
            onClick={() => setShowForm(true)}
          >
            <h3>+ Agregar Clase</h3>
          </div>

          {/* Class Rectangles */}
          {classes.map((clase) => (
            <div
              key={clase.class_id}
              className="tarjetaClase"
              onClick={() => verClase(clase, teacher_Id)}
            >
              <h3>{clase.class_name}</h3>
              <p>{clase.description || 'Sin descripción'}</p>
            </div>
          ))}
        </div>

        {/* Add Class Form */}
        {showForm && (
          <div
            className="miniForm"
          >
            <h2>Crear Nueva Clase</h2>
            <form onSubmit={handleCreateClass} className="formNuevaClase">
              <input
                className="inputNuevaClase"
                type="text"
                name="className"
                placeholder="Nombre de la Clase"
                value={newClass.className}
                onChange={handleInputChange}
                required
              />
              <input
                className="inputNuevaClase"
                type="text"
                name="description"
                placeholder="Descripción"
                value={newClass.description}
                onChange={handleInputChange}
              />
              <input
                className="inputNuevaClase"
                type="text"
                name="progam"
                placeholder="Programa"
                value={newClass.progam}
                onChange={handleInputChange}
                required
              />
              <input
                className="inputNuevaClase"
                type="text"
                name="semester"
                placeholder="Semestre"
                value={newClass.semester}
                onChange={handleInputChange}
                required
              />
              <button className="btnMiniFormCrearClase" type="submit">Crear Clase</button>
              <button className="btnMiniFormCrearClase" type="button" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
      </div>

      
    </div>
  );
}

export default CursosProfesor;