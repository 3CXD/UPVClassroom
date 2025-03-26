import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const registrarse = () => {
      navigate('/login');
  };
  const cancelar = () => {
      navigate('/');
  };


    return (
        <div>
          <button onClick={cancelar}>Cancelar Registro</button>
        <h1>Registrarse</h1>
        <h3>Nombre</h3>
        <input></input>
        <h3>Correo Electrónico</h3>
        <input></input>
        <h3>Contraseña</h3>
        <input></input>
        <h3>Confirmar Contraseña</h3>
        <input></input>
        <button onClick={registrarse}>Registrarse</button>
        </div>
    );
}

export default Login;
