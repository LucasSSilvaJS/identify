import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import api from "../../api";
import { FaArrowLeft, FaSave, FaTimes, FaFileAlt, FaUser } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

function EvidenciaComentario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [evidencia, setEvidencia] = useState(null);
    const [comentarioEmEdicao, setComentarioEmEdicao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        conteudo: ''
    });
    const { user } = useContext(AuthContext);

    // Extrair casoId e editId da query string
    const searchParams = new URLSearchParams(location.search);
    const casoId = searchParams.get('casoId');
    const editId = searchParams.get('edit');
    const isEditing = !!editId;

    useEffect(() => {
        fetchEvidencia();
        if (isEditing) {
            fetchComentarioEmEdicao();
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

    // Buscar comentário em edição
    async function fetchComentarioEmEdicao() {
        if (!editId) return;
        
        try {
            // GET /evidencias/{evidenciaId}/textos/{textoId}
            const response = await api.get(`/evidencias/${id}/textos/${editId}`);
            if (response.status === 200) {
                setComentarioEmEdicao(response.data);
                setFormData({
                    conteudo: response.data.conteudo || ''
                });
            }
        } catch (error) {
            console.error("Erro ao buscar comentário em edição: ", error);
            if (error.response?.status === 404) {
                toast.error("Comentário não encontrado");
                navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
            } else {
                toast.error("Erro ao carregar comentário para edição");
            }
        }
    }

    // Função para salvar comentário
    const handleSaveComentario = async () => {
        if (!formData.conteudo.trim()) {
            toast.error('O conteúdo do comentário é obrigatório');
            return;
        }

        setSaving(true);

        try {
            if (isEditing) {
                // Modo edição - atualizar comentário existente
                // PUT /evidencias/{evidenciaId}/textos/{textoId}
                const response = await api.put(`/evidencias/${id}/textos/${editId}`, {
                    conteudo: formData.conteudo
                });

                if (response.status === 200) {
                    toast.success('Comentário atualizado com sucesso!');
                    // Redireciona de volta à evidência
                    navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
                }
            } else {
                // Modo criação - criar novo comentário
                // POST /evidencias/{evidenciaId}/textos
                const response = await api.post(`/evidencias/${id}/textos`, {
                    conteudo: formData.conteudo
                });

                if (response.status === 201) {
                    toast.success('Comentário criado com sucesso!');
                    // Redireciona de volta à evidência
                    navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
                }
            }
        } catch (error) {
            console.error('Erro ao salvar comentário:', error);
            
            if (error.response?.status === 404) {
                toast.error('Evidência ou comentário não encontrado');
            } else if (error.response?.status === 500) {
                toast.error('Erro interno do servidor');
            } else if (error.response?.status === 401) {
                toast.error('Não autorizado para realizar esta operação');
            } else {
                toast.error(isEditing ? 'Erro ao atualizar comentário' : 'Erro ao criar comentário');
            }
        } finally {
            setSaving(false);
        }
    };

    // Função para cancelar
    const handleCancel = () => {
        navigate(`/evidencias/${id}${casoId ? `?casoId=${casoId}` : ''}`);
    };

    if (loading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando...</p>
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
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        <FaArrowLeft />
                        Voltar à Evidência
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Editar Comentário' : 'Novo Comentário'}
                    </h1>
                </div>

                {/* Informações da Evidência */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FaFileAlt className="text-purple-600" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Evidência #{evidencia._id.slice(-8)}
                            </h2>
                            <p className="text-gray-600">{evidencia.tipo}</p>
                        </div>
                    </div>
                </div>

                {/* Formulário do Comentário */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">
                                Comentário do Perito *
                            </label>
                            <textarea
                                id="conteudo"
                                value={formData.conteudo}
                                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                                placeholder="Digite o comentário do perito sobre esta evidência..."
                                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                disabled={saving}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Este comentário será associado à evidência e poderá ser editado posteriormente.
                            </p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <FaTimes />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveComentario}
                                disabled={saving || !formData.conteudo.trim()}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave />
                                {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default EvidenciaComentario; 