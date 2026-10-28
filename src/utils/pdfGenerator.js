import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera y descarga un reporte PDF elegante para el cliente
 * con la imagen de presentación, datos del cliente y detalles del producto.
 */
export async function downloadDeliverablePDF(deliverable, elementRef = null) {
  try {
    // Si tenemos una referencia a un elemento HTML renderizado, podemos usar html2canvas
    if (elementRef && elementRef.current) {
      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const fileName = `Recuerdo_${deliverable.cliente_nombre || 'Cliente'}_${deliverable.nombre_producto}.pdf`
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(fileName);
      return true;
    }

    // Método programmatic fallback usando jsPDF directo
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Fondo decorativo de cabecera
    doc.setFillColor(253, 246, 240); // warm-100
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Título Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(192, 57, 43); // brand color
    doc.text('VIAJE DE VIDA', pageWidth / 2, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Certificado de Entrega de Recuerdos Especiales', pageWidth / 2, 28, { align: 'center' });

    // Línea divisora
    doc.setDrawColor(229, 208, 203);
    doc.setLineWidth(0.5);
    doc.line(20, 48, pageWidth - 20, 48);

    // Detalles del Cliente y Producto
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Cliente: ${deliverable.cliente_nombre || 'Estimado/a Cliente'}`, 20, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(192, 57, 43);
    doc.text(`Producto: ${deliverable.nombre_producto}`, 20, 70);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Fecha de entrega / límite: ${deliverable.fecha_limite}`, 20, 78);

    // Descripción
    if (deliverable.descripcion_leve) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      const splitText = doc.splitTextToSize(`"${deliverable.descripcion_leve}"`, pageWidth - 40);
      doc.text(splitText, 20, 88);
    }

    // Si hay imagen accesible en base64/URL
    if (deliverable.imagen_url && deliverable.imagen_url.startsWith('data:image')) {
      try {
        const startY = deliverable.descripcion_leve ? 105 : 90;
        doc.addImage(deliverable.imagen_url, 'JPEG', 20, startY, pageWidth - 40, 120, undefined, 'FAST');
      } catch (err) {
        console.warn('Could not embed image directly into PDF:', err);
      }
    }

    // Pie de página emotivo
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Conservando tus momentos mágicos para siempre • Viaje de Vida', pageWidth / 2, pageHeight - 15, { align: 'center' });

    const fileName = `Recuerdo_${deliverable.cliente_nombre || 'Cliente'}_${deliverable.nombre_producto}.pdf`
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
}
