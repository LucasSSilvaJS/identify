import { useEffect, useState } from "react";
import CasoArticle from "../../components/CasoArticle";
import PlataformContainer from "../../components/PlataformContainer";
import api from "../../api";
import { GoFileDirectory } from "react-icons/go";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function Caso() {
    const [search, setSearch] = useState("");
    const [casos, setCasos] = useState([]);
    const [showStatusSelect, setShowStatusSelect] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Estados de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    async function fetchCasos(page = 1) {
        setLoading(true);
        try {
            // Construir parâmetros de busca
            const params = new URLSearchParams();
            
            // Se há busca, usar o mesmo termo para título e descrição
            if (search.trim()) {
                params.append('titulo', search.trim());
                params.append('descricao', search.trim());
            }
            
            // Adicionar filtro de status se selecionado
            if (selectedStatus) {
                params.append('status', selectedStatus);
            }
            
            // Adicionar parâmetros de paginação (sempre 10 itens por página)
            params.append('page', page.toString());
            params.append('limit', '10');

            const response = await api.get(`/casos?${params.toString()}`);
            if (response.status === 200) {
                const { casos: casosData, pagination } = response.data;
                setCasos(casosData);
                setCurrentPage(pagination.currentPage);
                setTotalPages(pagination.totalPages);
                setTotalItems(pagination.totalItems);
                setHasNextPage(pagination.hasNextPage);
                setHasPrevPage(pagination.hasPrevPage);
            }
        } catch (error) {
            console.error("Erro ao buscar casos: ", error);
            setCasos([]);
            // Resetar paginação em caso de erro
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);
            setHasNextPage(false);
            setHasPrevPage(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Resetar para primeira página quando mudar filtros
        setCurrentPage(1);
        fetchCasos(1);
    }, [search, selectedStatus]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchCasos(newPage);
        }
    };

    const hasActiveFilters = search.trim() || selectedStatus;

    return (
        <PlataformContainer 
            search={search} 
            setSearch={setSearch} 
            showStatusSelect={showStatusSelect} 
            setShowStatusSelect={setShowStatusSelect} 
            selectedStatus={selectedStatus} 
            setSelectedStatus={setSelectedStatus}
        >
            {/* Indicador de filtros ativos */}
            {hasActiveFilters && (
                <div className="mb-4 p-3 bg-lightbeige rounded-lg border border-darkblue">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-darkblue">Filtros ativos:</span>
                            {search.trim() && (
                                <span className="px-2 py-1 bg-darkblue text-mediumbeige rounded text-xs">
                                    Busca: "{search.trim()}"
                                </span>
                            )}
                            {selectedStatus && (
                                <span className="px-2 py-1 bg-darkblue text-mediumbeige rounded text-xs">
                                    Status: {selectedStatus}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => {
                                setSearch("");
                                setSelectedStatus("");
                            }}
                            className="text-sm text-darkblue hover:text-red-600 transition-colors"
                        >
                            Limpar filtros
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 w-full grid-auto-rows-auto">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-darkblue mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando casos...</p>
                    </div>
                ) : casos.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-lightbeige via-white to-lightbeige rounded-xl border border-darkblue shadow-lg animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-darkblue to-blue-700 rounded-xl shadow-lg">
                                    <GoFileDirectory className="text-mediumbeige text-xl" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-darkblue font-bold text-lg">
                                            {totalItems} caso{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        {hasActiveFilters && (
                                            <span className="text-sm text-gray-600">
                                                com os filtros aplicados
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <div className="text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm font-medium">
                                    Filtros ativos
                                </div>
                            )}
                        </div>
                        
                        {casos.map((caso) => (
                            <CasoArticle
                                key={caso._id}
                                id={caso._id}
                                titulo={caso.titulo}
                                descricao={caso.descricao}
                                status={caso.status}
                            />
                        ))}

                        {/* Controles de paginação */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8 p-4 bg-lightbeige rounded-lg border border-darkblue">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!hasPrevPage}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        hasPrevPage
                                            ? 'bg-darkblue text-mediumbeige hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <IoChevronBack className="w-4 h-4" />
                                    Anterior
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-darkblue text-mediumbeige'
                                                        : 'bg-white text-darkblue hover:bg-gray-100 border border-darkblue'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!hasNextPage}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        hasNextPage
                                            ? 'bg-darkblue text-mediumbeige hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Próxima
                                    <IoChevronForward className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum caso encontrado</h3>
                        <p className="text-gray-500">
                            {hasActiveFilters 
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

