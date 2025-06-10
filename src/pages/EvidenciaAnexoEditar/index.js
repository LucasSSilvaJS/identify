import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import api from "../../api";
import { FaArrowLeft, FaUpload, FaTimes, FaFileAlt, FaCamera, FaVideo, FaMusic, FaSave } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

function EvidenciaAnexoEditar() {
    const { id, anexoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [evidencia, setEvidencia] = useState(null);
    const [anexo, setAnexo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const { user } = useContext(AuthContext);

    // Extrair casoId da query string
    const searchParams = new URLSearchParams(location.search);
    const casoId = searchParams.get('casoId');

    useEffect(() => {
        fetchEvidencia();
        fetchAnexo();
    }, [id, anexoId]);

    // Buscar dados da evidência
    async function fetchEvidencia() {
        try {
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
        }
    }

    // Buscar dados do anexo
    async function fetchAnexo() {
        try {
            console.log('Buscando anexo:', anexoId);
            const response = await api.get(`/evidencias/${id}/imagens/${anexoId}`);
            if (response.status === 200) {
                console.log('Anexo carregado:', response.data);
                setAnexo(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar anexo: ", error);
            if (error.response?.status === 404) {
                toast.error("Anexo não encontrado");
                navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
            } else {
                toast.error("Erro ao carregar anexo para edição");
            }
        } finally {
            setLoading(false);
        }
    }

    // Funções para gerenciar upload de arquivo
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    // Atualizar anexo
    const handleUpdateAnexo = async () => {
        if (!selectedFile) {
            toast.error('Selecione um arquivo para substituir o atual');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await api.put(`/evidencias/${id}/imagens/${anexoId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            if (response.status === 200) {
                toast.success('Anexo atualizado com sucesso!');
                // Redireciona de volta à evidência
                navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar anexo:', error);
            
            if (error.response?.status === 404) {
                toast.error('Evidência ou anexo não encontrado');
            } else if (error.response?.status === 500) {
                toast.error('Erro interno do servidor');
            } else if (error.response?.status === 401) {
                toast.error('Não autorizado para realizar esta operação');
            } else {
                toast.error('Erro ao atualizar anexo');
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
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

    // Função para formatar data com validação
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Data inválida';
            }
            return new Intl.DateTimeFormat('pt-BR', { 
                dateStyle: 'short', 
                timeStyle: 'short' 
            }).format(date);
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    if (loading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando anexo...</p>
                    </div>
                </div>
            </PlataformContainer>
        );
    }

    if (!evidencia || !anexo) {
        return (
            <PlataformContainer>
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Anexo não encontrado</h3>
                    <p className="text-gray-500 mb-4">O anexo solicitado não foi encontrado.</p>
                    <button
                        onClick={() => navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Voltar à Evidência
                    </button>
                </div>
            </PlataformContainer>
        );
    }

    // Validação adicional para evitar erros de renderização
    if (!anexo._id) {
        console.error('Anexo sem ID válido:', anexo);
        return (
            <PlataformContainer>
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Dados do anexo inválidos</h3>
                    <p className="text-gray-500 mb-4">Os dados do anexo estão corrompidos ou incompletos.</p>
                    <button
                        onClick={() => navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Voltar à Evidência
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
                        Editar Anexo - Evidência #{evidencia._id.slice(-8)}
                    </h1>
                </div>

                {/* Informações do Anexo Atual */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FaFileAlt className="text-blue-600" />
                        Anexo Atual
                    </h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <FaFileAlt className="text-blue-600 text-xl" />
                            <div className="flex-1">
                                <h3 className="font-medium text-blue-900">
                                    Anexo #{anexo._id ? anexo._id.slice(-8) : 'N/A'}
                                </h3>
                                {anexo.imagemUrl && (
                                    <a
                                        href={anexo.imagemUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-1"
                                    >
                                        Ver arquivo atual →
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Área de Upload do Novo Arquivo */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FaUpload className="text-green-600" />
                            Substituir por Novo Arquivo
                        </h3>

                        <div
                            onClick={openFileSelector}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                        >
                            <FaUpload className="mx-auto text-gray-400 text-3xl mb-4" />
                            <p className="text-gray-600 mb-2">
                                Clique para selecionar novo arquivo
                            </p>
                            <p className="text-sm text-gray-500">
                                ou arraste e solte o novo arquivo aqui
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                            />
                        </div>
                    </div>

                    {/* Arquivo Selecionado */}
                    {selectedFile && (
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3">Novo Arquivo Selecionado:</h4>
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatFileSize(selectedFile.size)} • {getFileType(selectedFile)}
                                    </p>
                                </div>
                                <button
                                    onClick={removeFile}
                                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Progresso do Upload */}
                    {uploading && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Atualizando anexo...</span>
                                <span className="text-sm text-gray-500">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleUpdateAnexo}
                            disabled={!selectedFile || uploading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Atualizando...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Atualizar Anexo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default EvidenciaAnexoEditar; 