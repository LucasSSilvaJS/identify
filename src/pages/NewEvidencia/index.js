import { useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";

function NewEvidencia() {
    const [tipo, setTipo] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    const [status, setStatus] = useState('Em análise');
    const [urlEvidencia, setUrlEvidencia] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tipo && dataColeta && status && urlEvidencia.length > 0) {
            try {
                const evidenciaData = {
                    tipo,
                    dataColeta,
                    status,
                    urlEvidencia,
                    coletadaPor: "ID_DO_USUARIO_ATUAL", // Isso deve vir do contexto de autenticação
                };
                console.log(evidenciaData);
                // Implementar chamada à API
            } catch (error) {
                console.error("Erro ao salvar evidência:", error);
                alert("Erro ao salvar evidência");
            }
        } else {
            alert('Preencha todos os campos obrigatórios');
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        // Aqui você implementará a lógica para fazer upload dos arquivos
        // e obter as URLs
        const fileUrls = files.map(file => URL.createObjectURL(file));
        setUrlEvidencia(prev => [...prev, ...fileUrls]);
    };

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">Nova Evidência</h1>
                <hr className="w-full border-darkblue border mb-6" />
                <form className="w-full flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Tipo de Evidência</label>
                            <input 
                                onChange={(e) => setTipo(e.target.value)} 
                                type="text" 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                placeholder="Digite o tipo de evidência"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Status</label>
                            <select 
                                onChange={(e) => setStatus(e.target.value)} 
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                            >
                                <option value="Em análise">Em análise</option>
                                <option value="Concluído">Concluído</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Data de Coleta</label>
                        <input 
                            onChange={(e) => setDataColeta(e.target.value)} 
                            type="datetime-local" 
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Evidências</label>
                        <input 
                            type="file" 
                            multiple 
                            onChange={handleFileUpload}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            {urlEvidencia.map((url, index) => (
                                <div key={index} className="relative">
                                    <img src={url} alt={`Evidência ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                    <button 
                                        type="button"
                                        onClick={() => setUrlEvidencia(prev => prev.filter((_, i) => i !== index))}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4" 
                        onClick={handleSubmit}
                    >
                        Salvar Evidência
                    </button>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewEvidencia;