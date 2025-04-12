import React from 'react';
import { useNavigate } from 'react-router-dom';

function Alumnos() {
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
        <h1>Alumnos</h1>
        <h2>Tus alumnos de la clase Mathematics 101</h2>
        <table>
            <thead>
                <tr>
                    <th>Nombre del Alumno</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Juan Pérez</td>
                    <td><button onClick={configurar}>Dar de baja</button></td>
                </tr>
                <tr>
                    <td>María López</td>
                    <td><button onClick={configurar}>Configurar Aviso</button></td>
                </tr>
            </tbody>
        </table>
        </div>
    );
}

export default Alumnos;