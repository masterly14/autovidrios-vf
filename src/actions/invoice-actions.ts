"use server";

import db from "@/lib/db";
import { generateInvoicePDF, type InvoiceData } from "@/lib/pdf-generator";
import { uploadPDFToCloudinary } from "@/lib/cloudinary";
import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Crea una factura y sube el PDF a Cloudinary
 */
export async function createInvoice(
  saleId: number,
  invoiceData: InvoiceData
): Promise<{ success: boolean; message: string; invoiceId?: number; pdfUrl?: string }> {
  try {
    // Verificar que la venta existe
    const sale = await db.sale.findUnique({
      where: { id: saleId },
      include: { invoice: true },
    });

    if (!sale) {
      return {
        success: false,
        message: "La venta no existe",
      };
    }

    if (sale.invoice) {
      return {
        success: false,
        message: "Esta venta ya tiene una factura asociada",
      };
    }

    // Generar el PDF
    const pdfBuffer = generateInvoicePDF(invoiceData);

    // Subir el PDF a Cloudinary
    const pdfUrl = await uploadPDFToCloudinary(
      pdfBuffer,
      `factura-${invoiceData.invoiceNumber}`
    );

    // Crear la factura en la base de datos
    const invoice = await db.invoice.create({
      data: {
        saleId,
        invoiceNumber: invoiceData.invoiceNumber,
        status: InvoiceStatus.PENDING,
        pdfUrl,
      },
    });

    revalidatePath("/administracion/ventas");
    revalidatePath(`/administracion/ventas/${saleId}`);

    return {
      success: true,
      message: "Factura creada exitosamente",
      invoiceId: invoice.id,
      pdfUrl,
    };
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return {
      success: false,
      message: "Error al crear la factura",
    };
  }
}

/**
 * Obtiene una factura por ID de venta
 */
export async function getInvoiceBySaleId(saleId: number) {
  try {
    const invoice = await db.invoice.findUnique({
      where: { saleId },
      include: {
        sale: {
          include: {
            customer: true,
            lines: {
              include: {
                inventoryItem: {
                  include: {
                    product: {
                      include: {
                        make: true,
                        model: true,
                      },
                    },
                  },
                },
              },
            },
            payments: true,
          },
        },
      },
    });

    return invoice;
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    throw new Error("Error al cargar la factura");
  }
}

