import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConfigurarMaterial() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosprofesor/claseprofesor/vermaterialprofesor');
  };


    return (
        <div>
            <button onClick={volver}>Cancelar</button>
            <hr />
            <input value="Título del material"></input>
            <button>Editar</button>
            <hr />
            <textarea value="Descripción de material"></textarea>
            <button>Editar</button>
            <hr />
            <input type='file'></input>
            <hr />
            <button onClick={volver}>Actualizar Material</button>
        </div>
    );
}

export default ConfigurarMaterial;