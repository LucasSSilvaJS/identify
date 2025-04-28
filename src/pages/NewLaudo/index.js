import { useContext, useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api";

function NewLaudo() {
    const navigate = useNavigate();
    const {casoId} = useParams();
    const {user} = useContext(AuthContext);
    const [titulo, setTitulo] = useState('');
    const [detalhamento, setDetalhamento] = useState('');
    const [conclusao, setConclusao] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (titulo && detalhamento && conclusao && casoId) {
            try {
                const laudoData = {
                    titulo,
                    detalhamento,
                    conclusao,
                    parecer: {
                        caso: casoId
                    },
                    dataCriacao: new Date(),
                    peritoResponsavel: user?.id
                };
                
                const response = await api.post('/laudos', laudoData);
                const { laudo } = response.data;
                const laudoId = laudo._id;

                const updateCaso = await api.patch(`/casos/add-laudo`, { idCaso: casoId, idLaudo: laudoId });
                if (updateCaso.status !== 200) {
                    throw new Error('Erro ao atualizar caso');
                }

                toast.success('Laudo criado com sucesso');
                navigate('/casos');
                
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

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">Novo Laudo</h1>
                <hr className="w-full border-darkblue border mb-6" />
                <form className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Título do Laudo</label>
                        <input 
                            onChange={(e) => setTitulo(e.target.value)} 
                            type="text" 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                            placeholder="Digite o título do laudo"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Detalhamento</label>
                        <textarea 
                            onChange={(e) => setDetalhamento(e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[200px] resize-none" 
                            placeholder="Descreva os detalhes do laudo"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Conclusão</label>
                        <textarea 
                            onChange={(e) => setConclusao(e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[150px] resize-none" 
                            placeholder="Descreva a conclusão do laudo"
                        />
                    </div>

                    <button 
                        className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4" 
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Laudo'}
                    </button>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewLaudo;