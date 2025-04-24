import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function CasoArticle({ id, titulo, descricao, status, dataAbertura, dataConclusao, dataOcorrencia, localizacao, latitude, longitude }) {
    const [showDetails, setShowDetails] = useState(false);

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

    return (
        <article className="w-full bg-white shadow-md rounded-lg p-6">
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
                            <p className="text-gray-700">{localizacao}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Abertura</h3>
                            <p className="text-gray-700">{dataAbertura || 'Pendente'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Conclusão</h3>
                            <p className="text-gray-700">{dataConclusao || 'Pendente'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data da Ocorrência</h3>
                            <p className="text-gray-700">{dataOcorrencia || 'Pendente'}</p>
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
                    <Link
                        to="/evidencias/novo"
                        className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                        Adicionar Evidências
                    </Link>
                </div>
                <div className="flex gap-2">
                    <Link
                        to="/laudos/novo"
                        className="text-sm font-medium bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-800 shadow-md hover:shadow-lg transition-all duration-200 w-fit block text-center"
                    >
                        Gerar Laudo
                    </Link>
                    <Link
                        to="/pacientes/novo" 
                        className="text-sm font-medium text-purple-600 border-2 border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 active:bg-purple-100 shadow-md hover:shadow-lg transition-all duration-200 w-fit block text-center"
                    >
                        Adicionar Paciente
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default CasoArticle;

