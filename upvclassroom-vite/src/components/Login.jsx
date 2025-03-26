import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
    const loggear = () => {
        navigate('/cursosalumno');
    };
    const cancelar = () => {
        navigate('/');
    };


    return (
        <div>
            <button onClick={cancelar}>Cancelar</button>
            <h1>Iniciar Sesión</h1>
            <h3>Correo Electrónico</h3>
            <input></input>
            <h3>Contraseña</h3>
            <input></input>
            <button onClick={loggear}>Iniciar Sesión</button>
        </div>
    );
}

export default Login;
