import { useEffect, useState, useMemo } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getDashboardCasos, getDashboardEvidencias } from "../../services/dashboard.service";

function Home() {
    const [activeTab, setActiveTab] = useState('casos');
    const [dashboardCasos, setDashboardCasos] = useState({});
    const [dashboardEvidencias, setDashboardEvidencias] = useState({});

    const casosData = useMemo(() => [
        { name: 'Em andamento', value: (dashboardCasos?.quantidadeStatus?.['Em andamento'] || 0) },
        { name: 'Finalizado', value: (dashboardCasos?.quantidadeStatus?.['Finalizado'] || 0) },
        { name: 'Arquivado', value: (dashboardCasos?.quantidadeStatus?.['Arquivado'] || 0) },
    ], [dashboardCasos]);

    const evidenciasData = useMemo(() => [
        { name: 'Em análise', value: (dashboardEvidencias?.quantidadeStatus?.['Em análise'] || 0) },
        { name: 'Concluído', value: (dashboardEvidencias?.quantidadeStatus?.['Concluído'] || 0) },
    ], [dashboardEvidencias]);

    const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D'];

    const data = activeTab === 'casos' ? casosData : evidenciasData;

    useEffect(() => {
        async function fetchData() {
            try {
                const [dashboardCasos, dashboardEvidencias] = await Promise.all([
                    getDashboardCasos(),
                    getDashboardEvidencias()
                ]);

                if (dashboardCasos && dashboardEvidencias) {
                    setDashboardCasos(dashboardCasos);
                    setDashboardEvidencias(dashboardEvidencias);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <PlataformContainer>
            <section className="flex-1 bg-stone-800 shadow-xl rounded-lg p-2 w-full flex flex-col items-center">
                <div className="flex flex-row gap-2 mb-2">
                    <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-black transition-all duration-200" onClick={() => setActiveTab('casos')}>
                        Casos
                    </button>
                    <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-black transition-all duration-200" onClick={() => setActiveTab('evidencias')}>
                        Evidências
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center text-white">
                    <p className="text-3xl font-bold">{activeTab === 'casos' ? (dashboardCasos?.quantidadeCasos || 0) : (dashboardEvidencias?.quantidadeEvidencias || 0)}</p>
                    <p className="text-base">Total de {activeTab === 'casos' ? 'Casos' : 'Evidências'}</p>
                </div>
                <PieChart width={330} height={330}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{backgroundColor: '#000', padding: '8px', borderRadius: '6px'}}/>
                </PieChart>
            </section>
        </PlataformContainer>
    );
}

export default Home;

