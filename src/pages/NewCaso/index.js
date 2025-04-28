import { useEffect, useState } from "react";
import PlataformContainer from "../../components/PlataformContainer";
import { getCoordinatesFromAddress } from "../../utils/getLocation";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { toast } from "react-toastify";

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { createCaso } from "../../services/caso.service";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function NewCaso() {

    const { casoId } = useParams();
    const navigate = useNavigate();

    const [inputLocation, setInputLocation] = useState('');
    const [coords, setCoords] = useState(null);
    const [position, setPosition] = useState([-23.5505, -46.6333]);
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

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

    const [status, setStatus] = useState('Em andamento');
    const [descricao, setDescricao] = useState('');
    const [titulo, setTitulo] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataFechamento, setDataFechamento] = useState('');
    const [dataOcorrencia, setDataOcorrencia] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (coords && status && descricao && titulo && dataAbertura && dataOcorrencia) {
            await createCaso({
                titulo,
                descricao,
                status,
                dataAbertura,
                dataFechamento,
                dataOcorrencia,
                localizacao: {
                    latitude: coords.latitude, longitude: coords.longitude
                }
            })
                .then(() => {
                    toast.success('Caso criado com sucesso');
                    navigate('/casos');
                })
                .catch((err) => {
                    toast.error('Erro ao criar caso');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            toast.error('Preencha todos os campos');
            setLoading(false);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (casoId) {
            setLoading(true);
            if (coords && descricao && titulo && dataAbertura && dataOcorrencia) {
                await api.put(`/casos/${casoId}`, {
                    titulo,
                    descricao,
                    status,
                    dataAbertura,
                    dataFechamento,
                    dataOcorrencia,
                    localizacao: {
                        latitude: coords.latitude, longitude: coords.longitude
                    }
                })
                    .then(() => {
                        toast.success('Caso atualizado com sucesso');
                        navigate('/casos');
                    })
                    .catch((err) => {
                        toast.error('Erro ao atualizar caso', err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                toast.error('Preencha todos os campos');
                setLoading(false);
            }
        }
    }

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
        async function fetchCaso() {
            if (casoId) {
                try {
                    const res = await api.get(`/casos/${casoId}`);
                    const evidencia = res.data;
                    setTitulo(evidencia.titulo);
                    setDescricao(evidencia.descricao);
                    setStatus(evidencia.status);
                    setDataAbertura(dateToDatetimeLocal(evidencia.dataAbertura));
                    setDataFechamento(dateToDatetimeLocal(evidencia.dataFechamento));
                    setDataOcorrencia(dateToDatetimeLocal(evidencia.dataOcorrencia));
                    setCoords(evidencia.localizacao);
                } catch (error) {
                    toast.error('Erro ao buscar caso');
                }
            }
        }

        fetchCaso();
    }, []);

    return (
        <PlataformContainer>
            <section className="flex-1 shadow-xl bg-white rounded-lg p-6 w-full flex flex-col items-center">
                <h1 className="text-darkblue font-bold text-2xl mb-6">{casoId ? 'Editar Caso' : 'Novo Caso'}</h1>
                <hr className="w-full border-darkblue border mb-6" />
                <form className="w-full flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Titulo</label>
                            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} type="text" className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="Digite um título para o caso" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[42px]">
                                <option value="Em andamento">Em andamento</option>
                                <option value="Finalizado">Finalizado</option>
                                <option value="Arquivado">Arquivado</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Descrição</label>
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none h-32 resize-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="Digite uma descrição para o caso" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Data de Abertura</label>
                            <input value={dataAbertura} onChange={(e) => setDataAbertura(e.target.value)} type="datetime-local" className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Data de Conclusão</label>
                            <input value={dataFechamento} onChange={(e) => setDataFechamento(e.target.value)} type="datetime-local" className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-darkblue font-bold text-sm">Data da Ocorrência</label>
                            <input value={dataOcorrencia} onChange={(e) => setDataOcorrencia(e.target.value)} type="datetime-local" className="w-full px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-darkblue font-bold text-sm">Localização</label>
                        <div className="flex gap-2 flex-col sm:flex-row">
                            <input type="text" value={inputLocation} onChange={(e) => setInputLocation(e.target.value)} className="flex-1 px-4 py-2 rounded-lg placeholder:text-darkblue bg-lightbeige text-darkblue border border-darkblue outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="Digite o endereço" />
                            <button onClick={handleSearch} className="bg-darkblue text-white font-bold text-sm p-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 min-w-[150px]">
                                {loadingLocation ? 'Carregando...' : 'Buscar Localização'}
                            </button>
                        </div>
                    </div>

                    <div className="mx-auto w-full sm:h-[500px] h-[300px] border border-darkblue rounded-lg overflow-hidden">
                        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {coords && <ChangeMapView coords={coords} />}
                            <Marker position={position} icon={customIcon}>
                                <Popup>
                                    Sua localização
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {!casoId && <button className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4" onClick={handleSubmit}>
                        {loading ? 'Salvando...' : 'Salvar Caso'}
                    </button>}
                    {casoId && <button className="bg-green-800 text-white font-bold text-lg p-3 rounded-lg hover:bg-green-900 active:bg-green-950 transition-colors duration-200 mt-4" onClick={handleUpdate}>
                        {loading ? 'Atualizando...' : 'Atualizar Caso'}
                    </button>}
                </form>
            </section>
        </PlataformContainer>
    );
}

export default NewCaso;