import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const loggear = () => {
    navigate('/login');
  };
  const registrarse = () => {
    navigate('/register');
  };

  return (
      <div className='columnasHomepage'>
        <div className='columnaIzquierdaHomepage'>asd</div>
        <div className='columnaDerechaHomepage'>
          <h1>Bienvenido a UPV Classroom</h1>
          <h2>La plataforma de clases virtuales exclusiva de la Universidad Politécnica de Ciudad Victoria</h2>
          <h3>Selecciona la acción que desees hacer</h3>
          <button onClick={loggear}>Iniciar Sesión</button>
        </div>
      </div>
    
  );
}

export default Home;
