import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setAuthToken(token);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Verifica se a resposta contém dados válidos
      if (!response.data || !response.data.user || !response.data.user.token) {
        throw new Error("Resposta inválida do servidor");
      }
      
      const { user } = response.data;
      setAuthToken(user.token);
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        cargo: user.cargo
      };
      setUser(userData);
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro na autenticação:", error);
      // Re-lança o erro para que o componente de login possa tratá-lo
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};