import { useEffect, useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../../api";
import { useNavigate } from "react-router-dom";

function NewPaciente() {
    const navigate = useNavigate();
    const { casoId: urlCasoId, pacienteId } = useParams();
    const [casoId, setCasoId] = useState(urlCasoId);
    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [idade, setIdade] = useState('');
    const [documento, setDocumento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [corEtnia, setCorEtnia] = useState('');
    const [loading, setLoading] = useState(false);

    // Buscar casoId da URL se estiver editando
    useEffect(() => {
        if (pacienteId && !casoId) {
            const urlParams = new URLSearchParams(window.location.search);
            const casoIdFromUrl = urlParams.get('casoId');
            if (casoIdFromUrl) {
                setCasoId(casoIdFromUrl);
            }
        }
    }, [pacienteId, casoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !genero || !idade) {
            toast.warn('Preencha os campos obrigatórios (Nome, Gênero e Idade)');
            return;
        }

        setLoading(true);
        try {
            const vitimaData = {
                nome,
                genero,
                idade: parseInt(idade),
                idCaso: casoId
            };

            // Adiciona campos opcionais se preenchidos
            if (documento) vitimaData.documento = documento;
            if (endereco) vitimaData.endereco = endereco;
            if (corEtnia) vitimaData.corEtnia = corEtnia;

            await api.post('/vitimas', vitimaData);
            toast.success('Vítima cadastrada com sucesso');
            navigate(`/casos/${casoId}`);
        } catch (error) {
            console.error("Erro ao cadastrar vítima:", error);
            toast.error("Erro ao cadastrar vítima");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!nome || !genero || !idade) {
            toast.warn('Preencha os campos obrigatórios (Nome, Gênero e Idade)');
            return;
        }

        setLoading(true);
        try {
            const vitimaData = {
                nome,
                genero,
                idade: parseInt(idade)
            };

            // Adiciona campos opcionais se preenchidos
            if (documento) vitimaData.documento = documento;
            if (endereco) vitimaData.endereco = endereco;
            if (corEtnia) vitimaData.corEtnia = corEtnia;

            await api.put(`/vitimas/${pacienteId}`, vitimaData);
            toast.success('Vítima atualizada com sucesso');
            navigate(`/casos/${casoId}`);
        } catch (error) {
            console.error("Erro ao atualizar vítima:", error);
            toast.error("Erro ao atualizar vítima");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchVitima = async () => {
            if (pacienteId) {
                try {
                    const response = await api.get(`/vitimas/${pacienteId}`);
                    const vitima = response.data;
                    if (vitima) {
                        setNome(vitima.nome || '');
                        setGenero(vitima.genero || '');
                        setIdade(vitima.idade ? vitima.idade.toString() : '');
                        setDocumento(vitima.documento || '');
                        setEndereco(vitima.endereco || '');
                        setCorEtnia(vitima.corEtnia || '');
                    }
                } catch (error) {
                    console.error("Erro ao consultar vítima:", error);
                    toast.error("Erro ao consultar vítima");
                }
            }
        };
        fetchVitima();
    }, [pacienteId]);

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">
                    {pacienteId ? 'Editar Vítima' : 'Nova Vítima'}
                </h1>
                <hr className="w-full border-darkblue border mb-6" />
                
                <div className="bg-blue-100 p-4 rounded-md shadow-sm mb-4 w-full">
                    <p className="text-sm font-medium text-darkblue">
                        ⚠ O NIC (Número de Identificação da Vítima) será gerado automaticamente pelo sistema.
                    </p>
                </div>

                <form className="w-full flex flex-col gap-4">
                    {/* Campos Obrigatórios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Nome *</label>
                            <input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                type="text"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="Digite o nome completo"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Gênero *</label>
                            <select
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                                disabled={loading}
                                required
                            >
                                <option value="">Selecione o gênero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Não informado">Não informado</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Idade *</label>
                            <input
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                type="number"
                                min="0"
                                max="150"
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="Digite a idade"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Cor/Etnia</label>
                            <select
                                value={corEtnia}
                                onChange={(e) => setCorEtnia(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                                disabled={loading}
                            >
                                <option value="">Selecione a cor/etnia</option>
                                <option value="Branca">Branca</option>
                                <option value="Preta">Preta</option>
                                <option value="Parda">Parda</option>
                                <option value="Amarela">Amarela</option>
                                <option value="Indígena">Indígena</option>
                                <option value="Não informado">Não informado</option>
                            </select>
                        </div>
                    </div>

                    {/* Campos Opcionais */}
                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Documento</label>
                        <input
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="CPF, RG, ou outro documento"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Endereço</label>
                        <textarea
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none h-24 resize-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Digite o endereço completo"
                            disabled={loading}
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
                            onClick={pacienteId ? handleEdit : handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? 'Salvando...' : (pacienteId ? 'Atualizar Vítima' : 'Cadastrar Vítima')}
                        </button>
                    </div>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewPaciente;