import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando las vistas
import Login from './components/Login';
import Homepage from './components/Homepage';

//Vistas para el alumno
import TareaAlumno from './components/alumno/Tarea';
import AvisoAlumno from './components/alumno/Aviso';
import ClaseAlumno from './components/alumno/Clase';
import CursosAlumno from './components/alumno/Cursos';
import MaterialAlumno from './components/alumno/Material';

//Vistas para el profesor
import ClaseProfesor from './components/profesor/Clase';
import CursosProfesor from './components/profesor/Cursos';
import GestionDeAlumno from './components/profesor/Alumno';
import VerTareaProfesor from './components/profesor/VerTarea';
import VerAvisoProfesor from './components/profesor/VerAviso';
import VerMaterialProfesor from './components/profesor/VerMaterial';
import ConfigurarTareaProfesor from './components/profesor/ConfigurarTarea';
import ConfigurarAvisoProfesor from './components/profesor/ConfigurarAviso';
import ConfigurarMaterialProfesor from './components/profesor/ConfigurarMaterial';
import VerAlumnos from './components/profesor/VerAlumnos';
import CrearClase from './components/profesor/CrearClase';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/cursosalumno" element={<CursosAlumno />} />
        <Route path="/cursosalumno/clasealumno" element={<ClaseAlumno />} />
        <Route path="/cursosalumno/clasealumno/vertareaalumno" element={<TareaAlumno />} />
        <Route path="/cursosalumno/clasealumno/veravisoalumno" element={<AvisoAlumno />} />
        <Route path="/cursosalumno/clasealumno/vermaterialalumno" element={<MaterialAlumno />} />

        <Route path="/cursosprofesor" element={<CursosProfesor />} />
        <Route path="/cursosprofesor/crearclase" element={<CrearClase />} />
        <Route path="/cursosprofesor/claseprofesor" element={<ClaseProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/vertareaprofesor" element={<VerTareaProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/vertareaprofesor/veralumno" element={<GestionDeAlumno />} />
        <Route path="/cursosprofesor/claseprofesor/veravisoprofesor" element={<VerAvisoProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/veravisoprofesor/configuraraviso" element={<ConfigurarAvisoProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/vermaterialprofesor" element={<VerMaterialProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/vermaterialprofesor/configurarmaterial" element={<ConfigurarMaterialProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/configurartarea" element={<ConfigurarTareaProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/veralumnos" element={<VerAlumnos />} />
      </Routes>
  );
}

export default App;
