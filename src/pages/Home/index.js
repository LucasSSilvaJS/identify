import { useEffect, useState, useContext } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from "../../services/dashboard.service";
import { toast } from "react-toastify";
import { 
    FaFolder, 
    FaFolderOpen, 
    FaCheckCircle, 
    FaArchive, 
    FaSearch, 
    FaChartLine,
    FaCalendarAlt,
    FaUsers,
    FaFileAlt,
    FaFilter,
    FaChartBar,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaSync
} from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

function Home() {
    const { authToken, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [dashboardMode, setDashboardMode] = useState('geral'); // 'geral' ou 'avancado'
    const [showFilters, setShowFilters] = useState(false);
    const [filtros, setFiltros] = useState({
        status: '',
        genero: '',
        etnia: '',
        mesInicial: '',
        mesFinal: '',
        anoInicial: '',
        anoFinal: '',
        idadeMin: '',
        idadeMax: '',
        dataInicial: '',
        dataFinal: ''
    });
    const [dashboardData, setDashboardData] = useState({
        filtrosAplicados: {},
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

    const vitimasPorEtniaData = [
        { name: 'Preto', value: dashboardData.estatisticasVitimas.porEtnia.preto, color: '#2C3E50' },
        { name: 'Pardo', value: dashboardData.estatisticasVitimas.porEtnia.pardo, color: '#8B4513' },
        { name: 'Indígena', value: dashboardData.estatisticasVitimas.porEtnia.indigena, color: '#CD853F' },
        { name: 'Amarelo', value: dashboardData.estatisticasVitimas.porEtnia.amarelo, color: '#FFD700' },
    ];

    const mesesData = dashboardData.casosPorMes.map(item => ({
        mes: item.mes,
        quantidade: item.quantidade
    }));

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await getDashboardStats(filtros);
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
            const data = await getDashboardStats(filtros);
            setDashboardData(data);
            toast.success("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados do dashboard:", error);
            toast.error("Erro ao atualizar dados do dashboard");
        } finally {
            setUpdating(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFiltros(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const aplicarFiltros = () => {
        fetchDashboardData();
    };

    const limparFiltros = () => {
        setFiltros({
            status: '',
            genero: '',
            etnia: '',
            mesInicial: '',
            mesFinal: '',
            anoInicial: '',
            anoFinal: '',
            idadeMin: '',
            idadeMax: '',
            dataInicial: '',
            dataFinal: ''
        });
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                        <button 
                            onClick={() => setDashboardMode('geral')}
                            className={`px-4 py-3 rounded-lg transition-all font-medium text-sm sm:text-base ${
                                dashboardMode === 'geral' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title="Dashboard Geral"
                        >
                            <FaEye className="inline mr-2" />
                            Dashboard Geral
                        </button>
                        <button 
                            onClick={() => setDashboardMode('avancado')}
                            className={`px-4 py-3 rounded-lg transition-all font-medium text-sm sm:text-base ${
                                dashboardMode === 'avancado' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title="Análise Detalhada com Filtros"
                        >
                            <FaChartBar className="inline mr-2" />
                            Análise Detalhada
                    </button>
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

                {/* Filtros Aplicados - Exibição Discreta */}
                {dashboardMode === 'avancado' && dashboardData.filtrosAplicados && Object.keys(dashboardData.filtrosAplicados).length > 0 && (
                    <div className="flex justify-center mb-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {dashboardData.filtrosAplicados.status && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200">
                                    Status: {dashboardData.filtrosAplicados.status}
                                </span>
                            )}
                            {dashboardData.filtrosAplicados.genero && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full border border-green-200">
                                    Gênero: {dashboardData.filtrosAplicados.genero}
                                </span>
                            )}
                            {dashboardData.filtrosAplicados.etnia && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200">
                                    Etnia: {dashboardData.filtrosAplicados.etnia}
                                </span>
                            )}
                            {dashboardData.filtrosAplicados.periodo && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full border border-orange-200">
                                    Período: {dashboardData.filtrosAplicados.periodo.mesInicial}/{dashboardData.filtrosAplicados.periodo.anoInicial} - {dashboardData.filtrosAplicados.periodo.mesFinal}/{dashboardData.filtrosAplicados.periodo.anoFinal}
                                </span>
                            )}
                            {(filtros.dataInicial || filtros.dataFinal) && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full border border-orange-200">
                                    Período: {filtros.dataInicial ? new Date(filtros.dataInicial).toLocaleDateString('pt-BR') : 'Início'} - {filtros.dataFinal ? new Date(filtros.dataFinal).toLocaleDateString('pt-BR') : 'Fim'}
                                </span>
                            )}
                            {dashboardData.filtrosAplicados.idade && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full border border-red-200">
                                    Idade: {dashboardData.filtrosAplicados.idade.minima} - {dashboardData.filtrosAplicados.idade.maxima} anos
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Filtros Avançados */}
                {dashboardMode === 'avancado' && (
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FaChartBar className="text-blue-600" />
                                Análise Detalhada
                            </h3>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                            >
                                {showFilters ? <FaEyeSlash /> : <FaEye />}
                                {showFilters ? ' Ocultar' : ' Mostrar'} Filtros
                            </button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select 
                                        value={filtros.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">Todos</option>
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Finalizado">Finalizado</option>
                                        <option value="Arquivado">Arquivado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                                    <select 
                                        value={filtros.genero}
                                        onChange={(e) => handleFilterChange('genero', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">Todos</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Etnia</label>
                                    <select 
                                        value={filtros.etnia}
                                        onChange={(e) => handleFilterChange('etnia', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">Todas</option>
                                        <option value="preto">Preto</option>
                                        <option value="pardo">Pardo</option>
                                        <option value="indigena">Indígena</option>
                                        <option value="amarelo">Amarelo</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade Mínima</label>
                                    <input 
                                        type="number"
                                        value={filtros.idadeMin}
                                        onChange={(e) => handleFilterChange('idadeMin', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade Máxima</label>
                                    <input 
                                        type="number"
                                        value={filtros.idadeMax}
                                        onChange={(e) => handleFilterChange('idadeMax', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                                    <input 
                                        type="date"
                                        value={filtros.dataInicial || ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            if (date) {
                                                const [year, month] = date.split('-');
                                                handleFilterChange('anoInicial', year);
                                                handleFilterChange('mesInicial', month);
                                                handleFilterChange('dataInicial', date);
                                            } else {
                                                handleFilterChange('anoInicial', '');
                                                handleFilterChange('mesInicial', '');
                                                handleFilterChange('dataInicial', '');
                                            }
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                                    <input 
                                        type="date"
                                        value={filtros.dataFinal || ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            if (date) {
                                                const [year, month] = date.split('-');
                                                handleFilterChange('anoFinal', year);
                                                handleFilterChange('mesFinal', month);
                                                handleFilterChange('dataFinal', date);
                                            } else {
                                                handleFilterChange('anoFinal', '');
                                                handleFilterChange('mesFinal', '');
                                                handleFilterChange('dataFinal', '');
                                            }
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={aplicarFiltros}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                            >
                                Aplicar Filtros
                            </button>
                            <button 
                                onClick={limparFiltros}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                )}

                {/* Cards de Estatísticas - Apenas no modo geral */}
                {dashboardMode === 'geral' && (
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
                )}

                {/* Gráficos - Apenas no modo geral */}
                {dashboardMode === 'geral' && (
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
                )}

                {/* Quadro Detalhado - Dashboard Avançado - Apenas após aplicar filtros */}
                {dashboardMode === 'avancado' && dashboardData.filtrosAplicados && Object.keys(dashboardData.filtrosAplicados).length > 0 && (
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaChartBar className="text-blue-600" />
                            Análise Detalhada
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Estatísticas Gerais */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Estatísticas Gerais
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">Total de Casos:</span>
                                        <span className="font-bold text-blue-600">{dashboardData.estatisticasGerais.totalCasos}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">Casos Ativos:</span>
                                        <span className="font-bold text-green-600">{dashboardData.estatisticasGerais.casosAtivos}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">Total de Evidências:</span>
                                        <span className="font-bold text-purple-600">{dashboardData.estatisticasEvidencias.totalEvidencias}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">Total de Laudos:</span>
                                        <span className="font-bold text-orange-600">{dashboardData.estatisticasLaudos.totalLaudos}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status dos Casos */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Distribuição por Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-gray-700">Em Andamento:</span>
                                        <span className="font-bold text-blue-600">{dashboardData.estatisticasGerais.casosPorStatus.emAndamento}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-gray-700">Finalizados:</span>
                                        <span className="font-bold text-green-600">{dashboardData.estatisticasGerais.casosPorStatus.finalizados}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span className="text-gray-700">Arquivados:</span>
                                        <span className="font-bold text-red-600">{dashboardData.estatisticasGerais.casosPorStatus.arquivados}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estatísticas de Vítimas */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Estatísticas de Vítimas
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">Total de Vítimas:</span>
                                        <span className="font-bold text-red-600">{dashboardData.estatisticasVitimas.totalVitimas}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-gray-700">Masculino:</span>
                                        <span className="font-bold text-blue-600">{dashboardData.estatisticasVitimas.porGenero.masculino}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                                        <span className="text-gray-700">Feminino:</span>
                                        <span className="font-bold text-pink-600">{dashboardData.estatisticasVitimas.porGenero.feminino}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Distribuição por Etnia */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Distribuição por Etnia
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-800 text-white rounded-lg">
                                        <span>Preto:</span>
                                        <span className="font-bold">{dashboardData.estatisticasVitimas.porEtnia.preto}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                        <span className="text-gray-700">Pardo:</span>
                                        <span className="font-bold text-amber-600">{dashboardData.estatisticasVitimas.porEtnia.pardo}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                        <span className="text-gray-700">Indígena:</span>
                                        <span className="font-bold text-orange-600">{dashboardData.estatisticasVitimas.porEtnia.indigena}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                        <span className="text-gray-700">Amarelo:</span>
                                        <span className="font-bold text-yellow-600">{dashboardData.estatisticasVitimas.porEtnia.amarelo}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Casos por Mês - Tabela */}
                        {dashboardData.casosPorMes.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Casos por Mês
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Mês</th>
                                                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Ano</th>
                                                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.casosPorMes.map((item, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{item.mes}</td>
                                                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{item.ano}</td>
                                                    <td className="border border-gray-200 px-4 py-2 font-bold text-blue-600">{item.quantidade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Mensagem quando no modo filtros mas sem filtros aplicados */}
                {dashboardMode === 'avancado' && (!dashboardData.filtrosAplicados || Object.keys(dashboardData.filtrosAplicados).length === 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                        <FaChartBar className="text-blue-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Configure a Análise</h3>
                        <p className="text-blue-600">
                            Use os filtros acima para personalizar sua análise detalhada e visualize os dados específicos.
                        </p>
                    </div>
                )}
            </div>
        </PlataformContainer>
    );
}

export default Home;

