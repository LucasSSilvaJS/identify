import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { toast } from "react-toastify";
import api from "../../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CasoArticle({ id, key, titulo, descricao, status, dataAbertura, dataConclusao, dataOcorrencia, localizacao, latitude, longitude, casoId, evidenciaId, pacienteId, laudoId, fetchCasos, evidencia, paciente, laudo }) {
    const generatePDF = () => {
        // Criar instância do PDF
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        // Configurações de estilo
        const primaryColor = '#2c3e50';
        const secondaryColor = '#7f8c8d';
        const fontSizeNormal = 10;
        const fontSizeLarge = 14;
        const fontSizeTitle = 18;

        // Função para formatar datas
        const formatDate = (date) => {
            if (!date) return 'Não informado';
            const d = new Date(date);
            return d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Cabeçalho do documento
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSizeTitle);
        doc.setTextColor(primaryColor);
        doc.text('RELATÓRIO DE CASO', 105, 20, { align: 'center' });

        // Linha divisória
        doc.setDrawColor(primaryColor);
        doc.line(20, 25, 190, 25);

        // Informações básicas do caso
        doc.setFontSize(fontSizeLarge);
        doc.text(`Caso: ${titulo}`, 20, 35);
        doc.setFontSize(fontSizeNormal);
        doc.setFont('helvetica', 'normal');

        // Tabela com informações principais
        autoTable(doc, {
            startY: 45,
            head: [['Informação', 'Detalhes']],
            body: [
                ['ID do Caso', casoId || 'Não informado'],
                ['Status', status || 'Não informado'],
                ['Data de Abertura', formatDate(dataAbertura)],
                ['Data de Ocorrência', formatDate(dataOcorrencia)],
                ['Data de Conclusão', formatDate(dataConclusao)],
            ],
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: '#ffffff',
                fontStyle: 'bold'
            },
            margin: { left: 20 }
        });

        // Descrição do caso
        doc.setFont('helvetica', 'bold');
        doc.text('Descrição:', 20, doc.lastAutoTable.finalY + 15);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(descricao || 'Não informada', 170);
        doc.text(descLines, 20, doc.lastAutoTable.finalY + 20);

        let finalY = doc.lastAutoTable.finalY + 20 + (descLines.length * 5);

        // Localização (se existir)
        if (localizacao || (latitude && longitude)) {
            doc.setFont('helvetica', 'bold');
            doc.text('Localização:', 20, finalY + 10);
            doc.setFont('helvetica', 'normal');

            const locBody = [];
            if (localizacao) locBody.push(['Localização', localizacao]);
            if (latitude) locBody.push(['Latitude', latitude]);
            if (longitude) locBody.push(['Longitude', longitude]);

            autoTable(doc, {
                startY: finalY + 15,
                body: locBody,
                theme: 'plain',
                margin: { left: 20 }
            });
            finalY = doc.lastAutoTable.finalY;
        }

        // Seção de Evidência (se existir)
        if (evidencia) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(fontSizeLarge);
            doc.text('Evidência:', 20, finalY + 15);
            doc.setFontSize(fontSizeNormal);

            autoTable(doc, {
                startY: finalY + 20,
                head: [['Informação', 'Detalhes']],
                body: [
                    ['Tipo', evidencia.tipo || 'Não informado'],
                    ['Status', evidencia.status || 'Não informado'],
                    ['Data de Coleta', formatDate(evidencia.dataColeta)],
                    ['URLs', evidencia.urlEvidencia?.join('\n') || 'Nenhuma']
                ],
                theme: 'grid',
                headStyles: {
                    fillColor: primaryColor,
                    textColor: '#ffffff',
                    fontStyle: 'bold'
                },
                margin: { left: 20 }
            });
            finalY = doc.lastAutoTable.finalY;
        }

        // Seção do Paciente (se existir)
        if (paciente) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(fontSizeLarge);
            doc.text('Paciente:', 20, finalY + 15);
            doc.setFontSize(fontSizeNormal);

            autoTable(doc, {
                startY: finalY + 20,
                head: [['Informação', 'Detalhes']],
                body: [
                    ['Nome', paciente.nome || 'Não informado'],
                    ['CPF', paciente.cpf || 'Não informado'],
                    ['RG', paciente.rg || 'Não informado'],
                    ['Status', paciente.status || 'Não informado'],
                    ['ID', paciente._id || pacienteId || 'Não informado']
                ],
                theme: 'grid',
                headStyles: {
                    fillColor: primaryColor,
                    textColor: '#ffffff',
                    fontStyle: 'bold'
                },
                margin: { left: 20 }
            });
            finalY = doc.lastAutoTable.finalY;
        }

        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(secondaryColor);
        doc.text(`Documento gerado em: ${formatDate(new Date())}`, 105, 285, { align: 'center' });
        doc.text(`ID do Relatório: ${id || key || 'N/A'}`, 105, 290, { align: 'center' });

        // Salvar o PDF
        doc.save(`Relatorio_Caso_${casoId || titulo || 'sem_identificador'}.pdf`);
    };

    const [showDetails, setShowDetails] = useState(false);
    const [showOptionsEvidencia, setShowOptionsEvidencia] = useState(false);
    const [showOptionsPaciente, setShowOptionsPaciente] = useState(false);
    const [showOptionLaudo, setShowOptionLaudo] = useState(false);
    const [deletingEvidencia, setDeletingEvidencia] = useState(false);
    const [deletingPaciente, setDeletingPaciente] = useState(false);
    const [deletingLaudo, setDeletingLaudo] = useState(false);

    const evidenciaRef = useRef(null);
    const pacienteRef = useRef(null);
    const laudoRef = useRef(null);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (evidenciaRef.current && !evidenciaRef.current.contains(event.target)) {
                setShowOptionsEvidencia(false);
            }
            if (pacienteRef.current && !pacienteRef.current.contains(event.target)) {
                setShowOptionsPaciente(false);
            }
            if (laudoRef.current && !laudoRef.current.contains(event.target)) {
                setShowOptionLaudo(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleShowDetails() {
        setShowDetails(!showDetails);
    }

    const formatedLocalizacao = localizacao ? `${latitude}, ${longitude}` : 'Pendente';
    const formatedDataAbertura = dataAbertura ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataAbertura)) : 'Pendente';
    const formatedDataConclusao = dataConclusao ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataConclusao)) : 'Pendente';
    const formatedDataOcorrencia = dataOcorrencia ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataOcorrencia)) : 'Pendente';

    function handleShowOptionsEvidencia() {
        setShowOptionsEvidencia(!showOptionsEvidencia);
        setShowOptionLaudo(false);
        setShowOptionsPaciente(false);
    }

    function handleShowOptionsPaciente() {
        setShowOptionsPaciente(!showOptionsPaciente);
        setShowOptionLaudo(false);
        setShowOptionsEvidencia(false);
    }

    function handleShowOptionLaudo() {
        setShowOptionLaudo(!showOptionLaudo);
        setShowOptionsEvidencia(false);
        setShowOptionsPaciente(false);
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

    async function handleDeleteLaudo() {
        setDeletingLaudo(true);
        try {
            const response = await api.delete(`/laudos/${laudoId}`);
            if (response.status === 200) {  
                toast.success('Laudo deletado com sucesso!');
                fetchCasos();
            } else {
                toast.error('Erro ao deletar laudo');
            }
        } catch (error) {
            toast.error('Erro ao deletar laudo');
        } finally {
            setDeletingLaudo(false);
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
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Status</h3>
                            <p className="text-gray-700">{status}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Localização</h3>
                            <p className="text-gray-700">{formatedLocalizacao}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Abertura</h3>
                            <p className="text-gray-700">{formatedDataAbertura}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Data de Conclusão</h3>
                            <p className="text-gray-700">{formatedDataConclusao}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
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
                        {evidencia && (
                            <div className="bg-gray-200 p-6 rounded-lg shadow-md col-span-2 md:col-span-1">
                                <h3 className="text-xl font-bold text-blue-800 uppercase mb-4">Evidência</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700"><span className="font-semibold">Tipo:</span> {evidencia.tipo}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Data de Coleta:</span> {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(evidencia.dataColeta))}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Status:</span> {evidencia.status}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Anexos:</span></p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {evidencia.urlEvidencia.map((url, index) => (
                                            <li key={index}>
                                                <a className="text-blue-500 hover:underline" href={url} target="_blank" rel="noopener noreferrer">
                                                    Link {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {paciente && (
                            <div className="bg-gray-200 p-6 rounded-lg shadow-md col-span-2 md:col-span-1">
                                <h3 className="text-xl font-bold text-blue-800 uppercase mb-4">Paciente</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700"><span className="font-semibold">ID:</span> {paciente._id}</p>
                                    {paciente.nome && <p className="text-gray-700"><span className="font-semibold">Nome:</span> {paciente.nome}</p>}
                                    {paciente.cpf && <p className="text-gray-700"><span className="font-semibold">CPF:</span> {paciente.cpf}</p>}
                                    {paciente.rg && <p className="text-gray-700"><span className="font-semibold">RG:</span> {paciente.rg}</p>}
                                    {paciente.status && <p className="text-gray-700"><span className="font-semibold">Status:</span> {paciente.status}</p>}
                                </div>
                            </div>
                        )}
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
                    <div className="relative" ref={evidenciaRef}>
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
                    <div className="relative" ref={pacienteRef}>
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
                    <div className="relative" ref={laudoRef}>
                        <button
                            onClick={handleShowOptionLaudo}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200 border-2 border-purple-600 hover:border-purple-800 rounded-lg px-4 py-2"
                        >
                            Laudo
                        </button>
                        {showOptionLaudo && (
                            <div className="absolute z-10 w-48 bg-white shadow-md rounded-lg mt-2">
                                {laudoId ? (
                                    <>
                                        <Link
                                            to={`/laudos/editar/${laudoId}`}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={handleDeleteLaudo}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            {deletingLaudo ? 'Deletando...' : 'Deletar'}
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to={`/laudos/novo/${casoId}`}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                    >
                                        Criar
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    {evidenciaId && pacienteId && (<div>
                        <button
                            className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-800 transition-colors duration-200 border-2 border-purple-600 hover:border-purple-800 rounded-lg px-4 py-2"
                            onClick={generatePDF}

                        >
                            Gerar relatório
                        </button>
                    </div>)}
                </div>
            </div>
        </article>
    );
}

export default CasoArticle;




