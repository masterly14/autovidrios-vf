"use server";

import db from "@/lib/db";
import { SaleStatus, InventoryStatus } from "@prisma/client";

// Estadísticas generales del dashboard
export async function getDashboardStats() {
  try {
    // Obtener el mes actual y el mes anterior para comparaciones
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Ventas totales del mes actual
    const currentMonthSales = await db.sale.aggregate({
      where: {
        status: SaleStatus.COMPLETED,
        soldAt: {
          gte: currentMonthStart,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Ventas totales del mes anterior
    const lastMonthSales = await db.sale.aggregate({
      where: {
        status: SaleStatus.COMPLETED,
        soldAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Número de pedidos (ventas) del mes actual
    const currentMonthOrders = await db.sale.count({
      where: {
        status: SaleStatus.COMPLETED,
        soldAt: {
          gte: currentMonthStart,
        },
      },
    });

    // Número de pedidos del mes anterior
    const lastMonthOrders = await db.sale.count({
      where: {
        status: SaleStatus.COMPLETED,
        soldAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    // Productos en stock
    const productsInStock = await db.inventoryItem.count({
      where: {
        status: InventoryStatus.IN_STOCK,
      },
    });

    // Productos en stock del mes anterior (aproximado)
    const lastMonthProducts = await db.inventoryItem.count({
      where: {
        status: InventoryStatus.IN_STOCK,
        createdAt: {
          lte: lastMonthEnd,
        },
      },
    });

    // Clientes activos (clientes con al menos una venta en el último mes)
    const activeCustomers = await db.customer.count({
      where: {
        sales: {
          some: {
            soldAt: {
              gte: currentMonthStart,
            },
          },
        },
      },
    });

    // Clientes activos del mes anterior
    const lastMonthActiveCustomers = await db.customer.count({
      where: {
        sales: {
          some: {
            soldAt: {
              gte: lastMonthStart,
              lte: lastMonthEnd,
            },
          },
        },
      },
    });

    // Calcular porcentajes de cambio
    const totalSales = currentMonthSales._sum.total || 0;
    const lastTotalSales = lastMonthSales._sum.total || 0;
    const salesChange = lastTotalSales > 0
      ? ((Number(totalSales) - Number(lastTotalSales)) / Number(lastTotalSales)) * 100
      : 0;

    const ordersChange = lastMonthOrders > 0
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0;

    const productsChange = lastMonthProducts > 0
      ? ((productsInStock - lastMonthProducts) / lastMonthProducts) * 100
      : 0;

    const customersChange = lastMonthActiveCustomers > 0
      ? ((activeCustomers - lastMonthActiveCustomers) / lastMonthActiveCustomers) * 100
      : 0;

    return {
      totalSales: Number(totalSales),
      salesChange: salesChange.toFixed(1),
      orders: currentMonthOrders,
      ordersChange: ordersChange.toFixed(1),
      productsInStock,
      productsChange: productsChange.toFixed(1),
      activeCustomers,
      customersChange: customersChange.toFixed(1),
    };
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    throw new Error("Error al cargar las estadísticas");
  }
}

// Ventas recientes (últimas 5)
export async function getRecentSales(limit: number = 5) {
  try {
    const sales = await db.sale.findMany({
      take: limit,
      orderBy: {
        soldAt: "desc",
      },
      include: {
        customer: {
          select: {
            fullName: true,
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
          take: 1, // Solo la primera línea para mostrar
        },
      },
    });

    return sales.map((sale) => {
      const line = sale.lines[0];
      const product = line?.inventoryItem?.product;
      const productName = product
        ? `${product.glassType} ${product.make.name} ${product.model?.name || ""}`.trim()
        : "Producto no disponible";

      return {
        id: sale.saleNumber,
        cliente: sale.customer?.fullName || "Cliente no registrado",
        producto: productName,
        cantidad: line?.quantity || 1,
        total: Number(sale.total),
        fecha: sale.soldAt.toISOString().split("T")[0],
        estado: sale.status === SaleStatus.COMPLETED ? "Completada" : 
                sale.status === SaleStatus.DRAFT ? "Pendiente" :
                sale.status === SaleStatus.CANCELLED ? "Cancelada" : "Otro",
      };
    });
  } catch (error) {
    console.error("Error al obtener ventas recientes:", error);
    throw new Error("Error al cargar las ventas recientes");
  }
}

// Productos con bajo stock
export async function getLowStockProducts(minStock: number = 10) {
  try {
    // Agrupar productos por productId y contar stock disponible
    const inventoryByProduct = await db.inventoryItem.groupBy({
      by: ["productId"],
      where: {
        status: InventoryStatus.IN_STOCK,
      },
      _count: {
        id: true,
      },
    });

    // Obtener detalles de productos con bajo stock
    const lowStockItems = inventoryByProduct.filter(
      (item) => item._count.id < minStock
    );

    const products = await db.glassProduct.findMany({
      where: {
        id: {
          in: lowStockItems.map((item) => item.productId),
        },
        active: true,
      },
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
        inventory: {
          where: {
            status: InventoryStatus.IN_STOCK,
          },
        },
      },
    });

    return products.map((product) => {
      const stockCount = product.inventory.length;
      const productName = `${product.glassType} ${product.make.name} ${product.model?.name || ""}`.trim();

      return {
        id: product.sku,
        nombre: productName,
        stock: stockCount,
        minimo: minStock,
      };
    });
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    throw new Error("Error al cargar productos con bajo stock");
  }
}

// Mensajes recientes de contacto
export async function getRecentMessages(limit: number = 3) {
  try {
    const messages = await db.contactMessage.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return messages.map((message) => ({
      id: message.id,
      nombre: message.fullName,
      email: message.email,
      servicio: message.service,
      fecha: message.createdAt.toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      leido: false, // Por ahora siempre false, se puede agregar un campo en el schema si es necesario
    }));
  } catch (error) {
    console.error("Error al obtener mensajes recientes:", error);
    throw new Error("Error al cargar los mensajes recientes");
  }
}


