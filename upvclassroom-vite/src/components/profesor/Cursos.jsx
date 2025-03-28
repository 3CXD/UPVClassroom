import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function CursosProfesor() {

  const location = useLocation();
  const userId = location.state?.user_id; //El id del usuario que se logueó, para jalar cosas luego
  const navigate = useNavigate();
  const verClase = () => {
      navigate('/cursosprofesor/claseprofesor');
  };
  const volver = () => {
      navigate('/');
  };
  console.log("User ID:", userId);



    return (
        
        <div>
            <button onClick={volver}>Cerrar Sesión</button>
        <h1>Hola, Luis Roberto Flores de la Fuente</h1>
        <h3>Aquí puedes ver las clases que impartes</h3>
        <table>
            <thead>
            <tr>
                <th>Nombre de la Clase</th>
                <th>Accion</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Tecnologías y Aplicaciones en Internet</td>
                <td><button onClick={verClase}>Ver Clase</button></td>
            </tr>
            <tr>
                <td>Programación Web</td>
                <td><button onClick={verClase}>Ver Clase</button></td>
            </tr>
            <tr>
                <td>Fundamentos de Programación Orientada a Objetos</td>
                <td><button onClick={verClase}>Ver Clase</button></td>
            </tr>
            </tbody>
        </table>
        </div>
    );
}

export default CursosProfesor;