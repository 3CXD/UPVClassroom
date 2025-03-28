import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const cancelar = () => {
      navigate('/');
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/register', values)
    .then(res => {
      if(res.data.Status === "Success") {
        navigate('/login')
      }else {
        alert("Error");
      }
    })
    .then(err => console.log(err));
  }


    return (
        <div>
          <button onClick={cancelar}>Cancelar Registro</button>
          <h1>Registrarse</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">Nombre</label>
              <input required type="text" placeholder="Ingresa tu nombre" name="name"
              onChange={e => setValues({...values, name: e.target.value})} className="form-control rounded~0" />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Correo Electrónico</label>
              <input required type="text" placeholder="Ingresa tu correo electrónico" name="email"
              onChange={e => setValues({...values, email: e.target.value})} className="form-control rounded~0" />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Contraseña</label>
              <input required type="password" placeholder="Ingresa tu contraseña" name="password"
              className="form-control rounded~0" />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Confirma tu contraseña</label>
              <input required type="password" placeholder="Confirma tu contraseña" name="password"
              onChange={e => setValues({...values, password: e.target.value})} className="form-control rounded~0" />
            </div>
            <button type="submit" className="btn btn-success w-100 rounded-0">Registrarse</button>
          </form>
        </div>
    );
}

export default Register;
