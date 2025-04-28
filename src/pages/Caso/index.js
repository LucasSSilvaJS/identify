import { useEffect, useState } from "react";
import CasoArticle from "../../components/CasoArticle";
import PlataformContainer from "../../components/PlataformContainer";
import { getCasos } from "../../services/caso.service";

function Caso() {
    const [casos, setCasos] = useState([]);

    async function fetchCasos() {
        const fetchedCasos = await getCasos();
        if (fetchedCasos) {
            setCasos(fetchedCasos);
        }
    }

    useEffect(() => {
        fetchCasos();
    }, []);
    
    return (
        <PlataformContainer>
            <div className="grid grid-cols-1 gap-6 w-full grid-auto-rows-auto">
                {casos.map((caso) => (
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
