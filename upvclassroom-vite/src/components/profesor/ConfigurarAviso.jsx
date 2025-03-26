import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConfigurarAviso() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosprofesor/claseprofesor/veravisoprofesor');
  };


    return (
        <div>
            <button onClick={volver}>Cancelar</button>
            <hr />
            <input value="Título del Aviso"></input>
            <button>Editar</button>
            <hr />
            <textarea value="Descripción de aviso"></textarea>
            <button>Editar</button>
            <hr />
            <button onClick={volver}>Actualizar Aviso</button>
        </div>
    );
}

export default ConfigurarAviso;