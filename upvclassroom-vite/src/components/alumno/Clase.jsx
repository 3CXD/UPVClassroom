import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClaseAlumno() {
  const navigate = useNavigate();
  const verTarea = () => {
      navigate('/cursosalumno/clasealumno/vertareaalumno');
  };
  const verAviso = () => {
      navigate('/cursosalumno/clasealumno/veravisoalumno');
  };
  const verMaterial = () => {
      navigate('/cursosalumno/clasealumno/vermaterialalumno');
  };
  const volver = () => {
      navigate('/cursosalumno');
  };


    return (
        <div>
            <button onClick={volver}>Volver</button>
            <h1>Sistemas Inteligentes</h1>
            <h2>Profesor que imparte la clase:</h2>
            <h3>Doctor Marco Aurelio Nuño Maganda</h3>
            <h2>Descripción de la clase:</h2>
            <h3>Se trata del manejo del lenguaje Python para la creación de sistemas computacionales inteligentes, o hablando de en palabras simples, inteligencia artificial. Se tratan temas como OpenCV, YOLO, redes neuronales, etc.</h3>
            <h2>Tablón</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Nuevo Aviso:</td>
                        <td>El día de hoy no hay clase en ambos grupos. Nos vemos el día Martes 25/Marzo</td>
                        <td><button onClick={verAviso}>Ver Aviso</button></td>
                    </tr>
                    <tr>
                        <th>Tema:</th>
                        <th>Unidad 2: Datasets</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Nueva Tarea:</td>
                        <td>Creación de Dataset de Libros de Computación</td>
                        <td><button onClick={verTarea}>Ver Tarea</button></td>
                    </tr>
                    <tr>
                        <td>Nuevo Material:</td>
                        <td>Les adjunto los libros con los que se va a trabajar posteriormente</td>
                        <td><button onClick={verMaterial}>Ver Material</button></td>
                    </tr>
                    <tr>
                        <th>Tema:</th>
                        <th>Unidad 1: OpenCV</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Nueva Tarea:</td>
                        <td>Desarrolla un programa tal de tal</td>
                        <td><button onClick={verTarea}>Ver Tarea</button></td>
                    </tr>
                    <tr>
                        <td>Nuevo Aviso:</td>
                        <td>Bienvenidos sean todos a este curso</td>
                        <td><button onClick={verAviso}>Ver Aviso</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ClaseAlumno;