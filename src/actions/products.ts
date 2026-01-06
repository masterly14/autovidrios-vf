"use server";

import db from "@/lib/db";
import { GlassType, InventoryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Obtener todos los productos disponibles para venta
export async function getAvailableProducts() {
  try {
    const products = await db.glassProduct.findMany({
      where: {
        active: true,
        inventory: {
          some: {
            status: InventoryStatus.IN_STOCK,
          },
        },
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
          take: 1, // Solo necesitamos saber si hay stock
        },
      },
      orderBy: [
        { make: { name: "asc" } },
        { model: { name: "asc" } },
        { glassType: "asc" },
      ],
    });

    return products.map((product) => {
      const productName = `${product.glassType} ${product.make.name} ${product.model?.name || ""}`.trim();
      const price = product.listPrice ? Number(product.listPrice) : 0;

      return {
        id: product.id.toString(),
        sku: product.sku,
        nombre: productName,
        precio: price,
        glassType: product.glassType,
        makeId: product.makeId,
        modelId: product.modelId,
        makeName: product.make.name,
        modelName: product.model?.name || "",
        description: product.description,
        oemCode: product.oemCode,
        hasStock: product.inventory.length > 0,
      };
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("Error al cargar los productos");
  }
}

// Crear o encontrar un producto basado en marca, modelo, año y tipo de vidrio
export async function createOrFindProduct(data: {
  makeId: number;
  modelId?: number;
  modelName?: string;
  year?: number;
  glassType: GlassType;
  description?: string;
  oemCode?: string;
  listPrice?: number;
}) {
  try {
    // Verificar que la marca existe
    const make = await db.vehicleMake.findUnique({
      where: { id: data.makeId },
    });

    if (!make) {
      return {
        success: false,
        message: "La marca seleccionada no existe",
      };
    }

    let modelId = data.modelId;
    let modelName = data.modelName;

    // Si se proporciona un nombre de modelo pero no ID, buscar o crear el modelo
    if (modelName && !modelId) {
      // Buscar modelo existente
      const existingModel = await db.vehicleModel.findFirst({
        where: {
          makeId: data.makeId,
          name: modelName,
        },
      });

      if (existingModel) {
        modelId = existingModel.id;
      } else {
        // Crear nuevo modelo
        const newModel = await db.vehicleModel.create({
          data: {
            makeId: data.makeId,
            name: modelName,
            yearFrom: data.year || null,
            yearTo: data.year || null,
          },
        });
        modelId = newModel.id;
      }
    }

    // Generar SKU único
    const makeCode = make.name.substring(0, 3).toUpperCase();
    const modelCode = modelName
      ? modelName.substring(0, 3).toUpperCase()
      : "GEN";
    const yearCode = data.year ? data.year.toString().slice(-2) : "00";
    const glassCode = data.glassType.substring(0, 3).toUpperCase();

    // Buscar si ya existe un producto con estas características
    const existingProduct = await db.glassProduct.findFirst({
      where: {
        makeId: data.makeId,
        modelId: modelId || null,
        glassType: data.glassType,
      },
    });

    if (existingProduct) {
      return {
        success: true,
        message: "Producto encontrado",
        productId: existingProduct.id,
        isNew: false,
      };
    }

    // Crear nuevo producto
    let sku = `${makeCode}-${modelCode}-${yearCode}-${glassCode}`;
    let counter = 1;

    // Asegurar que el SKU sea único
    while (await db.glassProduct.findUnique({ where: { sku } })) {
      sku = `${makeCode}-${modelCode}-${yearCode}-${glassCode}-${counter}`;
      counter++;
    }

    const newProduct = await db.glassProduct.create({
      data: {
        sku,
        glassType: data.glassType,
        makeId: data.makeId,
        modelId: modelId || null,
        description: data.description,
        oemCode: data.oemCode,
        listPrice: data.listPrice ? data.listPrice : null,
      },
    });

    revalidatePath("/administracion/inventario");

    return {
      success: true,
      message: "Producto creado exitosamente",
      productId: newProduct.id,
      isNew: true,
      sku: newProduct.sku,
    };
  } catch (error) {
    console.error("Error al crear o encontrar producto:", error);
    return {
      success: false,
      message: "Error al crear o encontrar el producto",
    };
  }
}

// Obtener productos con stock disponible para un producto específico
export async function getProductInventoryItems(productId: number) {
  try {
    const items = await db.inventoryItem.findMany({
      where: {
        productId,
        status: InventoryStatus.IN_STOCK,
      },
      include: {
        product: {
          include: {
            make: true,
            model: true,
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
      location: item.location,
      cost: item.cost ? Number(item.cost) : null,
      receivedAt: item.receivedAt,
      product: {
        id: item.product.id,
        sku: item.product.sku,
        glassType: item.product.glassType,
        make: item.product.make.name,
        model: item.product.model?.name || "",
      },
    }));
  } catch (error) {
    console.error("Error al obtener items de inventario:", error);
    throw new Error("Error al cargar los items de inventario");
  }
}

// Obtener un producto por ID
export async function getProductById(productId: number) {
  try {
    const product = await db.glassProduct.findUnique({
      where: { id: productId },
      include: {
        make: true,
        model: true,
        inventory: {
          where: {
            status: InventoryStatus.IN_STOCK,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      sku: product.sku,
      glassType: product.glassType,
      make: product.make.name,
      model: product.model?.name || "",
      description: product.description,
      oemCode: product.oemCode,
      listPrice: product.listPrice ? Number(product.listPrice) : null,
      currency: product.currency,
      active: product.active,
      stockCount: product.inventory.length,
    };
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw new Error("Error al cargar el producto");
  }
}

// Buscar productos por término de búsqueda
export async function searchProducts(searchTerm: string) {
  try {
    const products = await db.glassProduct.findMany({
      where: {
        active: true,
        OR: [
          { sku: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { oemCode: { contains: searchTerm, mode: "insensitive" } },
          { make: { name: { contains: searchTerm, mode: "insensitive" } } },
          { model: { name: { contains: searchTerm, mode: "insensitive" } } },
        ],
        inventory: {
          some: {
            status: InventoryStatus.IN_STOCK,
          },
        },
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
          take: 1,
        },
      },
      take: 20, // Limitar resultados
    });

    return products.map((product) => {
      const productName = `${product.glassType} ${product.make.name} ${product.model?.name || ""}`.trim();
      const price = product.listPrice ? Number(product.listPrice) : 0;

      return {
        id: product.id.toString(),
        sku: product.sku,
        nombre: productName,
        precio: price,
        glassType: product.glassType,
        makeName: product.make.name,
        modelName: product.model?.name || "",
        hasStock: product.inventory.length > 0,
      };
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    throw new Error("Error al buscar productos");
  }
}
