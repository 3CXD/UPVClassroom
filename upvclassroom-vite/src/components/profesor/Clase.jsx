import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClaseProfesor() {
  const navigate = useNavigate();
  const verTarea = () => {
      navigate('/cursosprofesor/claseprofesor/vertareaprofesor');
  };
  const verAviso = () => {
      navigate('/cursosprofesor/claseprofesor/veravisoprofesor');
  };
  const verMaterial = () => {
      navigate('/cursosprofesor/claseprofesor/vermaterialprofesor');
  };
  const volver = () => {
      navigate('/cursosprofesor');
  };


    return (
        <div>
            <button onClick={volver}>Volver</button>
            <h1>Tecnologías y Aplicaciones en Internet</h1>
            <button>Editar</button>
            <hr />
            <h2>Descripción de la clase:</h2>
            <textarea readOnly={true} value="El alumno implementará aplicaciones para internet mediante frameworks, librerías e interfaces de programación para satisfacer las necesidades del cliente."></textarea>
            <button>Editar</button>
            <hr />
            <h2>Tablón</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Tema:</th>
                        <th>Unidad 3: Desarrollo de Interfaces de Programación de Aplicaciones</th>
                        <th><button>Editar</button></th>
                    </tr>
                    <tr>
                        <td>Nuevo Material:</td>
                        <td>Proyecto Final: UPV Classroom</td>
                        <td><button onClick={verMaterial}>Ver Material</button></td>
                    </tr>
                    <tr>
                        <td>Nuevo Aviso:</td>
                        <td>Buen día a todos. Para el proyecto final, así quedó el sorteo de los equipos. Que tengan un excelente fin de semana.</td>
                        <td><button onClick={verAviso}>Ver Aviso</button></td>
                    </tr>
                    <tr>
                        <td>Nueva Tarea:</td>
                        <td>Práctica 05</td>
                        <td><button onClick={verTarea}>Ver Tarea</button></td>
                    </tr>
                    <tr>
                        <th>Tema:</th>
                        <th>Unidad 2: Placeholder</th>
                        <th><button>Editar</button></th>
                    </tr>
                    <tr>
                        <td>Nueva Tarea:</td>
                        <td>Placeholder</td>
                        <td><button onClick={verTarea}>Ver Tarea</button></td>
                    </tr>
                    <tr>
                        <td>Aviso:</td>
                        <td>Placeholder</td>
                        <td><button onClick={verAviso}>Ver Aviso</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ClaseProfesor;