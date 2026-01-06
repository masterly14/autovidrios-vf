"use server";

type SendWhatsAppTemplateParams = {
  /** Teléfono del cliente. Puede venir como 3001234567, +573001234567, 573001234567, etc. */
  toPhone: string;
  /** URL pública del PDF (Cloudinary) */
  pdfUrl: string;
  /** Variable {{1}}: número de factura */
  invoiceNumber: string;
  /** Variable {{2}}: descripción del/los productos */
  productDescription: string;
  /** Variable {{3}}: total (sin símbolo, con separadores), ej: 1.400.000 */
  totalFormatted: string;
};

type SendWhatsAppDocumentParams = {
  toPhone: string;
  pdfUrl: string;
  filename: string;
  caption?: string;
};

function normalizePhoneForWhatsApp(input: string) {
  const raw = (input || "").trim();
  const digits = raw.replace(/\D/g, "");

  // Si viene vacío, retornar vacío (lo validamos arriba)
  if (!digits) return "";

  // Si ya viene con prefijo de Colombia (57) y tiene longitud razonable
  if (digits.startsWith("57") && digits.length >= 12) return digits;

  // Si viene como 10 dígitos (celular COL típico), anteponer 57
  if (digits.length === 10) return `57${digits}`;

  // Fallback: devolver lo que venga (asumiendo que incluye país)
  return digits;
}

/**
 * Envía un documento PDF directamente por WhatsApp (sin usar plantilla)
 * Útil cuando el cliente ya ha iniciado conversación en las últimas 24 horas
 * Documentación: https://developers.facebook.com/docs/whatsapp/cloud-api/messages/document-messages
 */
export async function sendWhatsAppDocument(
  params: SendWhatsAppDocumentParams
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";

    if (!token || !phoneNumberId) {
      return {
        success: false,
        message: "Faltan variables de entorno WHATSAPP_TOKEN y/o WHATSAPP_PHONE_NUMBER_ID",
      };
    }

    const to = normalizePhoneForWhatsApp(params.toPhone);
    if (!to) {
      return { success: false, message: "Número de teléfono inválido" };
    }

    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    
    // Payload para enviar documento directo (no plantilla)
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "document",
      document: {
        link: params.pdfUrl,
        filename: params.filename,
        caption: params.caption || "",
      },
    };

    console.log("[WhatsApp] Enviando documento directo", {
      to,
      filename: params.filename,
      pdfUrl: params.pdfUrl.substring(0, 80) + "...",
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as any;

    if (!res.ok) {
      console.error("[WhatsApp] Error enviando documento", {
        status: res.status,
        error: json?.error,
      });
      return {
        success: false,
        message: json?.error?.message || `Error ${res.status}`,
      };
    }

    const messageId = json?.messages?.[0]?.id;
    console.log("[WhatsApp] Documento enviado OK", { messageId });

    return {
      success: true,
      message: "Documento enviado por WhatsApp",
      messageId,
    };
  } catch (error: any) {
    console.error("[WhatsApp] Error inesperado:", error.message);
    return { success: false, message: error.message };
  }
}

export async function sendInvoiceWhatsAppTemplate(
  params: SendWhatsAppTemplateParams
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";

    if (!token || !phoneNumberId) {
      console.error("[WhatsApp] Faltan env vars", {
        hasToken: Boolean(token),
        hasPhoneNumberId: Boolean(phoneNumberId),
      });
      return {
        success: false,
        message:
          "Faltan variables de entorno WHATSAPP_TOKEN y/o WHATSAPP_PHONE_NUMBER_ID",
      };
    }

    const to = normalizePhoneForWhatsApp(params.toPhone);
    if (!to) {
      console.error("[WhatsApp] Número inválido", { input: params.toPhone });
      return { success: false, message: "Número de teléfono inválido" };
    }

    if (!params.pdfUrl) {
      console.error("[WhatsApp] Falta pdfUrl");
      return { success: false, message: "No se proporcionó la URL del PDF" };
    }

    // Verificar que el PDF sea accesible públicamente antes de enviarlo
    console.log("[WhatsApp] Verificando accesibilidad del PDF", {
      pdfUrl: params.pdfUrl,
      pdfUrlLength: params.pdfUrl.length,
      isHttps: params.pdfUrl.startsWith("https://"),
    });

    try {
      const pdfCheck = await fetch(params.pdfUrl, {
        method: "HEAD",
        headers: { "User-Agent": "WhatsApp-Business-API" },
      });
      console.log("[WhatsApp] Verificación PDF", {
        status: pdfCheck.status,
        statusText: pdfCheck.statusText,
        contentType: pdfCheck.headers.get("content-type"),
        contentLength: pdfCheck.headers.get("content-length"),
        accessible: pdfCheck.ok,
      });

      if (!pdfCheck.ok) {
        console.error("[WhatsApp] PDF no accesible", {
          status: pdfCheck.status,
          statusText: pdfCheck.statusText,
          url: params.pdfUrl,
        });
        return {
          success: false,
          message: `El PDF no es accesible públicamente (${pdfCheck.status} ${pdfCheck.statusText})`,
        };
      }

      const contentType = pdfCheck.headers.get("content-type");
      if (contentType && !contentType.includes("pdf") && !contentType.includes("application/octet-stream")) {
        console.warn("[WhatsApp] Content-Type inesperado", { contentType });
      }
    } catch (pdfError: any) {
      console.error("[WhatsApp] Error al verificar PDF", {
        error: pdfError.message,
        url: params.pdfUrl,
      });
      return {
        success: false,
        message: `No se pudo verificar el PDF: ${pdfError.message}`,
      };
    }

    // WhatsApp Cloud API: enviar plantilla con HEADER document y BODY variables
    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    console.log("[WhatsApp] Enviando plantilla", {
      url,
      to,
      template: "factura_electronica",
      invoiceNumber: params.invoiceNumber,
      pdfUrl: params.pdfUrl.substring(0, 100) + "...", // Solo primeros 100 chars para log
    });

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "factura_electronica",
        language: { code: "es" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  link: params.pdfUrl,
                  filename: `Factura-${params.invoiceNumber}.pdf`,
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: params.invoiceNumber },
              { type: "text", text: params.productDescription },
              { type: "text", text: params.totalFormatted },
            ],
          },
        ],
      },
    };

    // Log sin token (para debug)
    console.log("[WhatsApp] Payload (sin token)", payload);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as any;

    if (!res.ok) {
      const errorMsg =
        json?.error?.message ||
        `Error WhatsApp API (${res.status}): ${res.statusText}`;
      console.error("[WhatsApp] Error API", {
        status: res.status,
        statusText: res.statusText,
        error: json?.error,
        errorCode: json?.error?.code,
        errorType: json?.error?.type,
        errorSubcode: json?.error?.error_subcode,
        errorUserTitle: json?.error?.error_user_title,
        errorUserMsg: json?.error?.error_user_msg,
        raw: JSON.stringify(json, null, 2),
      });
      return { success: false, message: errorMsg };
    }

    const messageId = json?.messages?.[0]?.id;
    const messageStatus = json?.messages?.[0]?.message_status;
    const contactWaId = json?.contacts?.[0]?.wa_id;
    
    console.log("[WhatsApp] Respuesta de API", {
      messageId,
      messageStatus,
      contactWaId,
      contactInput: json?.contacts?.[0]?.input,
      hasMessages: Boolean(json?.messages),
      messagesCount: json?.messages?.length,
    });

    // Verificar si realmente se envió
    if (!messageId) {
      console.warn("[WhatsApp] Respuesta OK pero sin messageId", { json });
      return {
        success: false,
        message: "WhatsApp no devolvió ID de mensaje",
      };
    }

    // Si el status es "accepted", el mensaje fue aceptado pero puede que no llegue
    // Esto puede pasar si:
    // 1. El número no tiene WhatsApp
    // 2. El número está en modo sandbox y no está registrado
    // 3. La plantilla tiene problemas de formato
    if (messageStatus === "accepted") {
      console.log("[WhatsApp] ⚠️ Mensaje ACEPTADO (puede tardar en llegar o no llegar si hay restricciones)");
    }

    return {
      success: true,
      message: `Mensaje enviado (status: ${messageStatus || "sent"})`,
      messageId,
    };
  } catch (error) {
    console.error("Error al enviar plantilla de WhatsApp:", error);
    return {
      success: false,
      message: "Error inesperado al enviar WhatsApp",
    };
  }
}

/**
 * Envía factura por WhatsApp - intenta con plantilla, si falla usa documento directo
 */
export async function sendInvoiceWhatsApp(
  params: SendWhatsAppTemplateParams
): Promise<{ success: boolean; message: string; messageId?: string; method?: string }> {
  // Primero intentar con plantilla
  console.log("[WhatsApp] Intentando enviar con plantilla...");
  const templateResult = await sendInvoiceWhatsAppTemplate(params);
  
  if (templateResult.success) {
    return { ...templateResult, method: "template" };
  }
  
  // Si la plantilla falla, intentar con documento directo
  // (solo funciona si el cliente ha escrito en las últimas 24h)
  console.log("[WhatsApp] Plantilla falló, intentando documento directo...");
  const caption = `📄 *Factura ${params.invoiceNumber}*\n\n` +
    `Producto: ${params.productDescription}\n` +
    `Total: $${params.totalFormatted}\n\n` +
    `Gracias por su compra - AutoVidrios`;
  
  const docResult = await sendWhatsAppDocument({
    toPhone: params.toPhone,
    pdfUrl: params.pdfUrl,
    filename: `Factura-${params.invoiceNumber}.pdf`,
    caption,
  });
  
  if (docResult.success) {
    return { ...docResult, method: "document" };
  }
  
  // Si ambos fallan, retornar el error de la plantilla (más informativo)
  return { ...templateResult, method: "failed" };
}


