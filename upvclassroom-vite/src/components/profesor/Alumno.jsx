import React from 'react';
import { useNavigate } from 'react-router-dom';

function GestionDeAlumno() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosprofesor/claseprofesor/vertareaprofesor');
  };


    return (
        <div>
        <h1>Luis Fernando Walle Zúñiga</h1>
        <h3>Estado de la tarea: Entregada</h3>
        <h3>*archivo*</h3>
        <h3>Revisar: <input></input> / 100</h3>
        <button onClick={volver}>Revisado</button>
        <button onClick={volver}>Devolver</button>
        </div>
    );
}

export default GestionDeAlumno;