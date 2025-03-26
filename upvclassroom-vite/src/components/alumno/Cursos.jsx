import React from 'react';
import { useNavigate } from 'react-router-dom';

function CursosAlumno() {
  const navigate = useNavigate();
  const verClase = () => {
      navigate('/cursosalumno/clasealumno');
  };
  const volver = () => {
      navigate('/');
  };


    return (
        
        <div>
            <button onClick={volver}>Cerrar Sesión</button>
        <h1>Clases en Curso</h1>
        <h3>Aquí puedes ver las clases en las que estás inscrita o inscrito</h3>
        <table>
            <thead>
            <tr>
                <th>Nombre de la Clase</th>
                <th>Profesor que Imparte</th>
                <th>Accion</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Tecnologías y Aplicaciones en Internet</td>
                <td>Luis Roberto Flores de la Fuente</td>
                <td><button onClick={verClase}>Ver Clase</button></td>
            </tr>
            <tr>
                <td>Sistemas Inteligentes</td>
                <td>Marco Aurelio Nuño Maganda</td>
                <td><button onClick={verClase}>Ver Clase</button></td>
            </tr>
            <tr>
                <td>Diseño de Interfaces</td>
                <td>José Fidencio Lopez Luna</td>
                <td><button onClick={verClase}>Ver Clase</button></td>
            </tr>
            </tbody>
        </table>
        </div>
    );
}

export default CursosAlumno;