import React from 'react';
import { useNavigate } from 'react-router-dom';

function Material() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosalumno/clasealumno');
  };


    return (
        <div>
        <button onClick={volver}>Volver</button>
        <h1>Material</h1>
        <h2>Descripción tal</h2>
        <h3>Aquí debería haber un archivo, pero ps xD</h3>
        </div>
    );
}

export default Material;