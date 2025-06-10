import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import api from "../../api";
import { FaArrowLeft, FaUpload, FaTimes, FaFileAlt, FaCamera, FaVideo, FaMusic } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

function EvidenciaAnexos() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [evidencia, setEvidencia] = useState(null);
    const [anexoEmEdicao, setAnexoEmEdicao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);
    const { user } = useContext(AuthContext);

    // Extrair casoId da query string
    const searchParams = new URLSearchParams(location.search);
    const casoId = searchParams.get('casoId');
    const editId = searchParams.get('edit');
    const isEditing = !!editId;

    useEffect(() => {
        fetchEvidencia();
        if (isEditing) {
            fetchAnexoEmEdicao();
        }
    }, [id, editId]);

    // Buscar dados da evidência
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

    // Buscar anexo em edição
    async function fetchAnexoEmEdicao() {
        if (!editId) return;
        
        try {
            // GET /evidencias/{evidenciaId}/imagens/{imagemId}
            const response = await api.get(`/evidencias/${id}/imagens/${editId}`);
            if (response.status === 200) {
                setAnexoEmEdicao(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar anexo em edição: ", error);
            if (error.response?.status === 404) {
                toast.error("Anexo não encontrado");
                navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
            } else {
                toast.error("Erro ao carregar anexo para edição");
            }
        }
    }

    // Funções para gerenciar upload de arquivos
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    // Upload de arquivos usando as rotas corretas
    const handleUploadFiles = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Selecione pelo menos um arquivo');
            return;
        }

        setUploading(true);
        setUploadProgress({});

        try {
            if (isEditing) {
                // Modo edição - substituir arquivo existente
                // PUT /evidencias/{evidenciaId}/imagens/{imagemId}
                const formData = new FormData();
                formData.append('file', selectedFiles[0]);

                const response = await api.put(`/evidencias/${id}/imagens/${editId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, total: progress }));
                    }
                });

                if (response.status === 200) {
                    toast.success('Anexo atualizado com sucesso!');
                    setSelectedFiles([]);
                    // Redireciona de volta à evidência
                    navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
                }
            } else {
                // Modo criação - adicionar novos arquivos
                // POST /evidencias/{evidenciaId}/imagens
                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await api.post(`/evidencias/${id}/imagens`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(prev => ({ ...prev, [i]: progress }));
                        }
                    });

                    if (response.status === 201) {
                        // Atualiza o progresso total
                        const totalProgress = Math.round(((i + 1) / selectedFiles.length) * 100);
                        setUploadProgress(prev => ({ ...prev, total: totalProgress }));
                    }
                }

                toast.success('Anexos adicionados com sucesso!');
                setSelectedFiles([]);
                // Redireciona de volta à evidência
                navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            
            if (error.response?.status === 404) {
                toast.error('Evidência ou anexo não encontrado');
            } else if (error.response?.status === 500) {
                toast.error('Erro interno do servidor');
            } else if (error.response?.status === 401) {
                toast.error('Não autorizado para realizar esta operação');
            } else {
                toast.error(isEditing ? 'Erro ao atualizar anexo' : 'Erro ao fazer upload dos arquivos');
            }
        } finally {
            setUploading(false);
            setUploadProgress({});
        }
    };

    const getFileType = (file) => {
        const type = file.type.toLowerCase();
        if (type.startsWith('image/')) return 'imagem';
        if (type.startsWith('video/')) return 'video';
        if (type.startsWith('audio/')) return 'audio';
        if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'texto';
        return 'documento';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (tipo) => {
        switch (tipo) {
            case 'imagem':
                return <FaCamera className="text-blue-600" />;
            case 'video':
                return <FaVideo className="text-red-600" />;
            case 'audio':
                return <FaMusic className="text-green-600" />;
            default:
                return <FaFileAlt className="text-purple-600" />;
        }
    };

    if (loading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando anexos da evidência...</p>
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

    return (
        <PlataformContainer>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        <FaArrowLeft />
                        Voltar à Evidência
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Editar Anexo' : 'Criar Anexo'} - Evidência #{evidencia._id.slice(-8)}
                    </h1>
                </div>

                {/* Seção de Upload */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FaUpload className="text-blue-600" />
                        {isEditing ? 'Substituir Anexo' : 'Adicionar Novo Anexo'}
                    </h2>

                    {/* Informações do anexo em edição */}
                    {isEditing && anexoEmEdicao && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-medium text-blue-900 mb-2">Anexo Atual:</h3>
                            <div className="flex items-center gap-3">
                                <FaFileAlt className="text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-blue-900 font-medium">
                                        Anexo #{anexoEmEdicao._id.slice(-8)}
                                    </p>
                                    {anexoEmEdicao.imagemUrl && (
                                        <a
                                            href={anexoEmEdicao.imagemUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Ver arquivo atual
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Área de Upload */}
                    <div className="mb-6">
                        <div
                            onClick={openFileSelector}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                            <FaUpload className="mx-auto text-gray-400 text-3xl mb-4" />
                            <p className="text-gray-600 mb-2">
                                {isEditing ? 'Clique para selecionar novo arquivo' : 'Clique para selecionar arquivos'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {isEditing ? 'ou arraste e solte o novo arquivo aqui' : 'ou arraste e solte arquivos aqui'}
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple={!isEditing}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                            />
                        </div>
                    </div>

                    {/* Lista de Arquivos Selecionados */}
                    {selectedFiles.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3">
                                {isEditing ? 'Arquivo Selecionado' : `Arquivos Selecionados (${selectedFiles.length})`}
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatFileSize(file.size)} • {getFileType(file)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progresso do Upload */}
                    {uploading && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Fazendo upload...</span>
                                <span className="text-sm text-gray-500">{uploadProgress.total || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress.total || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Botão de Upload */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleUploadFiles}
                            disabled={selectedFiles.length === 0 || uploading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {isEditing ? 'Atualizando...' : 'Enviando...'}
                                </>
                            ) : (
                                <>
                                    <FaUpload />
                                    {isEditing ? 'Atualizar Anexo' : 'Enviar Anexos'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default EvidenciaAnexos; 