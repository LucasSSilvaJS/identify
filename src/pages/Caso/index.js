import CasoArticle from "../../components/CasoArticle";
import PlataformContainer from "../../components/PlataformContainer";

function Caso() {

    return ( 
        <PlataformContainer>
            <div className="grid grid-cols-1 gap-6 w-full grid-auto-rows-auto">
                <CasoArticle 
                    titulo="Caso 1" 
                    descricao="Descrição do caso 1" 
                    status="Aberto" 
                    dataOcorrencia="2021-01-01" 
                    localizacao="Rua das Flores, 123"
                    latitude={-23.5505}
                    longitude={-46.6333}
                />
                <CasoArticle 
                    titulo="Caso 2" 
                    descricao="Descrição do caso 2" 
                    status="Aberto" 
                    dataOcorrencia="2021-01-01" 
                    localizacao="Av. Paulista, 1000"
                    latitude={-23.5632}
                    longitude={-46.6542}
                />
                <CasoArticle 
                    titulo="Caso 3" 
                    descricao="Descrição do caso 3" 
                    status="Aberto" 
                    dataOcorrencia="2021-01-01" 
                    localizacao="Rua Augusta, 500"
                    latitude={-23.5489}
                    longitude={-46.6388}
                />
            </div>
        </PlataformContainer>
     );
}

export default Caso;