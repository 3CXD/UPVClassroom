import React from 'react';
import { useNavigate } from 'react-router-dom';

function Aviso() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosprofesor/claseprofesor');
  };
  const configurar = () => {
      navigate('/cursosprofesor/claseprofesor/configuraraviso');
  };


    return (
        <div>
        <button onClick={volver}>Volver</button>
        <h1>Aviso</h1>
        <h2>Aviso tal</h2>
        <button onClick={configurar}>Configurar Aviso</button>
        </div>
    );
}

export default Aviso;