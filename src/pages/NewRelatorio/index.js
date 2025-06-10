import { useEffect, useState, useContext } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

function NewRelatorio() {
    const navigate = useNavigate();
    const { casoId: urlCasoId, relatorioId } = useParams();
    const [casoId, setCasoId] = useState(urlCasoId);
    const { user } = useContext(AuthContext);
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [loading, setLoading] = useState(false);

    // Buscar casoId da URL se estiver editando
    useEffect(() => {
        if (relatorioId && !casoId) {
            const urlParams = new URLSearchParams(window.location.search);
            const casoIdFromUrl = urlParams.get('casoId');
            if (casoIdFromUrl) {
                setCasoId(casoIdFromUrl);
            }
        }
    }, [relatorioId, casoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo || !conteudo) {
            toast.warn('Preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);
        try {
            const relatorioData = {
                titulo,
                conteudo,
                peritoResponsavel: user.id,
                userId: user.id,
                casoId
            };

            await api.post('/relatorios', relatorioData);
            toast.success('Relatório criado com sucesso');
            navigate(`/casos/${casoId}`);
        } catch (error) {
            console.error("Erro ao criar relatório:", error);
            if (error.response?.status === 400) {
                toast.error('Este caso já possui um relatório. Remova o relatório existente primeiro.');
            } else {
                toast.error("Erro ao criar relatório");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!titulo || !conteudo) {
            toast.warn('Preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);
        try {
            const relatorioData = {
                titulo,
                conteudo,
                peritoResponsavel: user.id
            };

            await api.put(`/relatorios/${relatorioId}`, relatorioData);
            toast.success('Relatório atualizado com sucesso');
            navigate(`/casos/${casoId}`);
        } catch (error) {
            console.error("Erro ao atualizar relatório:", error);
            toast.error("Erro ao atualizar relatório");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchRelatorio = async () => {
            if (relatorioId) {
                try {
                    const response = await api.get(`/relatorios/${relatorioId}`);
                    const relatorio = response.data;
                    if (relatorio) {
                        setTitulo(relatorio.titulo || '');
                        setConteudo(relatorio.conteudo || '');
                    }
                } catch (error) {
                    console.error("Erro ao consultar relatório:", error);
                    toast.error("Erro ao consultar relatório");
                }
            }
        };
        fetchRelatorio();
    }, [relatorioId]);

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">
                    {relatorioId ? 'Editar Relatório' : 'Novo Relatório'}
                </h1>
                <hr className="w-full border-darkblue border mb-6" />
                
                <div className="bg-blue-100 p-4 rounded-md shadow-sm mb-4 w-full">
                    <p className="text-sm font-medium text-darkblue">
                        ⚠ Preencha todos os campos para criar um relatório completo e detalhado.
                    </p>
                    <p className="text-sm text-darkblue mt-2">
                        <strong>Perito Responsável:</strong> {user.nome || user.email}
                    </p>
                </div>

                <form className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Título do Relatório *</label>
                        <input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Digite o título do relatório"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Conteúdo do Relatório *</label>
                        <textarea
                            value={conteudo}
                            onChange={(e) => setConteudo(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none h-96 resize-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Digite o conteúdo detalhado do relatório..."
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate(`/casos/${casoId}`)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={relatorioId ? handleEdit : handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? 'Salvando...' : (relatorioId ? 'Atualizar Relatório' : 'Criar Relatório')}
                        </button>
                    </div>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewRelatorio; 