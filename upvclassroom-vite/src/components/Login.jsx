import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import homepageBackground from '../assets/homepageBackground.png';
import logo from '../assets/UPVClassroomLogo.png';

function Login() {
  const navigate = useNavigate();
    const cancelar = () => {
        navigate('/');
    };
    const [values, setValues] = useState({
      email: '',
      password: ''
    });
    const handleSubmit = (event) => {
      event.preventDefault();
      axios.post('http://localhost:3001/login', values)
        .then(res => {
          if (res.status === 200 && res.data.message === "Login successful") {
            const role = res.data.user.role;
            if (role === "student") {
              navigate('/cursosalumno', { state: { user_id: res.data.user.user_id } });
            } else if (role === "teacher") {
              navigate('/cursosprofesor', { state: { user_id: res.data.user.user_id } });
            } else {
              alert("Vete a la verga hermano, ese rol que");
            }
          } else {
            alert(res.data.error || "An error occurred during login.");
          }
        })
        .catch(err => {
          console.error(err);
          alert(err.response.data.error); //TODO: PUEDES METERLE SWALERT AQUÍ CON EL MENSAJE DE ERROR (QUEDARIA CHIDOTE)
        });
    }
    axios.defaults.withCredentials = true;

    return (
      <div className='columnasHomepage'>
        <div className='columnaIzquierdaHomepage'>
          <img src={homepageBackground} alt="Background" />
        </div>
        <div className='columnaDerechaHomepage'>
          <div className="espacioEnBlanco">
              <button className="btnCancelarLogin" onClick={cancelar}>Cancelar</button>
            </div>
          <div className='cuadroBlancoHomepage'>
            <img src={logo} alt="Logo" className='logoHomepage' />
            <h1>Iniciar Sesión</h1>
            <form className="formularioLogin" onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input required type="email" placeholder="Ingresa tu correo electrónico" name="email"
                onChange={e => setValues({...values, email: e.target.value})} className="textField" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input required type="password" placeholder="Ingresa tu contraseña" name="password"
                    onChange={e=> setValues({...values, password: e.target.value})} className='textField' />
                </div>
                <button type="submit" className="loginButton">Iniciar Sesión</button>
            </form>
        </div>
        <div className="espacioEnBlanco"></div>
        </div>
      </div>
    );
}

export default Login;
