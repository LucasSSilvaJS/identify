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
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user } = response.data;
      setAuthToken(user.token);
      const userData = {
        id: user.id,
        username: user.name,
        email: user.email,
        cargo: user.cargo
      };
      setUser(userData);
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(userData));
      api.defaults.headers.Authorization = `Bearer ${user.token}`;
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.Authorization = "";
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};