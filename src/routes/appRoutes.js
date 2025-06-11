import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import NewCaso from "../pages/NewCaso";
import Caso from "../pages/Caso";
import CasoDetalhes from "../pages/CasoDetalhes";
import NewEvidencia from "../pages/NewEvidencia";
import EvidenciaDetalhes from "../pages/EvidenciaDetalhes";
import EvidenciaAnexos from "../pages/EvidenciaAnexos";
import EvidenciaAnexoEditar from "../pages/EvidenciaAnexoEditar";
import EvidenciaComentario from "../pages/EvidenciaComentario";
import NewLaudo from "../pages/NewLaudo";
import NewPaciente from "../pages/NewPaciente";
import NewRelatorio from "../pages/NewRelatorio";
import VitimaDetalhes from "../pages/VitimaDetalhes";
import NewOdontograma from "../pages/NewOdontograma";
import EditOdontograma from "../pages/EditOdontograma";
import AdminUsuarios from "../pages/AdminUsuarios";
import { PrivateRoute } from "../contexts/PrivateRoute";
import { PublicRoute } from "../contexts/PublicRoute";
import { AdminRoute } from "../contexts/AdminRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/cadastro" element={
        <PrivateRoute>
          <Cadastro />
        </PrivateRoute>
      } />
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/admin/usuarios" element={
        <AdminRoute>
          <AdminUsuarios />
        </AdminRoute>
      } />
      <Route path="/casos/novo" element={
        <PrivateRoute>
          <NewCaso />
        </PrivateRoute>
      } />
      <Route path="/casos/editar/:casoId" element={
        <PrivateRoute>
          <NewCaso />
        </PrivateRoute>
      } />
      <Route path="/casos" element={
        <PrivateRoute>
          <Caso />
        </PrivateRoute>
      } />
      <Route path="/casos/:id" element={
        <PrivateRoute>
          <CasoDetalhes />
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
      <Route path="/evidencias/:id" element={
        <PrivateRoute>
          <EvidenciaDetalhes />
        </PrivateRoute>
      } />
      <Route path="/evidencias/:id/anexos" element={
        <PrivateRoute>
          <EvidenciaAnexos />
        </PrivateRoute>
      } />
      <Route path="/evidencias/:id/anexos/:anexoId/editar" element={
        <PrivateRoute>
          <EvidenciaAnexoEditar />
        </PrivateRoute>
      } />
      <Route path="/evidencias/:id/comentarios" element={
        <PrivateRoute>
          <EvidenciaComentario />
        </PrivateRoute>
      } />
      <Route path="/laudos/novo/:casoId" element={
        <PrivateRoute>
          <NewLaudo />
        </PrivateRoute>
      } />
      <Route path="/laudos/editar/:laudoId" element={
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
      <Route path="/relatorios/novo/:casoId" element={
        <PrivateRoute>
          <NewRelatorio />
        </PrivateRoute>
      } />
      <Route path="/relatorios/editar/:relatorioId" element={
        <PrivateRoute>
          <NewRelatorio />
        </PrivateRoute>
      } />
      <Route path="/vitimas/:id" element={
        <PrivateRoute>
          <VitimaDetalhes />
        </PrivateRoute>
      } />
      <Route path="/odontogramas/novo/:vitimaId" element={
        <PrivateRoute>
          <NewOdontograma />
        </PrivateRoute>
      } />
      <Route path="/odontogramas/editar/:id" element={
        <PrivateRoute>
          <EditOdontograma />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;