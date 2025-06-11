import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { toast } from "react-toastify";
import api from "../../api";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaFileAlt, FaUser, FaCamera, FaArrowLeft, FaDownload } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { generateRelatorioPDF } from "../../utils/pdfGenerator";

function CasoDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [caso, setCaso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingRelatorio, setGeneratingRelatorio] = useState(false);
    const { user } = useContext(AuthContext);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        fetchCaso();
    }, [id]);

    async function fetchCaso() {
        try {
            setLoading(true);
            const response = await api.get(`/casos/${id}`);
            if (response.status === 200) {
                setCaso(response.data);
                console.log('Relatório:', response.data.relatorio); // Debug
                console.log('Evidências:', response.data.evidencias); // Debug das evidências
            }
        } catch (error) {
            console.error("Erro ao buscar caso: ", error);
            if (error.response?.status === 404) {
                toast.error("Caso não encontrado");
            } else {
                toast.error("Erro ao carregar detalhes do caso");
            }
            setCaso(null); // Garantir que caso seja null para mostrar a tela de erro
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteCaso() {
        if (window.confirm('Tem certeza que deseja excluir este caso?')) {
            try {
                const response = await api.delete(`/casos/${id}`);
                if (response.status === 200) {
                    toast.success('Caso deletado com sucesso!');
                    navigate('/casos');
                }
            } catch (error) {
                toast.error('Erro ao deletar caso');
            }
        }
    }

    async function handleDeleteRelatorio(relatorioId) {
        if (window.confirm('Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.')) {
            try {
                const response = await api.delete(`/relatorios/${relatorioId}`, {
                    data: { userId: user.id, casoId: id }
                });
                if (response.status === 200) {
                    toast.success('Relatório excluído com sucesso!');
                    fetchCaso(); // Recarrega os dados do caso
                }
            } catch (error) {
                console.error('Erro ao excluir relatório:', error);
                toast.error('Erro ao excluir relatório');
            }
        }
    }

    async function handleGenerateRelatorio() {
        if (window.confirm('Deseja gerar um relatório automático usando IA? Esta ação criará um relatório baseado nos dados do caso.')) {
            setGeneratingRelatorio(true);
            try {
                const response = await api.post('/relatorios/generate', {
                    casoId: id,
                    userId: user.id
                });
                if (response.status === 201) {
                    toast.success('Relatório gerado com sucesso!');
                    fetchCaso(); // Recarrega os dados do caso
                }
            } catch (error) {
                console.error('Erro ao gerar relatório:', error);
                if (error.response?.status === 400) {
                    toast.error('Este caso já possui um relatório. Remova o relatório existente primeiro.');
                } else {
                    toast.error('Erro ao gerar relatório');
                }
            } finally {
                setGeneratingRelatorio(false);
            }
        }
    }

    // Download do relatório em PDF
    function handleDownloadRelatorioPDF() {
        if (!caso.relatorio) {
            toast.error('Nenhum relatório disponível para download');
            return;
        }
        
        try {
            generateRelatorioPDF(caso.relatorio, caso);
            toast.success('PDF do relatório gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF do relatório:', error);
            toast.error('Erro ao gerar PDF do relatório');
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Em andamento':
                return 'bg-yellow-100 text-yellow-800';
            case 'Finalizado':
                return 'bg-green-100 text-green-800';
            case 'Arquivado':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getTipoEvidenciaIcon = (tipo) => {
        switch (tipo) {
            case 'FOTO':
                return <FaCamera className="text-blue-600" />;
            case 'VÍDEO':
                return <FaCamera className="text-red-600" />;
            case 'ÁUDIO':
                return <FaFileAlt className="text-green-600" />;
            case 'DOCUMENTO':
                return <FaFileAlt className="text-purple-600" />;
            default:
                return <FaFileAlt className="text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando detalhes do caso...</p>
                    </div>
                </div>
            </PlataformContainer>
        );
    }

    if (!caso) {
        return (
            <PlataformContainer>
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Caso não encontrado</h3>
                    <p className="text-gray-500 mb-4">O caso solicitado não foi encontrado.</p>
                    <button
                        onClick={() => navigate('/casos')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar para Lista
                    </button>
                </div>
            </PlataformContainer>
        );
    }

    const formatedDataAbertura = caso.dataAbertura ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(caso.dataAbertura)) : 'Pendente';
    const formatedDataFechamento = caso.dataFechamento ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(caso.dataFechamento)) : 'Não finalizado';
    const latitude = caso.geolocalizacao?.latitude || 0;
    const longitude = caso.geolocalizacao?.longitude || 0;

    return (
        <PlataformContainer>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/casos')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft />
                        Voltar para Lista
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/casos/editar/${id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaEdit />
                            Editar
                        </button>
                        <button
                            onClick={handleDeleteCaso}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <FaTrash />
                            Excluir
                        </button>
                    </div>
                </div>

                {/* Informações Principais */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Caso #{caso._id.slice(-8)}
                            </h1>
                            <h2 className="text-lg sm:text-xl text-gray-700 mb-4">{caso.titulo}</h2>
                            <p className="text-gray-600 leading-relaxed">{caso.descricao}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(caso.status)}`}>
                                {caso.status}
                            </span>
                        </div>
                    </div>

                    {/* Detalhes do Caso */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-t border-gray-200">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Abertura</h3>
                            <p className="text-gray-900 font-medium">{formatedDataAbertura}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Conclusão</h3>
                            <p className="text-gray-900 font-medium">{formatedDataFechamento}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Localização</h3>
                            <p className="text-gray-900 font-medium">{caso.geolocalizacao ? `${latitude}, ${longitude}` : 'Pendente'}</p>
                        </div>
                    </div>

                    {/* Mapa */}
                    {caso.geolocalizacao && (
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-red-600" />
                                Localização do Caso
                            </h3>
                            <div className="h-[400px] w-full rounded-lg overflow-hidden">
                                <MapContainer center={[parseFloat(latitude), parseFloat(longitude)]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[parseFloat(latitude), parseFloat(longitude)]} icon={customIcon}>
                                        <Popup>
                                            Localização do caso
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Evidências */}
                {caso.evidencias && caso.evidencias.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <FaCamera className="text-purple-600" />
                            Evidências ({caso.evidencias.length})
                        </h3>
                            <button
                                onClick={() => navigate(`/evidencias/novo/${id}`)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaCamera />
                                Adicionar Evidência
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {caso.evidencias.map((evidencia, index) => (
                                <div key={evidencia._id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Evidência {index + 1}</h4>
                                            <div className="flex items-center gap-2">
                                        {getTipoEvidenciaIcon(evidencia.tipo)}
                                                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                    {evidencia.tipo}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/evidencias/${evidencia._id}?casoId=${id}`)}
                                            className="px-3 py-1.5 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600 transition-all duration-200 text-sm font-bold rounded-md"
                                            title="Ver dados completos da evidência"
                                        >
                                            Ver mais
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong>Data de Coleta:</strong> {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(evidencia.dataColeta))}
                                    </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Status:</strong> 
                                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                                evidencia.status === 'Concluído' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {evidencia.status}
                                            </span>
                                        </p>
                                        {evidencia.coletadaPor ? (
                                            <p className="text-sm text-gray-600">
                                                <strong>Coletada por:</strong> {evidencia.coletadaPor.email || evidencia.coletadaPor.nome || 'Usuário não identificado'}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-600">
                                                <strong>Coletada por:</strong> Não informado
                                            </p>
                                        )}
                                        {evidencia.geolocalizacao && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Localização:</strong> {evidencia.geolocalizacao.latitude}, {evidencia.geolocalizacao.longitude}
                                            </p>
                                        )}
                                        {evidencia.imagens && evidencia.imagens.length > 0 && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Imagens:</strong> {evidencia.imagens.length} arquivo(s)
                                            </p>
                                        )}
                                        {evidencia.textos && evidencia.textos.length > 0 && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Textos:</strong> {evidencia.textos.length} documento(s)
                                            </p>
                                        )}
                                        {evidencia.laudo && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Laudo:</strong> Presente
                                        </p>
                                    )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <FaCamera className="text-purple-600" />
                            Evidências
                        </h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhuma evidência cadastrada para este caso.</p>
                            <button
                                onClick={() => navigate(`/evidencias/novo/${id}`)}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                            >
                                <FaCamera />
                                Adicionar Evidência
                            </button>
                        </div>
                    </div>
                )}

                {/* Vítimas */}
                {caso.vitimas && caso.vitimas.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FaUser className="text-green-600" />
                                Vítimas ({caso.vitimas.length})
                            </h3>
                            <button
                                onClick={() => navigate(`/pacientes/novo/${id}`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaUser />
                                Adicionar Vítima
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {caso.vitimas.map((vitima, index) => (
                                <div key={vitima._id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Vítima {index + 1}</h4>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                NIC: {vitima.nic}
                                            </span>
                                        </div>
                                            <button
                                                onClick={() => navigate(`/vitimas/${vitima._id}?casoId=${id}`)}
                                            className="px-3 py-1.5 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200 text-sm font-bold rounded-md"
                                            title="Ver dados completos da vítima"
                                            >
                                            Ver mais
                                            </button>
                                    </div>
                                    <div className="space-y-2">
                                        {vitima.nome && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Nome:</strong> {vitima.nome}
                                            </p>
                                        )}
                                        {vitima.genero && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Gênero:</strong> {vitima.genero}
                                            </p>
                                        )}
                                        {vitima.idade && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Idade:</strong> {vitima.idade} anos
                                            </p>
                                        )}
                                        {vitima.corEtnia && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Cor/Etnia:</strong> {vitima.corEtnia}
                                            </p>
                                        )}
                                        {vitima.documento && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Documento:</strong> {vitima.documento}
                                            </p>
                                        )}
                                        {vitima.endereco && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Endereço:</strong> {vitima.endereco}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <FaUser className="text-green-600" />
                            Vítimas
                        </h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhuma vítima cadastrada para este caso.</p>
                            <button
                                onClick={() => navigate(`/pacientes/novo/${id}`)}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                            >
                                <FaUser />
                                Adicionar Vítima
                            </button>
                        </div>
                    </div>
                )}

                {/* Relatório */}
                {caso.relatorio ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FaFileAlt className="text-blue-600" />
                                Relatório
                            </h3>
                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={handleDownloadRelatorioPDF}
                                    className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                                    title="Download PDF"
                                >
                                    <FaDownload />
                                    <span className="hidden sm:inline">PDF</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/relatorios/editar/${caso.relatorio._id}?casoId=${id}`)}
                                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <FaEdit />
                                    <span className="hidden sm:inline">Editar</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteRelatorio(caso.relatorio._id)}
                                    className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <FaTrash />
                                    <span className="hidden sm:inline">Excluir</span>
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3">{caso.relatorio.titulo}</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                <strong>Data de Criação:</strong> {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(caso.relatorio.createdAt || caso.relatorio.dataCriacao))}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                <strong>Perito Responsável:</strong> {caso.relatorio.peritoResponsavel?.username || caso.relatorio.peritoResponsavel?.email || 'Não informado'}
                            </p>
                            <div className="max-h-60 overflow-y-auto">
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {caso.relatorio.conteudo}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <FaFileAlt className="text-blue-600" />
                            Relatório
                        </h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhum relatório criado para este caso.</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => navigate(`/relatorios/novo/${id}`)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 justify-center"
                                >
                                    <FaFileAlt />
                                    Criar Relatório Manual
                                </button>
                                <button
                                    onClick={() => handleGenerateRelatorio()}
                                    disabled={generatingRelatorio}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 justify-center"
                                >
                                    <FaFileAlt />
                                    {generatingRelatorio ? 'Gerando...' : 'Gerar com IA'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PlataformContainer>
    );
}

export default CasoDetalhes; 