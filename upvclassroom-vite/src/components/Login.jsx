import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            //console.log(res.data.user.user_id)
            if (role === "student") {
              navigate('/cursosalumno', { state: { user_id: res.data.user.user_id } });
            } else if (role === "teacher") {
              navigate('/cursosprofesor', { state: { user_id: res.data.user.user_id } });
            } else {
              alert("Rol no reconocido.");
            }
          } else {
            alert(res.data.error || "Error al iniciar sesión.");
          }
        })
        .catch(err => {
          console.error("Error al iniciar sesión:", err);
          alert(err.response?.data?.error || "Error al iniciar sesión.");
        });
    }
    axios.defaults.withCredentials = true;

    return (
        <div>
            <button onClick={cancelar}>Cancelar</button>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="email">Correo electrónico</label>
                <input required type="email" placeholder="Ingresa tu correo electrónico" name="email"
                onChange={e => setValues({...values, email: e.target.value})} className="form-control rounded~0" />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input required type="password" placeholder="Ingresa tu contraseña" name="password"
                    onChange={e=> setValues({...values, password: e.target.value})} className='form-control rounded~0' />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login;