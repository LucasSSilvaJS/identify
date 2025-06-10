import api from "../api";

export const createCaso = async (data) => {
    try {
        const response = await api.post('/casos', data);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar caso:", error);
        throw error;
    }
}

export const getCasos = async () => {
    try {
        const response = await api.get('/casos');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar casos:", error);
        throw error;
    }
}

export const getCasoById = async (id) => {
    try {
        const response = await api.get(`/casos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar caso:", error);
        throw error;
    }
}

export const updateCaso = async (id, data) => {
    try {
        const response = await api.put(`/casos/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar caso:", error);
        throw error;
    }
}

export const deleteCaso = async (id) => {
    try {
        const response = await api.delete(`/casos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar caso:", error);
        throw error;
    }
}
