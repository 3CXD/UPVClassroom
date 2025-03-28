import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CursosAlumno() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:3001/cursosalumno')
        .then(res => {
            if(res.data.Status === "Success"){
                setAuth(true)
                setName(res.data.name)
            }else {
                setAuth(false)
                setMessage(res.data.Error)
            }
        })
        .then(err => console.log(err))
    }, [])
    const handleDelete =() => {
        axios.get('http://localhost:3001/logout')
        .then(res => {
            navigate('/');
        }).catch(err => console.log(err));
    }
  const navigate = useNavigate();
  const verClase = () => {
      navigate('/cursosalumno/clasealumno');
  };
  const volver = () => {
      navigate('/');
  };


    return (
        
        <div>
            <button onClick={handleDelete}>Cerrar Sesión</button>
        <h1>Clases en Curso</h1>
        <h2>Bienvenido, {name}</h2>
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