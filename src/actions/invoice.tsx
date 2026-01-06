"use server";

import { resend } from "@/lib/resend";
import { generateInvoicePDF, type InvoiceData } from "@/lib/pdf-generator";
import { uploadPDFToCloudinary } from "@/lib/cloudinary";
import { render } from "@react-email/render";
import { InvoiceTemplate } from "@/emails/invoice-template";
import db from "@/lib/db";
import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import React from "react";

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

    // Subir el PDF a Cloudinary
    let pdfUrl: string | undefined;
    try {
      pdfUrl = await uploadPDFToCloudinary(
        pdfBuffer,
        `factura-${invoiceData.invoiceNumber}`
      );

      // Buscar la venta por número de venta para actualizar la factura
      const sale = await db.sale.findUnique({
        where: { saleNumber: invoiceData.saleNumber },
        include: { invoice: true },
      });

      if (sale) {
        if (sale.invoice) {
          // Actualizar la factura existente con la URL del PDF
          await db.invoice.update({
            where: { id: sale.invoice.id },
            data: {
              pdfUrl,
              status: InvoiceStatus.SENT,
              sentToEmail: to,
              sentAt: new Date(),
            },
          });
        } else {
          // Crear nueva factura si no existe
          await db.invoice.create({
            data: {
              saleId: sale.id,
              invoiceNumber: invoiceData.invoiceNumber,
              status: InvoiceStatus.SENT,
              pdfUrl,
              sentToEmail: to,
              sentAt: new Date(),
            },
          });
        }
        revalidatePath("/administracion/ventas");
      }
    } catch (cloudinaryError) {
      console.error("Error al subir PDF a Cloudinary:", cloudinaryError);
      // Continuar con el envío del email aunque falle Cloudinary
    }

    // Convertir Uint8Array a Buffer para Resend
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    // Renderizar el template de email
    const emailHtml = await render(
      <InvoiceTemplate
        invoiceNumber={invoiceData.invoiceNumber}
        saleNumber={invoiceData.saleNumber}
        date={invoiceData.fecha}
        customerName={invoiceData.cliente.nombre}
        customerDocument={invoiceData.cliente.documento}
        customerDocumentType={invoiceData.cliente.tipoDocumento}
        customerPhone={invoiceData.cliente.telefono}
        customerEmail={invoiceData.cliente.email}
        items={invoiceData.items}
        subtotal={invoiceData.subtotal}
        tax={invoiceData.tax}
        total={invoiceData.total}
        metodoPago={invoiceData.metodoPago}
      />
    );

    // Enviar el email con Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Autovidrios V&F <noreply@autovidriosvf.com>",
      to: [to],
      subject: `Factura ${invoiceData.invoiceNumber} - Autovidrios V&F`,
      html: emailHtml,
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
