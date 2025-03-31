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
  };

  const volver = () => {
    navigate('/');
  };

  const crearClase = () => {
    navigate('/cursosprofesor/crearclase', { state: { user_id: userId } });
  };

  return (
    <div>
      <button onClick={volver}>Cerrar Sesión</button>
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
    </div>
  );
}

export default CursosProfesor;