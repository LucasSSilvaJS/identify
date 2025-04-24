import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import NewCaso from "../pages/NewCaso";
import Caso from "../pages/Caso";
import NewEvidencia from "../pages/NewEvidencia";
import NewLaudo from "../pages/NewLaudo";
import NewPaciente from "../pages/NewPaciente";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/cadastro" element={<Cadastro/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/casos/novo" element={<NewCaso/>} />
      <Route path="/casos" element={<Caso/>}/>
      <Route path="/evidencias/novo" element={<NewEvidencia/>} />
      <Route path="/laudos/novo" element={<NewLaudo/>} />
      <Route path="/pacientes/novo" element={<NewPaciente/>} />
    </Routes>
  );
}

export default AppRoutes;
