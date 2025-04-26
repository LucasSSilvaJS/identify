import { useState, useContext } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import api from "../../api";

function NewEvidencia() {
    const { casoId } = useParams();
    const { user } = useContext(AuthContext);

    const [tipo, setTipo] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    const [status, setStatus] = useState('Em análise');
    const [files, setFiles] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (tipo && dataColeta && files.length > 0) {
            const formData = new FormData();
            formData.append('tipo', tipo);
            formData.append('dataColeta', dataColeta);
            formData.append('status', status);
            formData.append('caso', casoId);
            formData.append('coletadaPor', user ? user.id : null);
    
            files.forEach(file => {
                formData.append('files', file);
            });
    
            console.log(formData);
            try {
                const response = await api.post('/evidencias', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success(response.data.message);
                setTipo('');
                setDataColeta('');
                setStatus('Em análise');
                setFiles([]);
            } catch (error) {
                console.error("Erro ao criar evidência:", error);
                toast.error("Erro ao criar evidência");
            }
        } else {
            toast.warn('Preencha todos os campos obrigatórios');
        }
    };    

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">Nova Evidência</h1>
                <hr className="w-full border-darkblue border mb-6" />
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-full flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Tipo de Evidência</label>
                            <input
                                name="tipo"
                                value={tipo}
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
                                name="status"
                                value={status}
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
                            value={dataColeta}
                            type="datetime-local"
                            name="dataColeta"
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Evidências</label>
                        <input
                            type="file"
                            multiple
                            name="files"
                            onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {
                                files.map((file, index) => (
                                    <img key={index} src={URL.createObjectURL(file)} alt={file.name} className="w-full h-auto object-cover rounded" />
                                ))
                            }
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4"
                    >
                        Salvar Evidência
                    </button>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewEvidencia;

