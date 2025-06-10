import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

function CasoArticle({ id, titulo, descricao, status }) {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Em andamento':
                return 'bg-yellow-100 text-yellow-800';
            case 'Finalizado':
                return 'bg-green-100 text-green-800';
            case 'Arquivado':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <article className="w-full bg-white shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                        Caso #{id.slice(-8)}
                    </h1>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {titulo}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                        {descricao}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 lg:gap-2 lg:ml-4">
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(status)}`}>
                        {status}
                    </span>
                    <button
                        onClick={() => navigate(`/casos/${id}`)}
                        className="w-full sm:w-auto lg:w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        title="Ver detalhes do caso"
                    >
                        <FaEye />
                        <span className="hidden sm:inline">Ver Detalhes</span>
                        <span className="sm:hidden">Detalhes</span>
                    </button>
                </div>
            </div>
        </article>
    );
}

export default CasoArticle;




