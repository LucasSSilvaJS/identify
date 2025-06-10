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
                {casos.length > 0 ? (
                    casos.map((caso) => (
                        <CasoArticle
                            key={caso._id}
                            id={caso._id}
                            titulo={caso.titulo}
                            descricao={caso.descricao}
                            status={caso.status}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum caso encontrado</h3>
                        <p className="text-gray-500">
                            {search || selectedStatus 
                                ? 'Tente ajustar os filtros de busca.' 
                                : 'Não há casos cadastrados no sistema.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </PlataformContainer>
    );
}

export default Caso;

