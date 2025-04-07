import React from 'react';
import { useNavigate } from 'react-router-dom';
import homepageBackground from '../assets/homepageBackground.png';
import logo from '../assets/UPVClassroomLogo.png';

function Home() {
  const navigate = useNavigate();

  const loggear = () => {
    navigate('/login');
  };

  return (
    <div className='columnasHomepage'>
      <div className='columnaIzquierdaHomepage'>
        <img src={homepageBackground} alt="Background" />
      </div>
      <div className='columnaDerechaHomepage'>
        <div className='cuadroBlancoHomepage'>
          <img src={logo} alt="Logo" className='logoHomepage' />
          <h1>Bienvenido a UPV Classroom</h1>
          <h3>La plataforma de clases virtuales exclusiva de la Universidad Politécnica de Ciudad Victoria</h3>
          <button className="loginButton" onClick={loggear}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
