import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import TareaAlumno from './components/alumno/Tarea';
import AvisoAlumno from './components/alumno/Aviso';
import ClaseAlumno from './components/alumno/Clase';
import CursosAlumno from './components/alumno/Cursos';
import ClaseProfesor from './components/profesor/Clase';
import CursosProfesor from './components/profesor/Cursos';
import MaterialAlumno from './components/alumno/Material';
import GestionDeAlumno from './components/profesor/Alumno';
import VerTareaProfesor from './components/profesor/VerTarea';
import VerAvisoProfesor from './components/profesor/VerAviso';
import VerMaterialProfesor from './components/profesor/VerMaterial';
import ConfigurarTareaProfesor from './components/profesor/ConfigurarTarea';
import ConfigurarAvisoProfesor from './components/profesor/ConfigurarAviso';
import ConfigurarMaterialProfesor from './components/profesor/ConfigurarMaterial';
function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cursosalumno/clasealumno" element={<ClaseAlumno />} />
        <Route path="/cursosalumno" element={<CursosAlumno />} />
        <Route path="/cursosprofesor/claseprofesor" element={<ClaseProfesor />} />
        <Route path="/cursosprofesor" element={<CursosProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/vertareaprofesor/veralumno" element={<GestionDeAlumno />} />
        <Route path="/cursosalumno/clasealumno/vertareaalumno" element={<TareaAlumno />} />
        <Route path="/cursosalumno/clasealumno/veravisoalumno" element={<AvisoAlumno />} />
        <Route path="/cursosalumno/clasealumno/vermaterialalumno" element={<MaterialAlumno />} />
        <Route path="/cursosprofesor/claseprofesor/vertareaprofesor" element={<VerTareaProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/veravisoprofesor" element={<VerAvisoProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/vermaterialprofesor" element={<VerMaterialProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/configurartarea" element={<ConfigurarTareaProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/configuraraviso" element={<ConfigurarAvisoProfesor />} />
        <Route path="/cursosprofesor/claseprofesor/configurarmaterial" element={<ConfigurarMaterialProfesor />} />
      </Routes>
  );
}

export default App;
