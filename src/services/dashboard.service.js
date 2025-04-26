import api from "../api";

export const getDashboardCasos = async () => {
    try {
        const response = await api.get('/dashboard/casos');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dashboard: ", error);
    }
}

export const getDashboardEvidencias = async () => {
    try {
        const response = await api.get('/dashboard/evidencias');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dashboard: ", error);
    }
}
