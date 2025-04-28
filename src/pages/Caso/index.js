import { useEffect, useState } from "react";
import CasoArticle from "../../components/CasoArticle";
import PlataformContainer from "../../components/PlataformContainer";
import api from "../../api";

function Caso() {
    const [search, setSearch] = useState("");
    const [casos, setCasos] = useState([]);
    const [showStatusSelect, setShowStatusSelect] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    async function fetchCasos() {
        try {
            const response = await api.get(`/casos?titulo=${search}&status=${selectedStatus}`);
            if (response.status === 200) {
                setCasos(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar casos: ", error);
        }
    }

    useEffect(() => {
        fetchCasos();
    }, [search, selectedStatus]);

    return (
        <PlataformContainer search={search} setSearch={setSearch} showStatusSelect={showStatusSelect} setShowStatusSelect={setShowStatusSelect} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}>
            <div className="grid grid-cols-1 gap-6 w-full grid-auto-rows-auto">
                {casos.length > 0 && casos.map((caso) => (
                    <CasoArticle
                        key={caso._id}
                        id={caso._id}
                        pacienteId={caso?.paciente?._id}
                        evidenciaId={caso?.evidencia?._id}
                        laudoId={caso?.laudo?._id}
                        casoId={caso._id}
                        titulo={caso.titulo}
                        descricao={caso.descricao}
                        status={caso.status}
                        dataAbertura={caso.dataAbertura}
                        dataFechamento={caso.dataFechamento}
                        dataOcorrencia={caso.dataOcorrencia}
                        latitude={caso.localizacao.latitude || 0}
                        longitude={caso.localizacao.longitude || 0}
                        localizacao={caso.localizacao ? [caso.localizacao.latitude, caso.localizacao.longitude] : [0, 0]}
                        fetchCasos={fetchCasos}
                        evidencia={caso.evidencia}
                        paciente={caso.paciente}
                        laudo={caso.laudo}
                    />
                ))}
            </div>
        </PlataformContainer>
    );
}

export default Caso;

