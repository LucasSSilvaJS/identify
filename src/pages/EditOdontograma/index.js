import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import api from "../../api";
import { FaArrowLeft, FaTooth, FaSave } from "react-icons/fa";
import odontogramaImage from "../../assets/odontograma.jfif";

function EditOdontograma() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        identificacao: "",
        observacao: ""
    });

    const vitimaId = searchParams.get('vitimaId');
    const casoId = searchParams.get('casoId');

    // Lista de identificações válidas conforme especificado
    const identificacoesValidas = [
        18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
        48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
    ];

    useEffect(() => {
        fetchOdontograma();
    }, [id]);

    async function fetchOdontograma() {
        try {
            setInitialLoading(true);
            const response = await api.get(`/odontogramas/${id}`);
            if (response.status === 200) {
                const odontograma = response.data;
                setFormData({
                    identificacao: odontograma.identificacao.toString(),
                    observacao: odontograma.observacao
                });
            }
        } catch (error) {
            console.error("Erro ao buscar odontograma:", error);
            toast.error("Erro ao carregar dados do odontograma");
        } finally {
            setInitialLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.identificacao) {
            toast.error("Identificação é obrigatória");
            return;
        }

        if (!formData.observacao) {
            toast.error("Observação é obrigatória");
            return;
        }

        try {
            setLoading(true);
            const response = await api.put(`/odontogramas/${id}`, {
                identificacao: parseInt(formData.identificacao),
                observacao: formData.observacao
            });

            if (response.status === 200) {
                toast.success("Odontograma atualizado com sucesso!");
                const vitimaUrl = casoId ? `/vitimas/${vitimaId}?casoId=${casoId}` : `/vitimas/${vitimaId}`;
                navigate(vitimaUrl);
            }
        } catch (error) {
            console.error("Erro ao atualizar odontograma:", error);
            toast.error("Erro ao atualizar odontograma");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando dados do odontograma...</p>
                    </div>
                </div>
            </PlataformContainer>
        );
    }

    return (
        <PlataformContainer>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => {
                            const vitimaUrl = casoId ? `/vitimas/${vitimaId}?casoId=${casoId}` : `/vitimas/${vitimaId}`;
                            navigate(vitimaUrl);
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft />
                        Voltar para Vítima
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaTooth className="text-blue-600" />
                        Editar Odontograma
                    </h1>
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Identificação */}
                        <div>
                            <label htmlFor="identificacao" className="block text-sm font-medium text-gray-700 mb-2">
                                Identificação do Dente *
                            </label>
                            <select
                                id="identificacao"
                                name="identificacao"
                                value={formData.identificacao}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Selecione a identificação do dente</option>
                                {identificacoesValidas.map((denteId) => (
                                    <option key={denteId} value={denteId}>
                                        Dente {denteId}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                Selecione a identificação do dente conforme a referência abaixo
                            </p>
                        </div>

                        {/* Observação */}
                        <div>
                            <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-2">
                                Observação *
                            </label>
                            <textarea
                                id="observacao"
                                name="observacao"
                                value={formData.observacao}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Descreva as observações sobre o dente..."
                                required
                            />
                        </div>

                        {/* Imagem de Referência */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Referência Odontograma</h3>
                            <div className="max-w-md mx-auto">
                                <img 
                                    src={odontogramaImage} 
                                    alt="Referência Odontograma" 
                                    className="w-full h-auto rounded-lg shadow-md"
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Use esta imagem como referência para identificar os dentes
                                </p>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const vitimaUrl = casoId ? `/vitimas/${vitimaId}?casoId=${casoId}` : `/vitimas/${vitimaId}`;
                                    navigate(vitimaUrl);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Atualizando...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Atualizar Odontograma
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PlataformContainer>
    );
}

export default EditOdontograma; 