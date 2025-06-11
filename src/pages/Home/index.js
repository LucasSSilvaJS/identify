import { useEffect, useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from "../../services/dashboard.service";
import { toast } from "react-toastify";
import { 
    FaFolder, 
    FaSearch, 
    FaChartLine,
    FaCalendarAlt,
    FaUsers,
    FaSpinner,
    FaSync
} from "react-icons/fa";

function Home() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        estatisticasGerais: {
            totalCasos: 0,
            casosAtivos: 0,
            casosPorStatus: { emAndamento: 0, finalizados: 0, arquivados: 0 }
        },
        estatisticasEvidencias: { totalEvidencias: 0 },
        estatisticasLaudos: { totalLaudos: 0 },
        estatisticasVitimas: {
            totalVitimas: 0,
            porGenero: { masculino: 0, feminino: 0 },
            porEtnia: { preto: 0, pardo: 0, indigena: 0, amarelo: 0 },
            porIdade: {}
        },
        casosPorMes: []
    });

    const statusCasosData = [
        { name: 'Em Andamento', value: dashboardData.estatisticasGerais.casosPorStatus.emAndamento, color: '#2563EB' },
        { name: 'Finalizados', value: dashboardData.estatisticasGerais.casosPorStatus.finalizados, color: '#059669' },
        { name: 'Arquivados', value: dashboardData.estatisticasGerais.casosPorStatus.arquivados, color: '#DC2626' },
    ];

    const mesesData = dashboardData.casosPorMes.map(item => ({
        mes: item.mes,
        quantidade: item.quantidade
    }));

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await getDashboardStats({});
            setDashboardData(data);
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
            toast.error("Erro ao carregar dados do dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateData = async () => {
        setUpdating(true);
        try {
            const data = await getDashboardStats({});
            setDashboardData(data);
            toast.success("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados do dashboard:", error);
            toast.error("Erro ao atualizar dados do dashboard");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <PlataformContainer>
                <LoadingSpinner message="Carregando dashboard..." />
            </PlataformContainer>
        );
    }

    return (
        <PlataformContainer>
            <div className="flex-1 space-y-6">
                {/* Header do Dashboard */}
                <div className="flex justify-center items-center mb-6">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleUpdateData}
                            disabled={updating}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 font-medium shadow-md text-sm sm:text-base"
                            title="Atualizar dados"
                        >
                            {updating ? (
                                <FaSpinner className="inline animate-spin mr-2" />
                            ) : (
                                <FaSync className="inline mr-2" />
                            )}
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                        title="Total de Casos"
                        value={dashboardData.estatisticasGerais.totalCasos}
                        icon={FaFolder}
                        color="text-blue-600"
                    />
                    <StatCard 
                        title="Total de Evidências"
                        value={dashboardData.estatisticasEvidencias.totalEvidencias}
                        icon={FaSearch}
                        color="text-green-600"
                    />
                    <StatCard 
                        title="Total de Vítimas"
                        value={dashboardData.estatisticasVitimas.totalVitimas}
                        icon={FaUsers}
                        color="text-red-600"
                    />
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de Pizza - Status dos Casos */}
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaChartLine className="text-blue-600" />
                            Status dos Casos
                        </h2>
                        <div className="flex justify-center">
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={statusCasosData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {statusCasosData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        color: '#333'
                                    }}
                                />
                                <Legend 
                                    wrapperStyle={{
                                        color: '#333',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </div>
                    </div>

                    {/* Gráfico de Barras - Casos por Mês */}
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-green-600" />
                            Casos por Mês
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mesesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="mes" 
                                        tick={{ fill: '#374151', fontSize: 12 }}
                                        axisLine={{ stroke: '#6B7280' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#374151', fontSize: 12 }}
                                        axisLine={{ stroke: '#6B7280' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            color: '#333'
                                        }}
                                    />
                                    <Bar dataKey="quantidade" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Distribuição de Casos por Status */}
                <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaChartLine className="text-blue-600" />
                        Distribuição de Casos por Status
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-800 font-semibold text-lg">Em Andamento</p>
                                    <p className="text-blue-600 text-sm">Casos ativos</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-800 text-3xl font-bold">{dashboardData.estatisticasGerais.casosPorStatus.emAndamento}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-800 font-semibold text-lg">Finalizados</p>
                                    <p className="text-green-600 text-sm">Casos concluídos</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-800 text-3xl font-bold">{dashboardData.estatisticasGerais.casosPorStatus.finalizados}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-800 font-semibold text-lg">Arquivados</p>
                                    <p className="text-red-600 text-sm">Casos arquivados</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-red-800 text-3xl font-bold">{dashboardData.estatisticasGerais.casosPorStatus.arquivados}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default Home;

