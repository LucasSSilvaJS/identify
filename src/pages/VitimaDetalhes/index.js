import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import api from "../../api";
import { FaEdit, FaTrash, FaArrowLeft, FaUser, FaTooth } from "react-icons/fa";
import odontogramaImage from "../../assets/odontograma.jfif";

function VitimaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [vitima, setVitima] = useState(null);
    const [loading, setLoading] = useState(true);
    const [casoIdFromUrl, setCasoIdFromUrl] = useState(searchParams.get('casoId'));

    useEffect(() => {
        fetchVitima();
    }, [id]);

    async function fetchVitima() {
        try {
            setLoading(true);
            const response = await api.get(`/vitimas/${id}`);
            if (response.status === 200) {
                console.log('Dados da vítima:', response.data); // Debug
                
                // Verificar se temos o casoId na resposta
                if (!response.data.casoId && !response.data.caso) {
                    console.warn('Vítima não possui casoId ou caso na resposta:', response.data);
                }
                
                setVitima(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar vítima: ", error);
            if (error.response?.status === 404) {
                toast.error("Vítima não encontrada");
            } else {
                toast.error("Erro ao carregar detalhes da vítima");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteVitima() {
        if (window.confirm('Tem certeza que deseja excluir esta vítima? Esta ação não pode ser desfeita.')) {
            try {
                // Verificar se temos o casoId, se não, buscar na API
                let casoId = vitima.casoId || vitima.caso || casoIdFromUrl;
                if (!casoId) {
                    // Se não temos o casoId, redirecionar para a lista de casos
                    toast.error('Não foi possível identificar o caso. Redirecionando para a lista de casos.');
                    navigate('/casos');
                    return;
                }

                const response = await api.delete(`/vitimas/${id}`, {
                    data: { idCaso: casoId }
                });
                if (response.status === 200) {
                    toast.success('Vítima excluída com sucesso!');
                    navigate(`/casos/${casoId}`);
                }
            } catch (error) {
                console.error('Erro ao excluir vítima:', error);
                toast.error('Erro ao excluir vítima');
            }
        }
    }

    async function handleDeleteOdontograma(odontogramaId) {
        if (window.confirm('Tem certeza que deseja excluir este odontograma?')) {
            try {
                const response = await api.delete(`/odontogramas/${odontogramaId}`, {
                    data: { idVitima: id }
                });
                if (response.status === 200) {
                    toast.success('Odontograma excluído com sucesso!');
                    fetchVitima(); // Recarrega os dados da vítima
                }
            } catch (error) {
                console.error('Erro ao excluir odontograma:', error);
                toast.error('Erro ao excluir odontograma');
            }
        }
    }

    if (loading) {
        return (
            <PlataformContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando detalhes da vítima...</p>
                    </div>
                </div>
            </PlataformContainer>
        );
    }

    if (!vitima) {
        return (
            <PlataformContainer>
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Vítima não encontrada</h3>
                    <p className="text-gray-500 mb-4">A vítima solicitada não foi encontrada.</p>
                    <button
                        onClick={() => navigate('/casos')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar para Casos
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
                        onClick={() => {
                            const casoId = vitima.casoId || vitima.caso || casoIdFromUrl;
                            if (casoId) {
                                navigate(`/casos/${casoId}`);
                            } else {
                                toast.error('Não foi possível identificar o caso. Redirecionando para a lista de casos.');
                                navigate('/casos');
                            }
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft />
                        Voltar para Caso
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                const casoId = vitima.casoId || vitima.caso || casoIdFromUrl;
                                navigate(`/pacientes/editar/${id}?casoId=${casoId || ''}`);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaEdit />
                            Editar Vítima
                        </button>
                        <button
                            onClick={handleDeleteVitima}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <FaTrash />
                            Excluir Vítima
                        </button>
                    </div>
                </div>

                {/* Informações da Vítima */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FaUser className="text-green-600" />
                            Vítima {vitima.nic}
                        </h1>
                        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            NIC: {vitima.nic}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vitima.nome && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Nome</h3>
                                <p className="text-gray-900 font-medium">{vitima.nome}</p>
                            </div>
                        )}
                        {vitima.genero && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Gênero</h3>
                                <p className="text-gray-900 font-medium">{vitima.genero}</p>
                            </div>
                        )}
                        {vitima.idade && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Idade</h3>
                                <p className="text-gray-900 font-medium">{vitima.idade} anos</p>
                            </div>
                        )}
                        {vitima.corEtnia && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Cor/Etnia</h3>
                                <p className="text-gray-900 font-medium">{vitima.corEtnia}</p>
                            </div>
                        )}
                        {vitima.documento && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Documento</h3>
                                <p className="text-gray-900 font-medium">{vitima.documento}</p>
                            </div>
                        )}
                        {vitima.endereco && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Endereço</h3>
                                <p className="text-gray-900 font-medium">{vitima.endereco}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Odontogramas */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <FaTooth className="text-blue-600" />
                            Odontogramas {vitima.odontograma && vitima.odontograma.length > 0 && `(${vitima.odontograma.length})`}
                        </h2>
                        <button
                            onClick={() => {
                                const casoId = vitima.casoId || vitima.caso || casoIdFromUrl;
                                const novoUrl = casoId 
                                    ? `/odontogramas/novo/${id}?casoId=${casoId}`
                                    : `/odontogramas/novo/${id}`;
                                navigate(novoUrl);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <FaTooth />
                            Adicionar Odontograma
                        </button>
                    </div>

                    {vitima.odontograma && vitima.odontograma.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vitima.odontograma.map((odontograma, index) => (
                                <div key={odontograma._id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold text-gray-800">Odontograma {index + 1}</h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    const casoId = vitima.casoId || vitima.caso || casoIdFromUrl;
                                                    const editUrl = casoId 
                                                        ? `/odontogramas/editar/${odontograma._id}?vitimaId=${id}&casoId=${casoId}`
                                                        : `/odontogramas/editar/${odontograma._id}?vitimaId=${id}`;
                                                    navigate(editUrl);
                                                }}
                                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Editar odontograma"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOdontograma(odontograma._id)}
                                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                title="Excluir odontograma"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong>Identificação:</strong> {odontograma.identificacao}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Observação:</strong> {odontograma.observacao}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Nenhum odontograma cadastrado para esta vítima.</p>
                            <div className="max-w-md mx-auto">
                                <img 
                                    src={odontogramaImage} 
                                    alt="Referência Odontograma" 
                                    className="w-full h-auto rounded-lg shadow-md mb-4"
                                />
                                <p className="text-sm text-gray-500">
                                    Use a imagem acima como referência para identificar os dentes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PlataformContainer>
    );
}

export default VitimaDetalhes; 