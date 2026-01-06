"use server";

import db from "@/lib/db";
import { SaleStatus, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Obtener todas las ventas con filtros opcionales
export async function getSales(filters?: {
  search?: string;
  status?: SaleStatus;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.soldAt = {};
      if (filters.startDate) {
        where.soldAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.soldAt.lte = filters.endDate;
      }
    }

    if (filters?.search) {
      where.OR = [
        { saleNumber: { contains: filters.search, mode: "insensitive" } },
        { customer: { fullName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const sales = await db.sale.findMany({
      where,
      orderBy: {
        soldAt: "desc",
      },
      include: {
        customer: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            documentType: true,
            documentNumber: true,
          },
        },
        lines: {
          include: {
            inventoryItem: {
              include: {
                product: {
                  include: {
                    make: {
                      select: {
                        name: true,
                      },
                    },
                    model: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            method: true,
            amount: true,
          },
        },
        invoice: {
          select: {
            pdfUrl: true,
            invoiceNumber: true,
          },
        },
      },
    });

    return sales.map((sale) => {
      const line = sale.lines[0]; // Tomar la primera línea para mostrar
      const product = line?.inventoryItem?.product;
      const productName = product
        ? `${product.glassType} ${product.make.name} ${product.model?.name || ""}`.trim()
        : "Producto no disponible";

      const paymentMethod = sale.payments[0]?.method || PaymentMethod.CASH;
      const paymentMethodName = {
        [PaymentMethod.CASH]: "Efectivo",
        [PaymentMethod.CARD]: "Tarjeta",
        [PaymentMethod.TRANSFER]: "Transferencia",
        [PaymentMethod.OTHER]: "Otro",
      }[paymentMethod];

      return {
        id: sale.id,
        numeroVenta: sale.saleNumber,
        cliente: sale.customer?.fullName || "Cliente no registrado",
        producto: productName,
        cantidad: line?.quantity || 1,
        valorUnitario: Number(line?.unitPrice || sale.total),
        total: Number(sale.total),
        fecha: sale.soldAt.toISOString().split("T")[0],
        estado: sale.status === SaleStatus.COMPLETED ? "Completada" :
                sale.status === SaleStatus.DRAFT ? "Pendiente" :
                sale.status === SaleStatus.CANCELLED ? "Cancelada" :
                sale.status === SaleStatus.REFUNDED ? "Reembolsada" : "Otro",
        metodoPago: paymentMethodName,
        customerId: sale.customerId,
        customerEmail: sale.customer?.email,
        customerPhone: sale.customer?.phone,
        customerDocument: sale.customer?.documentNumber,
        customerDocumentType: sale.customer?.documentType,
        invoicePdfUrl: sale.invoice?.pdfUrl || null,
        invoiceNumber: sale.invoice?.invoiceNumber || null,
      };
    });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw new Error("Error al cargar las ventas");
  }
}

// Obtener una venta por ID
export async function getSaleById(saleId: number) {
  try {
    const sale = await db.sale.findUnique({
      where: { id: saleId },
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
        invoice: true,
      },
    });

    if (!sale) {
      return null;
    }

    return sale;
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    throw new Error("Error al cargar la venta");
  }
}

// Crear una nueva venta
export async function createSale(data: {
  customerId?: number;
  customerData?: {
    fullName: string;
    email?: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
  };
  inventoryItemId: number;
  quantity?: number;
  unitPrice: number;
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status?: SaleStatus;
}) {
  try {
    // Verificar que el item de inventario existe y está disponible
    const inventoryItem = await db.inventoryItem.findUnique({
      where: { id: data.inventoryItemId },
      include: {
        product: true,
        saleLine: true, // Verificar si ya está vendido
      },
    });

    if (!inventoryItem) {
      return {
        success: false,
        message: "El producto de inventario no existe",
      };
    }

    if (inventoryItem.status !== "IN_STOCK") {
      return {
        success: false,
        message: "El producto no está disponible en cantidad",
      };
    }

    if (inventoryItem.saleLine) {
      return {
        success: false,
        message: "Este producto ya ha sido vendido",
      };
    }

    // Crear o obtener cliente
    let customerId = data.customerId;
    if (!customerId && data.customerData) {
      const customer = await db.customer.create({
        data: {
          fullName: data.customerData.fullName,
          email: data.customerData.email,
          phone: data.customerData.phone,
          documentType: data.customerData.documentType,
          documentNumber: data.customerData.documentNumber,
        },
      });
      customerId = customer.id;
    }

    // Generar número de venta
    const year = new Date().getFullYear();
    const saleCount = await db.sale.count({
      where: {
        saleNumber: {
          startsWith: `V-${year}-`,
        },
      },
    });
    const saleNumber = `V-${year}-${String(saleCount + 1).padStart(3, "0")}`;

    // Calcular totales
    const quantity = data.quantity || 1;
    const discount = data.discount || 0;
    const subtotal = data.unitPrice * quantity;
    const lineTotal = subtotal - discount;
    const tax = Math.round(lineTotal * 0.19); // IVA 19%
    const total = lineTotal + tax;

    // Crear la venta en una transacción
    const sale = await db.$transaction(async (tx) => {
      // Crear la venta
      const newSale = await tx.sale.create({
        data: {
          saleNumber,
          customerId,
          status: data.status || SaleStatus.COMPLETED,
          subtotal: lineTotal,
          tax,
          total,
          notes: data.notes,
        },
      });

      // Crear la línea de venta
      await tx.saleLine.create({
        data: {
          saleId: newSale.id,
          inventoryItemId: data.inventoryItemId,
          quantity,
          unitPrice: data.unitPrice,
          discount,
          lineTotal,
        },
      });

      // Actualizar el estado del inventario
      await tx.inventoryItem.update({
        where: { id: data.inventoryItemId },
        data: {
          status: "SOLD",
        },
      });

      // Crear el pago
      await tx.payment.create({
        data: {
          saleId: newSale.id,
          method: data.paymentMethod,
          amount: total,
        },
      });

      return newSale;
    });

    revalidatePath("/administracion/ventas");
    revalidatePath("/administracion");

    return {
      success: true,
      message: "Venta registrada exitosamente",
      saleId: sale.id,
      saleNumber: sale.saleNumber,
    };
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return {
      success: false,
      message: "Error al registrar la venta",
    };
  }
}

// Actualizar estado de una venta
export async function updateSaleStatus(saleId: number, status: SaleStatus) {
  try {
    await db.sale.update({
      where: { id: saleId },
      data: { status },
    });

    revalidatePath("/administracion/ventas");
    revalidatePath("/administracion");

    return {
      success: true,
      message: "Estado de venta actualizado",
    };
  } catch (error) {
    console.error("Error al actualizar el estado de la venta:", error);
    return {
      success: false,
      message: "Error al actualizar el estado",
    };
  }
}

// Eliminar una venta (solo borradores)
export async function deleteSale(saleId: number) {
  try {
    const sale = await db.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return {
        success: false,
        message: "La venta no existe",
      };
    }

    if (sale.status !== SaleStatus.DRAFT) {
      return {
        success: false,
        message: "Solo se pueden eliminar ventas en borrador",
      };
    }

    await db.sale.delete({
      where: { id: saleId },
    });

    revalidatePath("/administracion/ventas");
    revalidatePath("/administracion");

    return {
      success: true,
      message: "Venta eliminada",
    };
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return {
      success: false,
      message: "Error al eliminar la venta",
    };
  }
}


