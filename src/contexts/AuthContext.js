import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user } = response.data;
      setAuthToken(user.token);
      setUser({
          id: user.id,
          username: user.name,
          email: user.email,
          cargo: user.cargo
      });
      localStorage.setItem("token", user.token);
      api.defaults.headers.Authorization = `Bearer ${user.token}`;
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = "";
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
