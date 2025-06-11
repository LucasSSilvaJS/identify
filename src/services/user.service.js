import api from '../api';

export const getUsers = async () => {
  try {
    const response = await api.get('/auth/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const desativarUsuario = async (userId) => {
  try {
    const response = await api.put(`/auth/users/${userId}/desativar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    throw error;
  }
};

export const reativarUsuario = async (userId) => {
  try {
    const response = await api.put(`/auth/users/${userId}/reativar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao reativar usuário:', error);
    throw error;
  }
}; 