import React from 'react';
import { useNavigate } from 'react-router-dom';

function Aviso() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosalumno/clasealumno');
  };


    return (
        <div>
        <button onClick={volver}>Volver</button>
        <h1>Aviso</h1>
        <h2>Aviso tal</h2>
        </div>
    );
}

export default Aviso;