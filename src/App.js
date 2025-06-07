import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout";
import EspecialidadList from "./Components/especialidades/EspecialidadesList";
import DoctorList from "./Components/doctores/DoctorList";
import PacienteList from "./Components/paciente/PacienteList";
import CitaList from "./Components/cita/CitaList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/especialidades" replace />} />
          <Route path="especialidades" element={<EspecialidadList />} />
          <Route path="doctores" element={<DoctorList />} />
          <Route path="pacientes" element={<PacienteList />} />
          <Route path="citas" element={<CitaList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
