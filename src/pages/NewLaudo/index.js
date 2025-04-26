import { useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";

function NewLaudo() {
    const [titulo, setTitulo] = useState('');
    const [detalhamento, setDetalhamento] = useState('');
    const [conclusao, setConclusao] = useState('');
    const [parecer, setParecer] = useState({
        perito: '',
        evidencia: '',
        paciente: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (titulo && detalhamento && conclusao && parecer.perito && parecer.evidencia && parecer.paciente) {
            try {
                const laudoData = {
                    titulo,
                    detalhamento,
                    conclusao,
                    parecer,
                    dataCriacao: new Date(),
                    peritoResponsavel: parecer.perito
                };
                console.log(laudoData);
                // Implementar chamada à API
            } catch (error) {
                console.error("Erro ao salvar laudo:", error);
                toast.error("Erro ao salvar laudo");
            }
        } else {
            toast.warn('Preencha todos os campos obrigatórios');
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Perito Responsável</label>
                            <select 
                                onChange={(e) => setParecer(prev => ({...prev, perito: e.target.value}))} 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                            >
                                <option value="">Selecione o perito</option>
                                {/* Aqui você deve carregar a lista de peritos */}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Evidência</label>
                            <select 
                                onChange={(e) => setParecer(prev => ({...prev, evidencia: e.target.value}))} 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                            >
                                <option value="">Selecione a evidência</option>
                                {/* Aqui você deve carregar a lista de evidências */}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Paciente</label>
                            <select 
                                onChange={(e) => setParecer(prev => ({...prev, paciente: e.target.value}))} 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                            >
                                <option value="">Selecione o paciente</option>
                                {/* Aqui você deve carregar a lista de pacientes */}
                            </select>
                        </div>
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
                    >
                        Salvar Laudo
                    </button>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewLaudo;
