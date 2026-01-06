"use server";

import { resend } from "@/lib/resend";
import { generateInvoicePDF, type InvoiceData } from "@/lib/pdf-generator";

export interface SendInvoiceParams {
  to: string;
  invoiceData: InvoiceData;
}

export async function sendInvoiceEmail({
  to,
  invoiceData,
}: SendInvoiceParams): Promise<{ success: boolean; message: string }> {
  try {
    // Validar que el email sea válido
    if (!to || !to.includes("@")) {
      return {
        success: false,
        message: "El email proporcionado no es válido",
      };
    }

    // Generar el PDF de la factura
    const pdfBuffer = generateInvoicePDF(invoiceData);

    // Convertir Uint8Array a Buffer para Resend
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    // Enviar el email con Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Autovidrios V&F <noreply@autovidriosvf.com>",
      to: [to],
      subject: `Factura ${invoiceData.invoiceNumber} - Autovidrios V&F`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #C0A458; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Autovidrios V&F</h1>
              <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">World Class Glass</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #141820; margin-top: 0;">Estimado/a ${invoiceData.cliente.nombre},</h2>
              
              <p>Le enviamos adjunta la factura correspondiente a su compra:</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C0A458;">
                <p style="margin: 5px 0;"><strong>Número de Factura:</strong> ${invoiceData.invoiceNumber}</p>
                <p style="margin: 5px 0;"><strong>Número de Venta:</strong> ${invoiceData.saleNumber}</p>
                <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(invoiceData.fecha).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> $ ${invoiceData.total.toLocaleString("es-CO")}</p>
              </div>
              
              <p>La factura en formato PDF se encuentra adjunta a este correo.</p>
              
              <p style="margin-top: 30px;">Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="margin: 5px 0; font-size: 12px; color: #666;">
                  <strong>Autovidrios V&F - World Class Glass</strong><br>
                  Cl. 64 #28-46, Bogotá<br>
                  Tel: +57-3113688995<br>
                  Email: info@autovidriosvf.com
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `Factura-${invoiceData.invoiceNumber}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error("Error al enviar email:", error);
      return {
        success: false,
        message: `Error al enviar el email: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Factura enviada exitosamente a ${to}`,
    };
  } catch (error) {
    console.error("Error inesperado al enviar factura:", error);
    return {
      success: false,
      message: "Error inesperado al enviar la factura. Por favor, intente nuevamente.",
    };
  }
}


