import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tarea() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosalumno/clasealumno');
  };


    return (
        <div>
        <button onClick={volver}>Volver</button>
        <h1>Tarea tal</h1>
        <h2>Descripción tal</h2>
        <h3>Sube tu tarea: </h3>
        <input type="file"></input>
        <button>Entregar Tarea</button>
        </div>
    );
}

export default Tarea;