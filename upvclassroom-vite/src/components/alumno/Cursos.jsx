import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function CursosAlumno() {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const studentId = location.state?.user_id;

    console.log('StudentId', studentId);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(`http://localhost:3001/classes/${studentId}`);
                const data = await response.json();
                if (response.ok) {
                    setClasses(data);
                } else {
                    setError(data.message || 'Failed to fetch classes');
                }
            } catch (err) {
                console.error('Error fetching classes:', err);
                setError('Error fetching classes');
            }
        };

        if (studentId) {
            fetchClasses();
        }
    }, [studentId]);

    const handleDelete = () => {
        fetch('http://localhost:3001/logout', { method: 'POST' })
            .then(() => navigate('/'))
            .catch((err) => console.error('Error logging out:', err));
    };

    const verClase = (clase) => {
        navigate('/cursosalumno/clasealumno', { state: { ...clase, studentId } });
    };

    return (
        <div className="bodyCursos">
            <div className="headerCursos">
                <div className="columnasCursos">
                    <div className="primerColumnaCursos">

                    </div>
                    <div className="segundaColumnaCursos">
                        <h1>Clases en Curso</h1>
                        <h3>Aquí puedes ver las clases en las que estás inscrita o inscrito</h3>
                    </div>
                    <div className="tercerColumnaCursos">
                        <button className="logoutButton" onClick={handleDelete}>Cerrar Sesión</button>
                    </div>
                </div>
            </div>
            <div className="tableroCursosAlumno">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table className='tablaCursos'>
                    <thead className='headerTablaCursos'>
                        <tr>
                            <th>Nombre de la Clase</th>
                            <th>Profesor que Imparte</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length > 0 ? (
                            classes.map((clase) => (
                                <tr key={clase.class_id}>
                                    <td>{clase.class_name}</td>
                                    <td>{clase.teacher_name || 'Sin profesor asignado'}</td>
                                    <td>
                                        <button className="btnVer" onClick={() => verClase(clase)}>Ver Clase</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No estás inscrito en ninguna clase.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}

export default CursosAlumno;