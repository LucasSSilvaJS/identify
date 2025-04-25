import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import NewCaso from "../pages/NewCaso";
import Caso from "../pages/Caso";
import NewEvidencia from "../pages/NewEvidencia";
import NewLaudo from "../pages/NewLaudo";
import NewPaciente from "../pages/NewPaciente";
import ProtectedRoute from "../contexts/ProtectedRoute";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/casos/novo" element={
        <ProtectedRoute>
          <NewCaso />
        </ProtectedRoute>
      } />
      <Route path="/casos" element={
        <ProtectedRoute>
          <Caso />
        </ProtectedRoute>
      } />
      <Route path="/evidencias/novo" element={
        <ProtectedRoute>
          <NewEvidencia />
        </ProtectedRoute>
      } />
      <Route path="/laudos/novo" element={
        <ProtectedRoute>
          <NewLaudo />
        </ProtectedRoute>
      } />
      <Route path="/pacientes/novo" element={
        <ProtectedRoute>
          <NewPaciente />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;
