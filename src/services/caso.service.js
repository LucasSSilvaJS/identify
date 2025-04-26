import api from "../api";

export const createCaso = async (data) => {
    try {
        const response = await api.post('/casos', data);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar caso:", error);
    }
}

export const getCasos = async () => {
    try {
        const response = await api.get('/casos');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar casos:", error);
    }
}
