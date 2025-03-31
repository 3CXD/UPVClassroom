import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function CrearClase() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.user_id;

  // Redirige si userId no está definido
  useEffect(() => {
    if (!userId) {
      alert("Error: Usuario no identificado. Redirigiendo...");
      navigate('/cursosprofesor', { state: { user_id: userId } }); // Redirige al usuario a la página anterior
    }
  }, [userId, navigate]);

  const volver = () => {
    navigate('/cursosprofesor', { state: { user_id: userId } });
  };

  const [values, setValues] = useState({
    className: '',
    userId: userId,
    classDescription: '',
    groupCode: '',
    academicProgram: '',
    semester: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`http://localhost:3001/cursosprofesor/crearclase`, {
      class_name: values.className,
      academic_program: values.academicProgram,
      group_code: values.groupCode,
      semester: values.semester,
      class_description: values.classDescription,
      teacher_id: userId
    })
    .then(res => {
      if (res.data.message === "Clase creada con éxito") {
        navigate('/cursosprofesor', { state: { user_id: userId } });
      } else {
        alert("Error al crear la clase");
      }
    })
    .catch(err => {
      console.error("Error al crear la clase:", err);
      alert("Ocurrió un error al crear la clase");
    });
  };

  return (
    <div>
      <button onClick={volver}>Volver</button>
      <h1>Crear Nueva Clase, {userId}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="className">Nombre de la clase</label>
          <input
            required
            type="text"
            placeholder="Ingresa el nombre de la clase"
            name="className"
            onChange={e => setValues({ ...values, className: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="classDescription">Descripción de la clase</label>
          <input
            required
            type="text"
            placeholder="Ingresa la descripción de la clase"
            name="classDescription"
            onChange={e => setValues({ ...values, classDescription: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="groupCode">Código del grupo</label>
          <input
            required
            type="text"
            placeholder="Ingresa el código del grupo"
            name="groupCode"
            onChange={e => setValues({ ...values, groupCode: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="academicProgram">Programa académico</label>
          <select
            required
            name="academicProgram"
            onChange={e => setValues({ ...values, academicProgram: e.target.value })}
          >
            <option value="ITIID">Ingeniería en Tecnologías de la Información e Innovación Digital</option>
            <option value="IM">Ingeniería en Mecatrónica</option>
            <option value="ISA">Ingeniería en Sistemas Automotrices</option>
            <option value="IMA">Ingeniería de Manofactura Avanzada</option>
            <option value="LA">Licenciatura en Administración</option>
            <option value="LCIA">Licenciatura en Comercio Internacional y Aduanas</option>
            <option value="MI">Maestría en Ingeniería</option>
          </select>
        </div>
        <div>
          <label htmlFor="semester">Cuatrimestre</label>
          <input
            required
            type="text"
            placeholder="Ingresa el cuatrimestre"
            name="semester"
            onChange={e => setValues({ ...values, semester: e.target.value })}
          />
        </div>
        <button type="submit">Crear clase</button>
      </form>
    </div>
  );
}

export default CrearClase;