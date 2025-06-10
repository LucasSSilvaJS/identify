import { useContext, useState, useEffect } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api";
import { FaRobot } from "react-icons/fa";

function NewLaudo() {
    const navigate = useNavigate();
    const location = useLocation();
    const { casoId: urlCasoId, laudoId } = useParams();
    const [casoId, setCasoId] = useState(urlCasoId);
    const [evidenciaId, setEvidenciaId] = useState(null);
    const { user } = useContext(AuthContext);
    const [descricao, setDescricao] = useState('');
    const [conclusao, setConclusao] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatingIA, setGeneratingIA] = useState(false);

    // Buscar casoId e evidenciaId da URL
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const casoIdFromUrl = urlParams.get('casoId');
        const evidenciaIdFromUrl = urlParams.get('evidenciaId');
        
        if (casoIdFromUrl) {
            setCasoId(casoIdFromUrl);
        }
        if (evidenciaIdFromUrl) {
            setEvidenciaId(evidenciaIdFromUrl);
        }
    }, [location.search]);

    // Buscar dados do laudo se estiver editando
    useEffect(() => {
        const fetchLaudo = async () => {
            if (laudoId) {
                try {
                    const response = await api.get(`/laudos/${laudoId}`);
                    const laudo = response.data;
                    if (laudo) {
                        setDescricao(laudo.descricao || '');
                        setConclusao(laudo.conclusao || '');
                    }
                } catch (error) {
                    console.error("Erro ao consultar laudo:", error);
                    toast.error("Erro ao consultar laudo");
                }
            }
        };
        fetchLaudo();
    }, [laudoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (descricao && conclusao && evidenciaId) {
            try {
                const laudoData = {
                    descricao,
                    conclusao,
                    peritoResponsavel: user?.id,
                    evidenciaId
                };
                
                const response = await api.post('/laudos', laudoData);
                toast.success('Laudo criado com sucesso');
                
                // Redirecionar baseado na origem
                if (evidenciaId) {
                    navigate(`/evidencias/${evidenciaId}${casoId ? `?casoId=${casoId}` : ''}`);
                } else {
                    navigate(`/casos/${casoId}`);
                }
                
            } catch (error) {
                console.error("Erro ao salvar laudo:", error);
                toast.error("Erro ao salvar laudo");
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.warn('Preencha todos os campos obrigatórios');
            setIsLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (laudoId) {
            setIsLoading(true);
            if (descricao && conclusao) {
                try {
                    const laudoData = {
                        descricao,
                        conclusao,
                        peritoResponsavel: user?.id
                    };
                    
                    await api.put(`/laudos/${laudoId}`, laudoData);
                    toast.success('Laudo atualizado com sucesso');
                    
                    // Redirecionar baseado na origem
                    if (evidenciaId) {
                        navigate(`/evidencias/${evidenciaId}${casoId ? `?casoId=${casoId}` : ''}`);
                    } else {
                        navigate(`/casos/${casoId}`);
                    }
                    
                } catch (error) {
                    console.error("Erro ao atualizar laudo:", error);
                    toast.error("Erro ao atualizar laudo");
                } finally {
                    setIsLoading(false);
                }
            } else {
                toast.warn('Preencha todos os campos obrigatórios');
                setIsLoading(false);
            }
        }
    };

    const handleGenerateWithIA = async () => {
        if (!evidenciaId) {
            toast.error('ID da evidência não encontrado');
            return;
        }

        if (window.confirm('Deseja gerar um laudo automático usando IA? Esta ação criará um laudo baseado nos dados da evidência.')) {
            setGeneratingIA(true);
            try {
                const response = await api.post('/laudos/generate-with-ia', {
                    evidenciaId: evidenciaId,
                    peritoResponsavel: user.id
                });
                if (response.status === 201) {
                    toast.success('Laudo gerado com sucesso usando IA!');
                    
                    // Redirecionar baseado na origem
                    if (evidenciaId) {
                        navigate(`/evidencias/${evidenciaId}${casoId ? `?casoId=${casoId}` : ''}`);
                    } else {
                        navigate(`/casos/${casoId}`);
                    }
                }
            } catch (error) {
                console.error('Erro ao gerar laudo:', error);
                if (error.response?.status === 400) {
                    toast.error('Esta evidência já possui um laudo. Remova o laudo existente primeiro.');
                } else {
                    toast.error('Erro ao gerar laudo');
                }
            } finally {
                setGeneratingIA(false);
            }
        }
    };

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">
                    {laudoId ? 'Editar Laudo' : 'Novo Laudo'}
                </h1>
                <hr className="w-full border-darkblue border mb-6" />
                
                <div className="bg-blue-100 p-4 rounded-md shadow-sm mb-4 w-full">
                    <p className="text-sm font-medium text-darkblue">
                        ⚠ Preencha todos os campos para criar um laudo completo e detalhado.
                    </p>
                    <p className="text-sm text-darkblue mt-2">
                        <strong>Perito Responsável:</strong> {user?.nome || user?.email}
                    </p>
                </div>

                {/* Opções de Geração - apenas para criação */}
                {!laudoId && evidenciaId && (
                    <div className="w-full mb-6">
                        <h3 className="text-lg font-semibold text-darkblue mb-4">Opções de Geração</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleGenerateWithIA}
                                disabled={generatingIA}
                                className="p-4 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200 rounded-lg flex items-center gap-3 disabled:opacity-50"
                            >
                                <FaRobot className="text-xl" />
                                <div className="text-left">
                                    <h4 className="font-semibold">Gerar com IA</h4>
                                    <p className="text-sm text-gray-600">Usar inteligência artificial para gerar o laudo automaticamente</p>
                                </div>
                                {generatingIA && <span className="text-sm">Gerando...</span>}
                            </button>
                            <div className="p-4 border-2 border-gray-300 text-gray-600 rounded-lg flex items-center gap-3">
                                <div className="text-left">
                                    <h4 className="font-semibold">Criar Manualmente</h4>
                                    <p className="text-sm text-gray-600">Preencher o laudo manualmente usando o formulário abaixo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Descrição do Laudo *</label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none h-96 resize-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Digite a descrição detalhada do laudo..."
                            disabled={isLoading || generatingIA}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Conclusão do Laudo *</label>
                        <textarea
                            value={conclusao}
                            onChange={(e) => setConclusao(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none h-48 resize-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Digite a conclusão do laudo..."
                            disabled={isLoading || generatingIA}
                            required
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                if (evidenciaId) {
                                    navigate(`/evidencias/${evidenciaId}${casoId ? `?casoId=${casoId}` : ''}`);
                                } else {
                                    navigate(`/casos/${casoId}`);
                                }
                            }}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            disabled={isLoading || generatingIA}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={laudoId ? handleEdit : handleSubmit}
                            disabled={isLoading || generatingIA || (!descricao.trim() && !conclusao.trim())}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? 'Salvando...' : (laudoId ? 'Atualizar Laudo' : 'Criar Laudo')}
                        </button>
                    </div>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewLaudo;