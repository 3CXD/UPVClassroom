import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tarea() {
  const navigate = useNavigate();
  const volver = () => {
      navigate('/cursosprofesor/claseprofesor');
  };
  const configurar = () => {
      navigate('/cursosprofesor/claseprofesor/configurartarea');
  };
  const veralumno = () => {
    navigate('/cursosprofesor/claseprofesor/vertareaprofesor/veralumno')
  };


    return (
        <div>
            <button onClick={volver}>Volver</button>
            <h1>Tarea tal</h1>
            <h2>Descripción tal</h2>
            <button onClick={configurar}>Configurar Tarea</button>
            <table>
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Estado de entrega</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>César Eduardo Martínez Ibarra</td>
                        <td>No entregado</td>
                        <td><button onClick={veralumno}>Revisar</button></td>
                    </tr>
                    <tr>
                        <td>Luis Fernando Walle Zúñiga</td>
                        <td>Entregado</td>
                        <td><button onClick={veralumno}>Revisar</button></td>
                    </tr>
                    <tr>
                        <td>Ángel Ibangovich Camacho Carrión</td>
                        <td>No entregado</td>
                        <td><button onClick={veralumno}>Revisar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Tarea;