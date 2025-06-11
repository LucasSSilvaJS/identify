import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { toast } from "react-toastify";
import api from "../../api";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaCamera, FaArrowLeft, FaUser, FaFileAlt, FaCalendarAlt, FaGlobe, FaPlus, FaComments, FaGavel, FaDownload } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { generateLaudoPDF } from "../../utils/pdfGenerator";

function EvidenciaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [evidencia, setEvidencia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingImagens, setLoadingImagens] = useState(false);
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const [loadingLaudo, setLoadingLaudo] = useState(false);
    const [generatingLaudo, setGeneratingLaudo] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [laudo, setLaudo] = useState(null);
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
                console.log('Dados da evidência:', response.data);
                console.log('Imagens da evidência:', response.data.imagens);
                console.log('Textos da evidência:', response.data.textos);
                console.log('Laudo da evidência:', response.data.laudo);
                
                // Debug detalhado das imagens
                if (response.data.imagens && response.data.imagens.length > 0) {
                    console.log('=== DEBUG IMAGENS ===');
                    response.data.imagens.forEach((imagem, index) => {
                        console.log(`Imagem ${index + 1}:`, {
                            _id: imagem._id,
                            imagemUrl: imagem.imagemUrl,
                            url: imagem.url,
                            tipo: typeof imagem,
                            keys: Object.keys(imagem),
                            valor: imagem
                        });
                    });
                    
                    // Verificar se as imagens são apenas IDs (strings) e buscar dados completos
                    setLoadingImagens(true);
                    const imagensCompletas = await Promise.all(
                        response.data.imagens.map(async (imagem) => {
                            if (typeof imagem === 'string') {
                                // Se é apenas um ID, buscar os dados completos
                                try {
                                    const imgResponse = await api.get(`/evidencias/${id}/imagens/${imagem}`);
                                    return imgResponse.data;
                                } catch (error) {
                                    console.error(`Erro ao buscar imagem ${imagem}:`, error);
                                    return { _id: imagem, imagemUrl: null };
                                }
                            }
                            return imagem;
                        })
                    );
                    
                    setEvidencia(prev => ({
                        ...prev,
                        imagens: imagensCompletas
                    }));
                    
                    console.log('Imagens completas carregadas:', imagensCompletas);
                    setLoadingImagens(false);
                } else {
                    console.log('Nenhuma imagem encontrada na evidência');
                }

                // Processar textos/comentários da evidência
                if (response.data.textos && response.data.textos.length > 0) {
                    console.log('=== DEBUG TEXTOS ===');
                    response.data.textos.forEach((texto, index) => {
                        console.log(`Texto ${index + 1}:`, {
                            _id: texto._id,
                            conteudo: texto.conteudo,
                            tipo: typeof texto,
                            keys: Object.keys(texto),
                            valor: texto
                        });
                    });
                    
                    // Verificar se os textos são apenas IDs (strings) e buscar dados completos
                    setLoadingComentarios(true);
                    const textosCompletos = await Promise.all(
                        response.data.textos.map(async (texto) => {
                            if (typeof texto === 'string') {
                                // Se é apenas um ID, buscar os dados completos
                                try {
                                    const textoResponse = await api.get(`/evidencias/${id}/textos/${texto}`);
                                    return textoResponse.data;
                                } catch (error) {
                                    console.error(`Erro ao buscar texto ${texto}:`, error);
                                    return { _id: texto, conteudo: null };
                                }
                            }
                            return texto;
                        })
                    );
                    
                    setComentarios(textosCompletos);
                    setEvidencia(prev => ({
                        ...prev,
                        textos: textosCompletos
                    }));
                    
                    console.log('Textos completos carregados:', textosCompletos);
                    setLoadingComentarios(false);
                } else {
                    console.log('Nenhum texto encontrado na evidência');
                    setComentarios([]);
                }

                // Processar laudo da evidência
                if (response.data.laudo) {
                    console.log('=== DEBUG LAUDO ===');
                    console.log('Laudo encontrado:', response.data.laudo);
                    
                    // Verificar se o laudo é apenas um ID (string) e buscar dados completos
                    setLoadingLaudo(true);
                    try {
                        if (typeof response.data.laudo === 'string') {
                            // Se é apenas um ID, buscar os dados completos
                            const laudoResponse = await api.get(`/laudos/${response.data.laudo}`);
                            setLaudo(laudoResponse.data);
                            setEvidencia(prev => ({
                                ...prev,
                                laudo: laudoResponse.data
                            }));
                        } else {
                            setLaudo(response.data.laudo);
                        }
                        console.log('Laudo completo carregado:', laudo);
                    } catch (error) {
                        console.error(`Erro ao buscar laudo:`, error);
                        setLaudo(null);
                    } finally {
                        setLoadingLaudo(false);
                    }
                } else {
                    console.log('Nenhum laudo encontrado na evidência');
                    setLaudo(null);
                }
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

    // Excluir anexo usando a API
    async function handleDeleteAnexo(anexoId) {
        if (!anexoId) {
            toast.error('ID do anexo não encontrado');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir este anexo? Esta ação não pode ser desfeita.')) {
            try {
                // DELETE /evidencias/{evidenciaId}/imagens/{imagemId}
                const response = await api.delete(`/evidencias/${id}/imagens/${anexoId}`);
                
                if (response.status === 200) {
                    toast.success('Anexo excluído com sucesso!');
                    fetchEvidencia(); // Recarrega a evidência
                }
            } catch (error) {
                console.error('Erro ao excluir anexo:', error);
                
                if (error.response?.status === 404) {
                    toast.error('Anexo não encontrado');
                } else if (error.response?.status === 500) {
                    toast.error('Erro interno do servidor ao excluir anexo');
                } else if (error.response?.status === 401) {
                    toast.error('Não autorizado para excluir este anexo');
                } else {
                    toast.error(`Erro ao excluir anexo: ${error.response?.data?.error || error.message}`);
                }
            }
        }
    }

    // Editar anexo - abrir modal ou navegar para página de edição
    async function handleEditAnexo(anexoId) {
        if (!anexoId) {
            toast.error('ID do anexo não encontrado');
            return;
        }

        // Navegar para página específica de edição de anexo
        navigate(`/evidencias/${id}/anexos/${anexoId}/editar${casoId ? `?casoId=${casoId}` : ''}`);
    }

    // Navegar para página de criação de anexo
    function handleCreateAnexo() {
        navigate(`/evidencias/${id}/anexos${casoId ? `?casoId=${casoId}` : ''}`);
    }

    // Excluir comentário
    async function handleDeleteComentario(comentarioId) {
        if (!comentarioId) {
            toast.error('ID do comentário não encontrado');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.')) {
            try {
                // DELETE /evidencias/{evidenciaId}/textos/{textoId}
                const response = await api.delete(`/evidencias/${id}/textos/${comentarioId}`);
                
                if (response.status === 200) {
                    toast.success('Comentário excluído com sucesso!');
                    fetchEvidencia(); // Recarrega a evidência completa
                }
            } catch (error) {
                console.error('Erro ao excluir comentário:', error);
                
                if (error.response?.status === 404) {
                    toast.error('Comentário não encontrado');
                } else if (error.response?.status === 500) {
                    toast.error('Erro interno do servidor ao excluir comentário');
                } else if (error.response?.status === 401) {
                    toast.error('Não autorizado para excluir este comentário');
                } else {
                    toast.error(`Erro ao excluir comentário: ${error.response?.data?.error || error.message}`);
                }
            }
        }
    }

    // Editar comentário
    function handleEditComentario(comentarioId) {
        if (!comentarioId) {
            toast.error('ID do comentário não encontrado');
            return;
        }

        // Navegar para página de edição de comentário
        navigate(`/evidencias/${id}/comentarios?edit=${comentarioId}${casoId ? `&casoId=${casoId}` : ''}`);
    }

    // Navegar para página de criação de comentário
    function handleCreateComentario() {
        navigate(`/evidencias/${id}/comentarios${casoId ? `?casoId=${casoId}` : ''}`);
    }

    // Excluir laudo
    async function handleDeleteLaudo() {
        if (!laudo) {
            toast.error('Laudo não encontrado');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir este laudo? Esta ação não pode ser desfeita.')) {
            try {
                // DELETE /laudos/{id}
                const response = await api.delete(`/laudos/${laudo._id}`, {
                    data: { evidenciaId: id }
                });
                
                if (response.status === 200) {
                    toast.success('Laudo excluído com sucesso!');
                    fetchEvidencia(); // Recarrega a evidência completa
                }
            } catch (error) {
                console.error('Erro ao excluir laudo:', error);
                
                if (error.response?.status === 404) {
                    toast.error('Laudo não encontrado');
                } else if (error.response?.status === 500) {
                    toast.error('Erro interno do servidor ao excluir laudo');
                } else if (error.response?.status === 401) {
                    toast.error('Não autorizado para excluir este laudo');
                } else {
                    toast.error(`Erro ao excluir laudo: ${error.response?.data?.error || error.message}`);
                }
            }
        }
    }

    // Editar laudo
    function handleEditLaudo() {
        if (!laudo) {
            toast.error('Laudo não encontrado');
            return;
        }

        // Navegar para página de edição de laudo
        navigate(`/laudos/editar/${laudo._id}?casoId=${casoId || evidencia?.caso}&evidenciaId=${id}`);
    }

    // Navegar para página de criação de laudo
    function handleCreateLaudo() {
        navigate(`/laudos/novo/${casoId || evidencia?.caso}?evidenciaId=${id}`);
    }

    // Gerar laudo com IA
    async function handleGenerateLaudo() {
        if (window.confirm('Deseja gerar um laudo automático usando IA? Esta ação criará um laudo baseado nos dados da evidência.')) {
            setGeneratingLaudo(true);
            try {
                const response = await api.post('/laudos/generate-with-ia', {
                    evidenciaId: id,
                    peritoResponsavel: user.id
                });
                if (response.status === 201) {
                    toast.success('Laudo gerado com sucesso!');
                    fetchEvidencia(); // Recarrega a evidência completa
                }
            } catch (error) {
                console.error('Erro ao gerar laudo:', error);
                if (error.response?.status === 400) {
                    toast.error('Esta evidência já possui um laudo. Remova o laudo existente primeiro.');
                } else {
                    toast.error('Erro ao gerar laudo');
                }
            } finally {
                setGeneratingLaudo(false);
            }
        }
    }

    // Download do laudo em PDF
    function handleDownloadLaudoPDF() {
        if (!laudo) {
            toast.error('Nenhum laudo disponível para download');
            return;
        }
        
        try {
            generateLaudoPDF(laudo, evidencia);
            toast.success('PDF do laudo gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF do laudo:', error);
            toast.error('Erro ao gerar PDF do laudo');
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
                {evidencia.imagens && evidencia.imagens.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FaFileAlt className="text-blue-600" />
                                Anexos ({evidencia.imagens.length})
                                {loadingImagens && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                )}
                            </h3>
                            <button
                                onClick={handleCreateAnexo}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaPlus />
                                Adicionar Anexo
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {evidencia.imagens.map((anexo, index) => (
                                <div key={anexo._id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Anexo {index + 1}</h4>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                ID: {anexo._id.slice(-8)}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 sm:gap-2">
                                            {anexo.imagemUrl && (
                                                <button
                                                    onClick={() => window.open(anexo.imagemUrl, '_blank')}
                                                    className="p-2 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200 rounded-md flex items-center justify-center"
                                                    title="Visualizar anexo"
                                                >
                                                    <FaFileAlt size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEditAnexo(anexo._id)}
                                                className="p-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-200 rounded-md flex items-center justify-center"
                                                title="Editar anexo"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAnexo(anexo._id)}
                                                className="p-2 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all duration-200 rounded-md flex items-center justify-center"
                                                title="Excluir anexo"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {anexo.createdAt && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Criado em:</strong> {new Intl.DateTimeFormat('pt-BR', { 
                                                    dateStyle: 'short', 
                                                    timeStyle: 'short' 
                                                }).format(new Date(anexo.createdAt))}
                                            </p>
                                        )}
                                        {anexo.updatedAt && anexo.updatedAt !== anexo.createdAt && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Atualizado em:</strong> {new Intl.DateTimeFormat('pt-BR', { 
                                                    dateStyle: 'short', 
                                                    timeStyle: 'short' 
                                                }).format(new Date(anexo.updatedAt))}
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
                            <FaFileAlt className="text-blue-600" />
                            Anexos
                            {loadingImagens && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            )}
                        </h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhum anexo encontrado para esta evidência.</p>
                            <button
                                onClick={handleCreateAnexo}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                            >
                                <FaPlus />
                                Adicionar Anexo
                            </button>
                        </div>
                    </div>
                )}

                {/* Comentários do Perito */}
                {comentarios && comentarios.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FaComments className="text-green-600" />
                                Comentários do Perito ({comentarios.length})
                                {loadingComentarios && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                )}
                            </h3>
                            <button
                                onClick={handleCreateComentario}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaPlus />
                                Adicionar Comentário
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {comentarios.map((comentario, index) => (
                                <div key={comentario._id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Comentário {index + 1}</h4>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                ID: {comentario._id.slice(-8)}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 sm:gap-2">
                                            <button
                                                onClick={() => handleEditComentario(comentario._id)}
                                                className="p-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-200 rounded-md flex items-center justify-center"
                                                title="Editar comentário"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComentario(comentario._id)}
                                                className="p-2 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all duration-200 rounded-md flex items-center justify-center"
                                                title="Excluir comentário"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-white p-3 rounded border">
                                            <p className="text-gray-800 whitespace-pre-wrap">{comentario.conteudo}</p>
                                        </div>
                                        <div className="space-y-1">
                                            {comentario.createdAt && (
                                                <p className="text-sm text-gray-600">
                                                    <strong>Criado em:</strong> {new Intl.DateTimeFormat('pt-BR', { 
                                                        dateStyle: 'short', 
                                                        timeStyle: 'short' 
                                                    }).format(new Date(comentario.createdAt))}
                                                </p>
                                            )}
                                            {comentario.updatedAt && comentario.updatedAt !== comentario.createdAt && (
                                                <p className="text-sm text-gray-600">
                                                    <strong>Atualizado em:</strong> {new Intl.DateTimeFormat('pt-BR', { 
                                                        dateStyle: 'short', 
                                                        timeStyle: 'short' 
                                                    }).format(new Date(comentario.updatedAt))}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <FaComments className="text-green-600" />
                            Comentários do Perito
                            {loadingComentarios && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            )}
                        </h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhum comentário encontrado para esta evidência.</p>
                            <button
                                onClick={handleCreateComentario}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                            >
                                <FaPlus />
                                Adicionar Comentário
                            </button>
                        </div>
                    </div>
                )}

                {/* Laudo */}
                {laudo && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FaGavel className="text-purple-600" />
                                Laudo
                            </h3>
                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={handleDownloadLaudoPDF}
                                    className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                                    title="Download PDF"
                                >
                                    <FaDownload />
                                    <span className="hidden sm:inline">PDF</span>
                                </button>
                                <button
                                    onClick={handleEditLaudo}
                                    className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <FaEdit />
                                    <span className="hidden sm:inline">Editar</span>
                                </button>
                                <button
                                    onClick={handleDeleteLaudo}
                                    className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <FaTrash />
                                    <span className="hidden sm:inline">Excluir</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-3">Descrição</h4>
                                <div className="bg-white p-3 rounded border">
                                    <p className="text-gray-800 whitespace-pre-wrap">{laudo.descricao}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-3">Conclusão</h4>
                                <div className="bg-white p-3 rounded border">
                                    <p className="text-gray-800 whitespace-pre-wrap">{laudo.conclusao}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                {laudo.createdAt && (
                                    <p className="text-sm text-gray-600">
                                        <strong>Criado em:</strong> {new Intl.DateTimeFormat('pt-BR', { 
                                            dateStyle: 'short', 
                                            timeStyle: 'short' 
                                        }).format(new Date(laudo.createdAt))}
                                    </p>
                                )}
                                {laudo.updatedAt && laudo.updatedAt !== laudo.createdAt && (
                                    <p className="text-sm text-gray-600">
                                        <strong>Atualizado em:</strong> {new Intl.DateTimeFormat('pt-BR', { 
                                            dateStyle: 'short', 
                                            timeStyle: 'short' 
                                        }).format(new Date(laudo.updatedAt))}
                                    </p>
                                )}
                                {laudo.peritoResponsavel && (
                                    <p className="text-sm text-gray-600">
                                        <strong>ID do Perito Responsável:</strong> {laudo.peritoResponsavel || 'Não informado'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Criar Laudo */}
                {!laudo && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <FaGavel className="text-purple-600" />
                            Laudo
                        </h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhum laudo criado para esta evidência.</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleCreateLaudo}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2 justify-center"
                                >
                                    <FaGavel />
                                    Criar Laudo Manual
                                </button>
                                <button
                                    onClick={handleGenerateLaudo}
                                    disabled={generatingLaudo}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 justify-center"
                                >
                                    <FaGavel />
                                    {generatingLaudo ? 'Gerando...' : 'Gerar com IA'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PlataformContainer>
    );
}

export default EvidenciaDetalhes; 