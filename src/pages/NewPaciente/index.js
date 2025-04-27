import { useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../../api";

function NewPaciente() {
    const { casoId } = useParams();
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [status, setStatus] = useState('Ativo');
    const [disableFields, setDisableFields] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status && casoId) {
            setLoading(true);
            try {
                let pacienteData = {};
                if (disableFields) {
                    pacienteData = {
                        status,
                        caso: casoId
                    }
                }else{
                    pacienteData = {
                        nome,
                        cpf,
                        rg,
                        status,
                        caso: casoId
                    };
                }
                await api.post('/pacientes', pacienteData);
                toast.success('Paciente salvo com sucesso');
                setLoading(false);
            } catch (error) {
                console.error("Erro ao salvar paciente:", error);
                toast.error("Erro ao salvar paciente");
                setLoading(false);
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
                <div className="bg-blue-100 p-4 rounded-md shadow-sm mb-4">
                    <p className="text-sm font-medium text-darkblue">
                        ⚠ O importante é gerar o id de paciente e vincular ao caso, portanto os campos de CPF, RG e Status podem ser alterados posteriormente.
                    </p>
                </div>
                <form className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Nome</label>
                        <input 
                            onChange={(e) => setNome(e.target.value)} 
                            type="text" 
                            className={`w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${disableFields ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Digite o nome do paciente"
                            disabled={disableFields || loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">CPF</label>
                            <input 
                                onChange={(e) => setCpf(e.target.value)} 
                                type="text" 
                                className={`w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${disableFields ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Digite o CPF"
                                disabled={disableFields || loading}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">RG</label>
                            <input 
                                onChange={(e) => setRg(e.target.value)} 
                                type="text" 
                                className={`w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${disableFields ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Digite o RG"
                                disabled={disableFields || loading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Status</label>
                        <select 
                            onChange={(e) => setStatus(e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                            disabled={loading}
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                            <option value="Em Tratamento">Em Tratamento</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded-lg border-darkblue bg-lightbeige"
                            checked={!disableFields}
                            onChange={(e) => setDisableFields(!e.target.checked)}
                            disabled={loading}
                        />
                        <label className="text-darkblue font-bold text-sm">Habilitar campos não obrigatórios</label>
                    </div>

                    <button 
                        className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Paciente'}
                    </button>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewPaciente;
