import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/cadastro" element={<Cadastro/>} />
      <Route path="/home" element={<Home/>} />
    </Routes>
  );
}

export default AppRoutes;
