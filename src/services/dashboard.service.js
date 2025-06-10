import api from "../api";

export const getDashboardStats = async (filtros = {}) => {
    try {
        const params = new URLSearchParams();
        
        // Adicionar filtros como query parameters
        Object.keys(filtros).forEach(key => {
            if (filtros[key] !== undefined && filtros[key] !== null && filtros[key] !== '') {
                params.append(key, filtros[key]);
            }
        });

        const response = await api.get(`/dashboard/todas-estatisticas?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard: ", error);
        throw error;
    }
}

// Funções individuais para compatibilidade (mantidas para uso específico)
export const getDashboardCasos = async () => {
    try {
        const response = await api.get('/dashboard/casos');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar quantidade de casos: ", error);
        throw error;
    }
}

export const getDashboardCasosStatus = async () => {
    try {
        const response = await api.get('/dashboard/casos/status');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar status dos casos: ", error);
        throw error;
    }
}

export const getDashboardEvidenciasTotal = async () => {
    try {
        const response = await api.get('/dashboard/evidencias/total');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar total de evidências: ", error);
        throw error;
    }
}

export const getDashboardCasosUltimosMeses = async () => {
    try {
        const response = await api.get('/dashboard/casos/ultimos-meses');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar casos dos últimos meses: ", error);
        throw error;
    }
}

export const getDashboardLaudosTotal = async () => {
    try {
        const response = await api.get('/dashboard/laudos/total');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar total de laudos: ", error);
        throw error;
    }
}
