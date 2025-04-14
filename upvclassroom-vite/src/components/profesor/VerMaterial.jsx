import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function VerMaterialProfesor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { materialId, classData, teacher_Id } = location.state || {};

  const [material, setMaterial] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await fetch(`http://localhost:3001/classes/${classData.class_id}/material/${materialId}`);
        const data = await response.json();

        if (response.ok) {
          setMaterial(data);
        } else {
          setError(data.error || "Error fetching material.");
        }
      } catch (err) {
        console.error("Error fetching material:", err);
        setError("Error fetching material.");
      }
    };

    if (materialId) {
      fetchMaterial();
    }
  }, [materialId, classData.class_id]);

  const volver = () => {
    navigate('/cursosprofesor/claseprofesor', {
      state: { 
        class_id: classData.class_id, 
        class_name: classData.class_name, 
        description: classData.description, 
        progam: classData.progam, 
        teacher_Id 
      }
    });
  };

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={volver}>Volver</button>
      </div>
    );
  }

  if (!material) {
    return <p>Loading...</p>;
  }

  return (
    <div className='bodyCursos'>
      <div className='headerCursos'>
        <div className='columnasCursos'>
          <div className="primerColumnaCursos">

          </div>
          <div className="segundaColumnaCursos">
              <h1>Detalles de material</h1>
          </div>
          <div className="tercerColumnaCursos">
            <button className='logoutButton' onClick={volver}>Regresar</button>
          </div>
        </div>
      </div>
      <div className="columnasMaterial">
        <div className="columnaMitad">
          <h1>{material.title}</h1>
          <h2>Descripción:</h2> 
          <p>{material.description}</p>
          <h3>Publicado el: {new Date(material.created_at).toLocaleString()}</h3>
        </div>
        <div className="columnaMitad">
          {material.files && material.files.length > 0 && (
            <div>
              <h3>Archivos adjuntos:</h3>
              <ul>
                {material.files.map((file, index) => (
                  <li key={index}>
                    <a
                      href={`http://localhost:3001/${file.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='btnArchivo'
                    >
                      {file.original_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
}

export default VerMaterialProfesor;