// src/auth/AuthContext.js
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  // Função de login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/home');
    } catch (err) {
      console.error('Erro no login', err);
      alert('Credenciais inválidas');
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  // O valor que será acessado por useAuth()
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = () => useContext(AuthContext);