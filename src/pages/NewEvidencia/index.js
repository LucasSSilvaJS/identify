import { useState, useContext, useEffect } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { getCoordinatesFromAddress } from "../../utils/getLocation";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function NewEvidencia() {

    const { casoId, evidenciaId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tipo, setTipo] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    const [status, setStatus] = useState('Em análise');
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Estados para localização
    const [inputLocation, setInputLocation] = useState('');
    const [coords, setCoords] = useState(null);
    const [position, setPosition] = useState([-23.5505, -46.6333]);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoadingLocation(true);
        try {
            const result = await getCoordinatesFromAddress(inputLocation);
            setCoords(result);
        } catch (err) {
            toast.error('Erro ao buscar localização');
        } finally {
            setLoadingLocation(false);
        }
    };

    function ChangeMapView({ coords }) {
        const map = useMap();

        useEffect(() => {
            if (coords) {
                map.setView([coords.latitude, coords.longitude], 13);
            }
        }, [coords, map]);

        return null;
    }

    useEffect(() => {
        if (coords) {
            setPosition([coords.latitude, coords.longitude]);
        }
    }, [coords]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPosition = [position.coords.latitude, position.coords.longitude];
                    setPosition(newPosition);
                    setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                },
                (error) => {
                    console.log("Erro ao obter localização:", error);
                }
            );
        } else {
            console.log("Geolocalização não disponível");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tipo || !dataColeta || !coords || !casoId) {
            toast.warn('Preencha todos os campos obrigatórios e selecione uma localização');
            return;
        }

            setLoading(true);
            try {
            const evidenciaData = {
                tipo,
                dataColeta,
                status,
                coletadaPor: user.id,
                latitude: coords.latitude.toString(),
                longitude: coords.longitude.toString(),
                casoId
            };

            const response = await api.post('/evidencias', evidenciaData);

                toast.success(response.data.message);
            navigate(`/casos/${casoId}`);
            } catch (error) {
                console.error("Erro ao criar evidência:", error);
                toast.error("Erro ao criar evidência");
            } finally {
                setLoading(false);
        }
    };
    
const handleEdit = async (e) => {
    e.preventDefault();

        if (!tipo || !dataColeta || !coords) {
            toast.warn('Preencha todos os campos obrigatórios e selecione uma localização');
            return;
        }

        setLoading(true);
        try {
            const evidenciaData = {
                tipo,
                dataColeta,
                status,
                coletadaPor: user.id,
                latitude: coords.latitude.toString(),
                longitude: coords.longitude.toString()
            };

            const response = await api.put(`/evidencias/${evidenciaId}`, evidenciaData);

            toast.success(response.data.message);
            if (casoId) {
                navigate(`/casos/${casoId}`);
            } else {
            navigate('/casos');
            }
        } catch (error) {
            console.error("Erro ao editar evidência:", error);
            toast.error("Erro ao editar evidência");
        } finally {
            setLoading(false);
    }
};

function dateToDatetimeLocal(date) {
    if (!date) return '';
    
    // Se for string, converte para Date primeiro
    const d = typeof date === 'string' ? new Date(date) : date;
    
    // Extrai os componentes da data
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

useEffect(() => {
    const fetchEvidencia = async () => {
        if (evidenciaId && !casoId) {
            try {
                const response = await api.get(`/evidencias/${evidenciaId}`);
                const evidencia = response.data;
                setTipo(evidencia.tipo);
                setDataColeta(dateToDatetimeLocal(evidencia.dataColeta));
                setStatus(evidencia.status);
                    if (evidencia.geolocalizacao) {
                        setCoords({
                            latitude: parseFloat(evidencia.geolocalizacao.latitude),
                            longitude: parseFloat(evidencia.geolocalizacao.longitude)
                        });
                    }
            } catch (error) {
                console.error("Erro ao consultar evidência:", error);
                toast.error("Erro ao consultar evidência");
            }
        }
    }

    fetchEvidencia();
    }, [evidenciaId, casoId]);

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">{!casoId ? 'Editar Evidência' : 'Nova Evidência'}</h1>
                <hr className="w-full border-darkblue border mb-6" />
                <form onSubmit={!casoId ? handleEdit : handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Tipo de Evidência *</label>
                            <select
                                name="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]"
                                required
                            >
                                <option value="">Selecione o tipo de evidência</option>
                                <option value="FOTO">Foto</option>
                                <option value="DOCUMENTO">Documento</option>
                                <option value="IMPRESSÃO_DIGITAL">Impressão Digital</option>
                                <option value="AMOSTRA_BIOLÓGICA">Amostra Biológica</option>
                                <option value="ARMA">Arma</option>
                                <option value="VESTÍGIO">Vestígio</option>
                                <option value="VIDEO">Vídeo</option>
                                <option value="AUDIO">Áudio</option>
                                <option value="OBJETO">Objeto</option>
                                <option value="LOCAL">Local</option>
                                <option value="TESTEMUNHO">Testemunho</option>
                                <option value="LAUDO_TÉCNICO">Laudo Técnico</option>
                                <option value="RELATÓRIO">Relatório</option>
                                <option value="OUTROS">Outros</option>
                            </select>
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
                        <label className="text-darkblue font-bold text-sm">Data de Coleta *</label>
                        <input
                            onChange={(e) => setDataColeta(e.target.value)}
                            value={dataColeta}
                            type="datetime-local"
                            name="dataColeta"
                            className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Localização *</label>
                        <div className="flex gap-2 flex-col sm:flex-row">
                        <input
                                type="text" 
                                value={inputLocation} 
                                onChange={(e) => setInputLocation(e.target.value)} 
                                className="flex-1 px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                placeholder="Digite o endereço para buscar no mapa" 
                            />
                            <button 
                                type="button"
                                onClick={handleSearch} 
                                className="bg-darkblue text-white font-bold text-sm p-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 min-w-[150px]"
                            >
                                {loadingLocation ? 'Carregando...' : 'Buscar Localização'}
                            </button>
                        </div>
                    </div>

                    <div className="mx-auto w-full sm:h-[500px] h-[300px] border border-darkblue rounded-lg overflow-hidden">
                        <MapContainer 
                            center={position} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                            onClick={(e) => {
                                const { lat, lng } = e.latlng;
                                setCoords({ latitude: lat, longitude: lng });
                                setPosition([lat, lng]);
                            }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {coords && <ChangeMapView coords={coords} />}
                            <Marker position={position} icon={customIcon}>
                                <Popup>
                                    Localização da evidência
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {casoId && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Caso ID:</strong> {casoId}
                            </p>
                            <p className="text-blue-600 text-xs mt-1">
                                Esta evidência será associada ao caso especificado.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 mt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? (casoId ? 'Salvando...' : 'Editando...') : (casoId ? 'Salvar Evidência' : 'Editar Evidência')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (casoId) {
                                    navigate(`/casos/${casoId}`);
                                } else {
                                    navigate('/casos');
                                }
                            }}
                            className="bg-gray-500 text-white font-bold text-lg p-3 rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewEvidencia;

