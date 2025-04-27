import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { toast } from "react-toastify";
import api from "../../api";

function CasoArticle({ id, key, titulo, descricao, status, dataAbertura, dataConclusao, dataOcorrencia, localizacao, latitude, longitude, casoId, evidenciaId, pacienteId, fetchCasos }) {
    const [showDetails, setShowDetails] = useState(false);
    const [showOptionsEvidencia, setShowOptionsEvidencia] = useState(false);
    const [showOptionsPaciente, setShowOptionsPaciente] = useState(false);
    const [deletingEvidencia, setDeletingEvidencia] = useState(false);
    const [deletingPaciente, setDeletingPaciente] = useState(false);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    function handleShowDetails() {
        setShowDetails(!showDetails);
    }

    const formatedLocalizacao = localizacao ? `${latitude}, ${longitude}` : 'Pendente';
    const formatedDataAbertura = dataAbertura ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataAbertura)) : 'Pendente';
    const formatedDataConclusao = dataConclusao ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataConclusao)) : 'Pendente';
    const formatedDataOcorrencia = dataOcorrencia ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataOcorrencia)) : 'Pendente';

    function handleShowOptionsEvidencia() {
        setShowOptionsEvidencia(!showOptionsEvidencia);
        setShowOptionsPaciente(false);
    }

    function handleShowOptionsPaciente() {
        setShowOptionsPaciente(!showOptionsPaciente);
        setShowOptionsEvidencia(false);
    }

    async function handleDeleteEvidencia() {
        setDeletingEvidencia(true);
        try {
            const response = await api.delete(`/evidencias/${evidenciaId}`);
            if (response.status === 200) {
                toast.success('Evidência deletada com sucesso!');
                fetchCasos();
            } else {
                toast.error('Erro ao deletar evidência');
            }
        } catch (error) {
            toast.error('Erro ao deletar evidência');
        } finally {
            setDeletingEvidencia(false);
        }
    }

    async function handleDeletePaciente() {
        setDeletingPaciente(true);
        try {
            const response = await api.delete(`/pacientes/${pacienteId}`);
            if (response.status === 200) {
                toast.success('Paciente deletado com sucesso!');
                fetchCasos();
            } else {
                toast.error('Erro ao deletar paciente');
            }
        } catch (error) {
            toast.error('Erro ao deletar paciente');
        } finally {
            setDeletingPaciente(false);
        }
    }

    return (
        <article className="w-full bg-white shadow-md rounded-lg p-6" key={key}>
            <header className="border-b border-gray-200 pb-4 mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Caso #{id}</h1>
                <h2 className="text-xl text-gray-700 mt-2">{titulo}</h2>
            </header>

            <div className="space-y-6">
                <section>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Descrição</h3>
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {descricao}
                    </p>
                </section>

                {showDetails && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Status</h3>
                            <p className="text-gray-700">{status}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Localização</h3>
                            <p className="text-gray-700">{formatedLocalizacao}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Abertura</h3>
                            <p className="text-gray-700">{formatedDataAbertura}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Conclusão</h3>
                            <p className="text-gray-700">{formatedDataConclusao}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data da Ocorrência</h3>
                            <p className="text-gray-700">{formatedDataOcorrencia}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Mapa</h3>
                            <div className="h-[300px] w-full rounded-lg overflow-hidden">
                                <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[latitude, longitude]} icon={customIcon}>
                                        <Popup>
                                            Localização do caso
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </section>
                )}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleShowDetails}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-300 flex gap-4">
                    <div className="relative">
                        <button
                            onClick={handleShowOptionsEvidencia}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200 border-2 border-purple-600 hover:border-purple-800 rounded-lg px-4 py-2"
                        >
                            Evidência
                        </button>
                        {showOptionsEvidencia && (
                            <div className="absolute z-10 w-48 bg-white shadow-md rounded-lg mt-2">
                                {evidenciaId ? (
                                    <>
                                        <Link
                                            to={`/evidencias/editar/${evidenciaId}`}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={handleDeleteEvidencia}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            {deletingEvidencia ? 'Deletando...' : 'Deletar'}
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to={`/evidencias/novo/${casoId}`}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                    >
                                        Criar
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button
                            onClick={handleShowOptionsPaciente}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200 border-2 border-purple-600 hover:border-purple-800 rounded-lg px-4 py-2"
                        >
                            Paciente
                        </button>
                        {showOptionsPaciente && (
                            <div className="absolute z-10 w-48 bg-white shadow-md rounded-lg mt-2">
                                {pacienteId ? (
                                    <>
                                        <Link
                                            to={`/pacientes/editar/${pacienteId}`}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={handleDeletePaciente}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            {deletingPaciente ? 'Deletando...' : 'Deletar'}
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to={`/pacientes/novo/${casoId}`}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                    >
                                        Criar
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default CasoArticle;



