import jsPDF from 'jspdf';

// Função auxiliar para adicionar texto com quebra de página automática
const addTextWithPageBreak = (doc, text, x, y, maxWidth, fontSize = 12, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.4;
    const pageHeight = 280;
    
    let currentY = y;
    let currentPage = doc.getCurrentPageInfo().pageNumber;
    
    for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight) {
            doc.addPage();
            currentY = 20;
            currentPage++;
        }
        doc.text(lines[i], x, currentY);
        currentY += lineHeight + 2;
    }
    
    return currentY;
};

// Função para gerar PDF de relatório
export const generateRelatorioPDF = (relatorio, caso) => {
    const doc = new jsPDF();
    
    // Configurações iniciais
    doc.setFont('helvetica');
    
    // Cabeçalho
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Título principal
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('RELATÓRIO PERICIAL', 105, 25, { align: 'center' });
    
    // Linha decorativa
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    let currentY = 50;
    
    // Informações do caso
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('INFORMAÇÕES DO CASO', 20, currentY);
    
    currentY += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    
    const casoInfo = [
        `Número do Caso: ${caso?.numero || 'N/A'}`,
        `Data de Criação: ${caso?.dataCriacao ? new Date(caso.dataCriacao).toLocaleDateString('pt-BR') : 'N/A'}`,
        `Status: ${caso?.status || 'N/A'}`,
        `Localização: ${caso?.geolocalizacao ? `${caso.geolocalizacao.latitude}, ${caso.geolocalizacao.longitude}` : 'N/A'}`
    ];
    
    casoInfo.forEach(info => {
        doc.text(info, 25, currentY);
        currentY += 8;
    });
    
    currentY += 10;
    
    // Conteúdo do relatório
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('CONTEÚDO DO RELATÓRIO', 20, currentY);
    
    currentY += 15;
    
    // Adicionar conteúdo com quebra de página automática
    currentY = addTextWithPageBreak(
        doc, 
        relatorio?.conteudo || 'Nenhum conteúdo disponível', 
        25, 
        currentY, 
        160, 
        11, 
        'normal'
    );
    
    currentY += 15;
    
    // Informações do perito
    if (currentY + 30 > 280) {
        doc.addPage();
        currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('INFORMAÇÕES DO PERITO', 20, currentY);
    
    currentY += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    
    const peritoInfo = [
        `Perito Responsável: ${relatorio?.peritoResponsavel?.nome || relatorio?.peritoResponsavel?.email || 'N/A'}`,
        `Data de Criação: ${relatorio?.createdAt ? new Date(relatorio.createdAt).toLocaleDateString('pt-BR') : 'N/A'}`,
        `Data de Atualização: ${relatorio?.updatedAt ? new Date(relatorio.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}`
    ];
    
    peritoInfo.forEach(info => {
        doc.text(info, 25, currentY);
        currentY += 8;
    });
    
    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Linha do rodapé
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(20, 290, 190, 290);
        
        // Número da página
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${totalPages}`, 105, 295, { align: 'center' });
        
        // Data de geração
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 295);
    }
    
    // Salvar PDF
    const fileName = `relatorio_${caso?.numero || 'caso'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};

// Função para gerar PDF de laudo
export const generateLaudoPDF = (laudo, evidencia) => {
    const doc = new jsPDF();
    
    // Configurações iniciais
    doc.setFont('helvetica');
    
    // Cabeçalho
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Título principal
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('LAUDO PERICIAL', 105, 25, { align: 'center' });
    
    // Linha decorativa
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    let currentY = 50;
    
    // Informações da evidência
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('INFORMAÇÕES DA EVIDÊNCIA', 20, currentY);
    
    currentY += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    
    const evidenciaInfo = [
        `Tipo de Evidência: ${evidencia?.tipo || 'N/A'}`,
        `Data de Coleta: ${evidencia?.dataColeta ? new Date(evidencia.dataColeta).toLocaleDateString('pt-BR') : 'N/A'}`,
        `Status: ${evidencia?.status || 'N/A'}`,
        `Localização: ${evidencia?.geolocalizacao ? `${evidencia.geolocalizacao.latitude}, ${evidencia.geolocalizacao.longitude}` : 'N/A'}`
    ];
    
    evidenciaInfo.forEach(info => {
        doc.text(info, 25, currentY);
        currentY += 8;
    });
    
    currentY += 10;
    
    // Descrição do laudo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('DESCRIÇÃO TÉCNICA', 20, currentY);
    
    currentY += 15;
    
    // Adicionar descrição com quebra de página automática
    currentY = addTextWithPageBreak(
        doc, 
        laudo?.descricao || 'Nenhuma descrição disponível', 
        25, 
        currentY, 
        160, 
        11, 
        'normal'
    );
    
    currentY += 15;
    
    // Conclusão do laudo
    if (currentY + 50 > 280) {
        doc.addPage();
        currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('CONCLUSÃO TÉCNICA', 20, currentY);
    
    currentY += 15;
    
    // Adicionar conclusão com quebra de página automática
    currentY = addTextWithPageBreak(
        doc, 
        laudo?.conclusao || 'Nenhuma conclusão disponível', 
        25, 
        currentY, 
        160, 
        11, 
        'normal'
    );
    
    currentY += 15;
    
    // Informações do perito
    if (currentY + 30 > 280) {
        doc.addPage();
        currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('INFORMAÇÕES DO PERITO', 20, currentY);
    
    currentY += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    
    const peritoInfo = [
        `Perito Responsável: ${laudo?.peritoResponsavel?.nome || laudo?.peritoResponsavel?.email || 'N/A'}`,
        `Data de Criação: ${laudo?.createdAt ? new Date(laudo.createdAt).toLocaleDateString('pt-BR') : 'N/A'}`,
        `Data de Atualização: ${laudo?.updatedAt ? new Date(laudo.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}`
    ];
    
    peritoInfo.forEach(info => {
        doc.text(info, 25, currentY);
        currentY += 8;
    });
    
    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Linha do rodapé
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(20, 290, 190, 290);
        
        // Número da página
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${totalPages}`, 105, 295, { align: 'center' });
        
        // Data de geração
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 295);
    }
    
    // Salvar PDF
    const fileName = `laudo_${evidencia?.tipo || 'evidencia'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}; 