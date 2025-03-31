<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function CursosProfesor() {
  const location = useLocation();
  const userId = location.state?.user_id;
  console.log(userId);
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [profesor, setProfesor] = useState('');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch(`http://localhost:3001/cursosprofesor?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los cursos');
        }
        const data = await response.json();
        setCursos(data.cursos);
        setProfesor(data.profesor);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCursos();
  }, [userId]);

  const verClase = () => {
    navigate('/cursosprofesor/claseprofesor');
  };

  const verAlumnos = () => {
    navigate('/cursosprofesor/claseprofesor/veralumnos');
=======
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
>>>>>>> Merge
  };

  const volver = () => {
    navigate('/');
  };

<<<<<<< HEAD
  const crearClase = () => {
    navigate('/cursosprofesor/crearclase', { state: { user_id: userId } });
=======
  const verClase = (clase, teacher_Id) => {
    navigate('/cursosprofesor/claseprofesor', { state: { ...clase, teacher_Id } });
>>>>>>> Merge
  };

  return (
    <div>
      <button onClick={volver}>Cerrar Sesión</button>
<<<<<<< HEAD
      <h1>Hola, {profesor}</h1>
      <h3>Aquí puedes ver las clases que impartes</h3>
      <button onClick={crearClase}>Crear Nueva Clase</button>
      <table>
        <thead>
          <tr>
            <th>Nombre de la Clase</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso, index) => (
            <tr key={index}>
              <td>{curso.class_name}</td>
              <td>
                <button onClick={verClase}>Ver Clase</button>
                <button onClick={verAlumnos}>Ver Alumnos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
=======
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
>>>>>>> Merge
    </div>
  );
}

export default CursosProfesor;