import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { toast } from "react-toastify";
import api from "../../api";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaCamera, FaArrowLeft, FaUser, FaFileAlt, FaCalendarAlt, FaGlobe } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

function EvidenciaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [evidencia, setEvidencia] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    // Extrair casoId da query string
    const searchParams = new URLSearchParams(location.search);
    const casoId = searchParams.get('casoId');

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        fetchEvidencia();
    }, [id]);

    async function fetchEvidencia() {
        try {
            setLoading(true);
            const response = await api.get(`/evidencias/${id}`);
            if (response.status === 200) {
                setEvidencia(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar evidência: ", error);
            if (error.response?.status === 404) {
                toast.error("Evidência não encontrada");
            } else {
                toast.error("Erro ao carregar detalhes da evidência");
            }
            setEvidencia(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEvidencia() {
        if (window.confirm('Tem certeza que deseja excluir esta evidência? Esta ação não pode ser desfeita.')) {
            try {
                const response = await api.delete(`/evidencias/${id}`, {
                    data: { 
                        userId: user.id, 
                        casoId: evidencia.caso || casoId 
                    }
                });
                if (response.status === 200) {
                    toast.success('Evidência excluída com sucesso!');
                    // Redireciona de volta ao caso se disponível
                    if (casoId) {
                        navigate(`/casos/${casoId}`);
                    } else {
                        navigate('/casos');
                    }
                }
            } catch (error) {
                console.error('Erro ao excluir evidência:', error);
                toast.error('Erro ao excluir evidência');
            }
        }
    }

    const getTipoEvidenciaIcon = (tipo) => {
        switch (tipo) {
            case 'FOTO':
                return <FaCamera className="text-blue-600" />;
            case 'VIDEO':
                return <FaCamera className="text-red-600" />;
            case 'AUDIO':
                return <FaFileAlt className="text-green-600" />;
            case 'DOCUMENTO':
                return <FaFileAlt className="text-purple-600" />;
            default:
                return <FaFileAlt className="text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Concluído':
                return 'bg-green-100 text-green-800';
            case 'Em análise':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    if (loading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando detalhes da evidência...</p>
                    </div>
                </div>
            </PlataformContainer>
        );
    }

    if (!evidencia) {
        return (
            <PlataformContainer>
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Evidência não encontrada</h3>
                    <p className="text-gray-500 mb-4">A evidência solicitada não foi encontrada.</p>
                    <button
                        onClick={() => navigate(casoId ? `/casos/${casoId}` : '/casos')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </PlataformContainer>
        );
    }

    const formatedDataColeta = evidencia.dataColeta ? new Intl.DateTimeFormat('pt-BR', { 
        dateStyle: 'full', 
        timeStyle: 'short' 
    }).format(new Date(evidencia.dataColeta)) : 'Não informado';

    const latitude = evidencia.geolocalizacao?.latitude || 0;
    const longitude = evidencia.geolocalizacao?.longitude || 0;

    return (
        <PlataformContainer>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(casoId ? `/casos/${casoId}` : '/casos')}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        <FaArrowLeft />
                        Voltar ao Caso
                    </button>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate(`/evidencias/editar/${id}`)}
                            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                        >
                            <FaEdit />
                            <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button
                            onClick={handleDeleteEvidencia}
                            className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                        >
                            <FaTrash />
                            <span className="hidden sm:inline">Excluir</span>
                        </button>
                    </div>
                </div>

                {/* Informações Principais */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                {getTipoEvidenciaIcon(evidencia.tipo)}
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    Evidência #{evidencia._id.slice(-8)}
                                </h1>
                            </div>
                            <h2 className="text-lg sm:text-xl text-gray-700 mb-2">{evidencia.tipo}</h2>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(evidencia.status)}`}>
                                {evidencia.status}
                            </span>
                        </div>
                    </div>

                    {/* Detalhes da Evidência */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4 sm:py-6 border-t border-gray-200">
                        <div className="flex items-start gap-3">
                            <FaCalendarAlt className="text-purple-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Data de Coleta</h3>
                                <p className="text-gray-900 font-medium text-sm sm:text-base">{formatedDataColeta}</p>
                            </div>
                        </div>
                        
                        {evidencia.coletadaPor && (
                            <div className="flex items-start gap-3">
                                <FaUser className="text-purple-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Coletada Por</h3>
                                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                                        {evidencia.coletadaPor.nome || evidencia.coletadaPor.email || 'Não informado'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {evidencia.geolocalizacao && (
                            <div className="flex items-start gap-3">
                                <FaGlobe className="text-purple-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Localização</h3>
                                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                                        {latitude}, {longitude}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mapa */}
                    {evidencia.geolocalizacao && (
                        <div className="pt-4 sm:pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-red-600" />
                                Localização da Evidência
                            </h3>
                            <div className="h-[300px] sm:h-[400px] w-full rounded-lg overflow-hidden">
                                <MapContainer 
                                    center={[parseFloat(latitude), parseFloat(longitude)]} 
                                    zoom={15} 
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[parseFloat(latitude), parseFloat(longitude)]} icon={customIcon}>
                                        <Popup>
                                            Localização da evidência
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Anexos */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FaFileAlt className="text-blue-600" />
                        Anexos
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Imagens */}
                        {evidencia.imagens && evidencia.imagens.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaCamera className="text-blue-600" />
                                    Imagens ({evidencia.imagens.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {evidencia.imagens.slice(0, 4).map((imagem, index) => (
                                        <img
                                            key={index}
                                            src={imagem.url || imagem}
                                            alt={`Imagem ${index + 1}`}
                                            className="w-full h-20 object-cover rounded"
                                        />
                                    ))}
                                    {evidencia.imagens.length > 4 && (
                                        <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                                            +{evidencia.imagens.length - 4} mais
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Textos */}
                        {evidencia.textos && evidencia.textos.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaFileAlt className="text-green-600" />
                                    Textos ({evidencia.textos.length})
                                </h4>
                                <div className="space-y-2">
                                    {evidencia.textos.slice(0, 3).map((texto, index) => (
                                        <div key={index} className="p-2 bg-white rounded text-sm">
                                            <p className="text-gray-700 truncate">
                                                {texto.conteudo || texto}
                                            </p>
                                        </div>
                                    ))}
                                    {evidencia.textos.length > 3 && (
                                        <p className="text-gray-500 text-sm">
                                            +{evidencia.textos.length - 3} mais textos
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Laudo */}
                        {evidencia.laudo && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaFileAlt className="text-purple-600" />
                                    Laudo
                                </h4>
                                <div className="p-3 bg-white rounded">
                                    <p className="text-sm text-gray-700 line-clamp-3">
                                        {evidencia.laudo.conteudo || evidencia.laudo}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Mensagem quando não há anexos */}
                        {(!evidencia.imagens || evidencia.imagens.length === 0) && 
                         (!evidencia.textos || evidencia.textos.length === 0) && 
                         !evidencia.laudo && (
                            <div className="col-span-full text-center py-8">
                                <p className="text-gray-600 mb-4">Nenhum anexo encontrado para esta evidência.</p>
                                <button
                                    onClick={() => navigate(`/evidencias/editar/${id}`)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                                >
                                    <FaEdit />
                                    Adicionar Anexos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default EvidenciaDetalhes; 