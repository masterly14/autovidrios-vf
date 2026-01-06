import jsPDF from "jspdf";

export interface InvoiceData {
  invoiceNumber: string;
  saleNumber: string;
  fecha: string;
  cliente: {
    nombre: string;
    documento?: string;
    tipoDocumento?: string;
    email?: string;
    telefono?: string;
  };
  items: Array<{
    producto: string;
    cantidad: number;
    valorUnitario: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  metodoPago: string;
  notas?: string;
}

export function generateInvoicePDF(data: InvoiceData): Uint8Array {
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor = [192, 164, 88]; // #C0A458 (Royal Gold)
  const darkColor = [20, 24, 32]; // #141820 (Almost Black)
  const grayColor = [100, 104, 114]; // #646872 (Medium Grey)
  
  // Encabezado
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");
  
  // Logo/Texto de la empresa
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Autovidrios V&F", 20, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("World Class Glass", 20, 28);
  doc.text("Factura de Venta", 20, 35);
  
  // Información de la empresa (lado derecho)
  doc.setFontSize(9);
  doc.text("Cl. 64 #28-46, Bogotá", 150, 20);
  doc.text("Tel: +57-3113688995", 150, 25);
  doc.text("Email: info@autovidriosvf.com", 150, 30);
  doc.text("NIT: 900123456-7", 150, 35);
  
  // Información de la factura
  let yPos = 50;
  doc.setTextColor(...darkColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Factura No. ${data.invoiceNumber}`, 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Venta: ${data.saleNumber}`, 20, yPos);
  doc.text(`Fecha: ${new Date(data.fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`, 150, yPos);
  
  // Información del cliente
  yPos += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Cliente", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre: ${data.cliente.nombre}`, 20, yPos);
  
  if (data.cliente.documento && data.cliente.tipoDocumento) {
    yPos += 6;
    const tipoDoc = data.cliente.tipoDocumento === "CC" ? "Cédula" :
                   data.cliente.tipoDocumento === "CE" ? "Cédula Extranjería" :
                   data.cliente.tipoDocumento === "NIT" ? "NIT" : "Pasaporte";
    doc.text(`${tipoDoc}: ${data.cliente.documento}`, 20, yPos);
  }
  
  if (data.cliente.telefono) {
    yPos += 6;
    doc.text(`Teléfono: ${data.cliente.telefono}`, 20, yPos);
  }
  
  if (data.cliente.email) {
    yPos += 6;
    doc.text(`Email: ${data.cliente.email}`, 20, yPos);
  }
  
  // Tabla de productos
  yPos += 15;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, 170, 8, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkColor);
  doc.text("Producto", 22, yPos);
  doc.text("Cant.", 120, yPos);
  doc.text("Valor Unit.", 140, yPos);
  doc.text("Total", 170, yPos);
  
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  
  data.items.forEach((item) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(item.producto.substring(0, 50), 22, yPos);
    doc.text(item.cantidad.toString(), 120, yPos);
    doc.text(`$ ${item.valorUnitario.toLocaleString("es-CO")}`, 140, yPos);
    doc.text(`$ ${item.total.toLocaleString("es-CO")}`, 170, yPos);
    yPos += 7;
  });
  
  // Totales
  yPos += 5;
  doc.setDrawColor(...grayColor);
  doc.line(140, yPos, 190, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 140, yPos);
  doc.text(`$ ${data.subtotal.toLocaleString("es-CO")}`, 170, yPos);
  
  yPos += 6;
  doc.text("IVA (19%):", 140, yPos);
  doc.text(`$ ${data.tax.toLocaleString("es-CO")}`, 170, yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkColor);
  doc.text("TOTAL:", 140, yPos);
  doc.text(`$ ${data.total.toLocaleString("es-CO")}`, 170, yPos);
  
  // Método de pago
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(`Método de Pago: ${data.metodoPago}`, 20, yPos);
  
  // Notas
  if (data.notas) {
    yPos += 10;
    doc.setFontSize(9);
    doc.text(`Notas: ${data.notas}`, 20, yPos);
  }
  
  // Pie de página
  const pageHeight = doc.internal.pageSize.height;
  yPos = pageHeight - 30;
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text("Gracias por su compra", 105, yPos, { align: "center" });
  yPos += 5;
  doc.text("Autovidrios V&F - World Class Glass", 105, yPos, { align: "center" });
  yPos += 5;
  doc.text("Esta es una factura generada electrónicamente", 105, yPos, { align: "center" });
  
  // Convertir a Uint8Array para enviar por email
  const pdfOutput = doc.output("arraybuffer");
  return new Uint8Array(pdfOutput);
}


