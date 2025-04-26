import { useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

function NewPaciente() {
    const { casoId } = useParams();
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [status, setStatus] = useState('Ativo');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status && casoId) {
            try {
                const pacienteData = {
                    nome,
                    cpf,
                    rg,
                    status,
                    caso: casoId
                };
                console.log(pacienteData);
                // Implementar chamada à API
            } catch (error) {
                console.error("Erro ao salvar paciente:", error);
                toast.error("Erro ao salvar paciente");
            }
        } else {
            toast.warn('Preencha os campos obrigatórios');
        }
    };

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">Novo Paciente</h1>
                <hr className="w-full border-darkblue border mb-6" />
                <form className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Nome</label>
                        <input 
                            onChange={(e) => setNome(e.target.value)} 
                            type="text" 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                            placeholder="Digite o nome do paciente"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">CPF</label>
                            <input 
                                onChange={(e) => setCpf(e.target.value)} 
                                type="text" 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                placeholder="Digite o CPF"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">RG</label>
                            <input 
                                onChange={(e) => setRg(e.target.value)} 
                                type="text" 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                placeholder="Digite o RG"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Status</label>
                        <select 
                            onChange={(e) => setStatus(e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                            <option value="Em Tratamento">Em Tratamento</option>
                        </select>
                    </div>

                    <button 
                        className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4" 
                        onClick={handleSubmit}
                    >
                        Salvar Paciente
                    </button>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewPaciente;
