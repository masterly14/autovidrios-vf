"use server";

import db from "@/lib/db";

// Obtener todos los mensajes de contacto
export async function getContactMessages(filters?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { service: { contains: filters.search, mode: "insensitive" } },
        { message: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const messages = await db.contactMessage.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return messages.map((message) => ({
      id: message.id,
      nombre: message.fullName,
      email: message.email,
      telefono: message.phone,
      servicio: message.service,
      mensaje: message.message,
      fecha: message.createdAt.toISOString(),
      fechaFormateada: message.createdAt.toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    throw new Error("Error al cargar los mensajes");
  }
}

// Obtener un mensaje por ID
export async function getContactMessageById(messageId: number) {
  try {
    const message = await db.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return null;
    }

    return {
      id: message.id,
      nombre: message.fullName,
      email: message.email,
      telefono: message.phone,
      servicio: message.service,
      mensaje: message.message,
      fecha: message.createdAt.toISOString(),
      fechaFormateada: message.createdAt.toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch (error) {
    console.error("Error al obtener el mensaje:", error);
    throw new Error("Error al cargar el mensaje");
  }
}

// Eliminar un mensaje
export async function deleteContactMessage(messageId: number) {
  try {
    await db.contactMessage.delete({
      where: { id: messageId },
    });

    return {
      success: true,
      message: "Mensaje eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    return {
      success: false,
      message: "Error al eliminar el mensaje",
    };
  }
}


