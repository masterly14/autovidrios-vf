"use server";

import db from "@/lib/db";

export async function saveContactMessage(data: {
  service: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
}) {
  const newMessage = await db.contactMessage.create({
    data,
  });
  if (newMessage) {
    return {
      status: 200,
    };
  }

  console.log("Mensaje guardado:", newMessage);
}
