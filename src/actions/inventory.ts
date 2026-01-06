"use server";

import db from "@/lib/db";
import { InventoryStatus, GlassType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Obtener todos los productos con su información de inventario
export async function getInventoryOverview(filters?: {
  search?: string;
  glassType?: GlassType;
  makeId?: number;
  status?: InventoryStatus;
}) {
  try {
    const where: any = {
      active: true,
    };

    if (filters?.glassType) {
      where.glassType = filters.glassType;
    }

    if (filters?.makeId) {
      where.makeId = filters.makeId;
    }

    if (filters?.search) {
      where.OR = [
        { sku: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { oemCode: { contains: filters.search, mode: "insensitive" } },
        { make: { name: { contains: filters.search, mode: "insensitive" } } },
        { model: { name: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const products = await db.glassProduct.findMany({
      where,
      include: {
        make: {
          select: {
            id: true,
            name: true,
          },
        },
        model: {
          select: {
            id: true,
            name: true,
          },
        },
        inventory: {
          where: filters?.status ? { status: filters.status } : undefined,
        },
      },
      orderBy: [
        { make: { name: "asc" } },
        { model: { name: "asc" } },
        { glassType: "asc" },
      ],
    });

    return products.map((product) => {
      const inStock = product.inventory.filter(
        (item) => item.status === InventoryStatus.IN_STOCK
      ).length;
      const reserved = product.inventory.filter(
        (item) => item.status === InventoryStatus.RESERVED
      ).length;
      const sold = product.inventory.filter(
        (item) => item.status === InventoryStatus.SOLD
      ).length;
      const damaged = product.inventory.filter(
        (item) => item.status === InventoryStatus.DAMAGED
      ).length;
      const total = product.inventory.length;

      return {
        id: product.id,
        sku: product.sku,
        glassType: product.glassType,
        make: product.make.name,
        makeId: product.make.id,
        model: product.model?.name || "Sin modelo",
        modelId: product.model?.id,
        description: product.description,
        oemCode: product.oemCode,
        listPrice: product.listPrice ? Number(product.listPrice) : null,
        currency: product.currency,
        active: product.active,
        stock: {
          inStock,
          reserved,
          sold,
          damaged,
          total,
        },
      };
    });
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    throw new Error("Error al cargar el inventario");
  }
}

// Obtener items de inventario detallados para un producto
export async function getInventoryItemsByProduct(
  productId: number,
  filters?: {
    status?: InventoryStatus;
    location?: string;
  }
) {
  try {
    const where: any = {
      productId,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }

    const items = await db.inventoryItem.findMany({
      where,
      include: {
        product: {
          include: {
            make: true,
            model: true,
          },
        },
        saleLine: {
          include: {
            sale: {
              select: {
                saleNumber: true,
                soldAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return items.map((item) => ({
      id: item.id,
      serialNumber: item.serialNumber,
      lotNumber: item.lotNumber,
      status: item.status,
      location: item.location,
      cost: item.cost ? Number(item.cost) : null,
      receivedAt: item.receivedAt,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        sku: item.product.sku,
        glassType: item.product.glassType,
        make: item.product.make.name,
        model: item.product.model?.name || "",
      },
      sale: item.saleLine
        ? {
            saleNumber: item.saleLine.sale.saleNumber,
            soldAt: item.saleLine.sale.soldAt,
          }
        : null,
    }));
  } catch (error) {
    console.error("Error al obtener items de inventario:", error);
    throw new Error("Error al cargar los items de inventario");
  }
}

// Crear un nuevo item de inventario
export async function createInventoryItem(data: {
  productId: number;
  serialNumber?: string;
  lotNumber?: string;
  location?: string;
  cost?: number;
  receivedAt?: Date;
  status?: InventoryStatus;
}) {
  try {
    // Verificar que el producto existe
    const product = await db.glassProduct.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return {
        success: false,
        message: "El producto no existe",
      };
    }

    // Verificar que el serial number no esté duplicado si se proporciona
    if (data.serialNumber) {
      const existing = await db.inventoryItem.findUnique({
        where: { serialNumber: data.serialNumber },
      });

      if (existing) {
        return {
          success: false,
          message: "El número de serie ya existe",
        };
      }
    }

    const item = await db.inventoryItem.create({
      data: {
        productId: data.productId,
        serialNumber: data.serialNumber || null,
        lotNumber: data.lotNumber || null,
        location: data.location || null,
        cost: data.cost ? data.cost : null,
        receivedAt: data.receivedAt || new Date(),
        status: data.status || InventoryStatus.IN_STOCK,
      },
    });

    revalidatePath("/administracion/inventario");

    return {
      success: true,
      message: "Item de inventario creado exitosamente",
      itemId: item.id,
    };
  } catch (error) {
    console.error("Error al crear item de inventario:", error);
    return {
      success: false,
      message: "Error al crear el item de inventario",
    };
  }
}

// Crear múltiples items de inventario (útil para recibir lotes)
export async function createMultipleInventoryItems(data: {
  productId: number;
  quantity: number;
  lotNumber?: string;
  location?: string;
  cost?: number;
  receivedAt?: Date;
}) {
  try {
    // Verificar que el producto existe
    const product = await db.glassProduct.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return {
        success: false,
        message: "El producto no existe",
      };
    }

    if (data.quantity <= 0 || data.quantity > 100) {
      return {
        success: false,
        message: "La cantidad debe estar entre 1 y 100",
      };
    }

    // Crear múltiples items en una transacción
    const items = await db.$transaction(
      Array.from({ length: data.quantity }).map(() =>
        db.inventoryItem.create({
          data: {
            productId: data.productId,
            lotNumber: data.lotNumber || null,
            location: data.location || null,
            cost: data.cost ? data.cost : null,
            receivedAt: data.receivedAt || new Date(),
            status: InventoryStatus.IN_STOCK,
          },
        })
      )
    );

    revalidatePath("/administracion/inventario");

    return {
      success: true,
      message: `${data.quantity} items de inventario creados exitosamente`,
      itemsCreated: items.length,
    };
  } catch (error) {
    console.error("Error al crear items de inventario:", error);
    return {
      success: false,
      message: "Error al crear los items de inventario",
    };
  }
}

// Actualizar un item de inventario
export async function updateInventoryItem(
  itemId: number,
  data: {
    serialNumber?: string;
    lotNumber?: string;
    location?: string;
    cost?: number;
    status?: InventoryStatus;
  }
) {
  try {
    const item = await db.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return {
        success: false,
        message: "El item de inventario no existe",
      };
    }

    // Verificar que el serial number no esté duplicado si se cambia
    if (data.serialNumber && data.serialNumber !== item.serialNumber) {
      const existing = await db.inventoryItem.findUnique({
        where: { serialNumber: data.serialNumber },
      });

      if (existing) {
        return {
          success: false,
          message: "El número de serie ya existe",
        };
      }
    }

    await db.inventoryItem.update({
      where: { id: itemId },
      data: {
        serialNumber: data.serialNumber !== undefined ? data.serialNumber : item.serialNumber,
        lotNumber: data.lotNumber !== undefined ? data.lotNumber : item.lotNumber,
        location: data.location !== undefined ? data.location : item.location,
        cost: data.cost !== undefined ? data.cost : item.cost,
        status: data.status !== undefined ? data.status : item.status,
      },
    });

    revalidatePath("/administracion/inventario");

    return {
      success: true,
      message: "Item de inventario actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar item de inventario:", error);
    return {
      success: false,
      message: "Error al actualizar el item de inventario",
    };
  }
}

// Eliminar un item de inventario (solo si no está vendido)
export async function deleteInventoryItem(itemId: number) {
  try {
    const item = await db.inventoryItem.findUnique({
      where: { id: itemId },
      include: {
        saleLine: true,
      },
    });

    if (!item) {
      return {
        success: false,
        message: "El item de inventario no existe",
      };
    }

    if (item.saleLine) {
      return {
        success: false,
        message: "No se puede eliminar un item que ya fue vendido",
      };
    }

    await db.inventoryItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/administracion/inventario");

    return {
      success: true,
      message: "Item de inventario eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar item de inventario:", error);
    return {
      success: false,
      message: "Error al eliminar el item de inventario",
    };
  }
}

// Lista de marcas populares en Colombia
const POPULAR_COLOMBIAN_MAKES = [
  // Marcas más populares en Colombia
  "Chevrolet",
  "Renault",
  "Nissan",
  "Toyota",
  "Mazda",
  "Hyundai",
  "Kia",
  "Ford",
  "Volkswagen",
  "Suzuki",
  "Fiat",
  "Peugeot",
  "Citroën",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Jeep",
  "Dodge",
  "Ram",
  "Mitsubishi",
  "Honda",
  "Subaru",
  "Isuzu",
  // Marcas chinas populares en Colombia
  "JAC",
  "Great Wall",
  "Chery",
  "BYD",
  "MG",
  "Geely",
  "Changan",
  "BAIC",
  "Haval",
  "Wuling",
  "SAIC",
  "Maxus",
  "Zotye",
  "Lifan",
  // Marcas premium
  "Land Rover",
  "Range Rover",
  "Porsche",
  "Jaguar",
  "Mini",
  "Infiniti",
  "Lexus",
  "Acura",
  "Cadillac",
  "Lincoln",
  "Genesis",
  "Tesla",
  "Polestar",
  // Marcas europeas adicionales
  "Alfa Romeo",
  "Ferrari",
  "Lamborghini",
  "Maserati",
  "Bentley",
  "Rolls-Royce",
  "Smart",
  "Opel",
  "Seat",
  "Skoda",
  "Dacia",
  "Cupra",
  "DS",
  "Alpine",
  // Marcas americanas adicionales
  "GMC",
  "Buick",
  "Chrysler",
  "Hummer",
  // Marcas asiáticas adicionales
  "SsangYong",
  "Mahindra",
  "Tata",
  "Daihatsu",
  "Datsun",
  "Scion",
  // Marcas comerciales y camiones
  "Iveco",
  "MAN",
  "Scania",
  "Hino",
  "UD Trucks",
  "Mitsubishi Fuso",
  "Freightliner",
  "Peterbilt",
  "Kenworth",
  "Mack",
  "International",
  "Western Star",
  "Foton",
  "Dongfeng",
  "FAW",
  "Sinotruk",
  "Shacman",
  // Marcas de buses
  "Marcopolo",
  "Busscar",
  "Caio",
  "Comil",
  "Agrale",
  "Yutong",
  "King Long",
  "Zhongtong",
  "Golden Dragon",
  "Van Hool",
  "Setra",
  "Neoplan",
  "Ashok Leyland",
  "Eicher",
];

// Inicializar marcas si no existen
async function initializeMakesIfNeeded() {
  try {
    // Verificar si ya existen marcas (optimización simple)
    const count = await db.vehicleMake.count();
    
    if (count === 0) {
      console.log("Inicializando marcas de vehículos...");
      // Crear todas las marcas populares
      await db.vehicleMake.createMany({
        data: POPULAR_COLOMBIAN_MAKES.map((name) => ({ name })),
        skipDuplicates: true,
      });
      console.log("Marcas inicializadas correctamente.");
    } else if (count < POPULAR_COLOMBIAN_MAKES.length) {
       // Si hay menos marcas de las esperadas, verificamos cuáles faltan
       const existingMakes = await db.vehicleMake.findMany({ select: { name: true } });
       const existingNames = new Set(existingMakes.map((m) => m.name));
       const missingMakes = POPULAR_COLOMBIAN_MAKES.filter(
         (name) => !existingNames.has(name)
       );
       
       if (missingMakes.length > 0) {
         console.log(`Añadiendo ${missingMakes.length} marcas faltantes...`);
         await db.vehicleMake.createMany({
           data: missingMakes.map((name) => ({ name })),
           skipDuplicates: true,
         });
       }
    }
  } catch (error) {
    console.error("Error al inicializar marcas:", error);
    // Si hay error de duplicados, ignorar
    if (error && typeof error === 'object' && 'code' in error && error.code !== 'P2002') {
      // No lanzamos el error para permitir que la aplicación continúe, pero lo logueamos
      console.error("Error crítico inicializando marcas (ignorado para continuar):", error);
    }
  }
}

// Obtener todas las marcas para filtros
export async function getVehicleMakes() {
  try {
    // Intentar inicializar, pero no bloquear si falla
    // Usamos void para no esperar explícitamente si tarda mucho, 
    // aunque idealmente deberíamos esperar la primera vez.
    // Para asegurar que aparezcan, esperaremos, pero con un timeout implícito por la ejecución
    try {
        await initializeMakesIfNeeded();
    } catch (initError) {
        console.error("Fallo al inicializar marcas, intentando cargar existentes:", initError);
    }
    
    const makes = await db.vehicleMake.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return makes.map((make) => ({
      id: make.id,
      name: make.name,
    }));
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    // Retornar array vacío en lugar de lanzar error para que la UI no se rompa
    return [];
  }
}

// Obtener modelos de una marca
export async function getVehicleModels(makeId: number) {
  try {
    const models = await db.vehicleModel.findMany({
      where: {
        makeId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return models.map((model) => ({
      id: model.id,
      name: model.name,
      yearFrom: model.yearFrom,
      yearTo: model.yearTo,
    }));
  } catch (error) {
    console.error("Error al obtener modelos:", error);
    throw new Error("Error al cargar los modelos");
  }
}


