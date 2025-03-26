import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConfigurarTarea() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosprofesor/claseprofesor/vertareaprofesor');
  };


    return (
        <div>
            <button onClick={volver}>Cancelar</button>
            <hr />
            <input value="Título del Tarea"></input>
            <button>Editar</button>
            <hr />
            <textarea value="Descripción de Tarea"></textarea>
            <button>Editar</button>
            <hr />
            Selecciona el material a subir adjunto a la tarea:
            <input type='file'></input>
            <hr />
            <button onClick={volver}>Actualizar Tarea</button>
        </div>
    );
}

export default ConfigurarTarea;