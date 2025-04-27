import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import NewCaso from "../pages/NewCaso";
import Caso from "../pages/Caso";
import NewEvidencia from "../pages/NewEvidencia";
import NewLaudo from "../pages/NewLaudo";
import NewPaciente from "../pages/NewPaciente";
import { PrivateRoute } from "../contexts/PrivateRoute";
import { PublicRoute } from "../contexts/PublicRoute";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/cadastro" element={
        <PublicRoute>
          <Cadastro />
        </PublicRoute>
      } />
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/casos/novo" element={
        <PrivateRoute>
          <NewCaso />
        </PrivateRoute>
      } />
      <Route path="/casos" element={
        <PrivateRoute>
          <Caso />
        </PrivateRoute>
      } />
      <Route path="/evidencias/novo/:casoId" element={
        <PrivateRoute>
          <NewEvidencia />
        </PrivateRoute>
      } />
      <Route path="/evidencias/editar/:evidenciaId" element={
        <PrivateRoute>
          <NewEvidencia />
        </PrivateRoute>
      } />
      <Route path="/laudos/novo" element={
        <PrivateRoute>
          <NewLaudo />
        </PrivateRoute>
      } />
      <Route path="/pacientes/novo/:casoId" element={
        <PrivateRoute>
          <NewPaciente />
        </PrivateRoute>
      } />
      <Route path="/pacientes/editar/:pacienteId" element={
        <PrivateRoute>
          <NewPaciente />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;