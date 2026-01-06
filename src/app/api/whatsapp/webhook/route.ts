import { NextRequest, NextResponse } from "next/server";

// Token de verificación que configuraste en el panel de Meta/WhatsApp
const VERIFY_TOKEN = "masterly14";

/**
 * Verificación del webhook de WhatsApp (GET)
 * Meta llamará a esta URL con los query params:
 *  - hub.mode
 *  - hub.verify_token
 *  - hub.challenge
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("[WhatsApp Webhook][GET] Verificación recibida", {
    mode,
    tokenReceived: token ? "***" : null,
    hasChallenge: Boolean(challenge),
  });

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    console.log("[WhatsApp Webhook][GET] ✅ Verificación OK, respondiendo challenge");
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn("[WhatsApp Webhook][GET] ❌ Verificación FALLIDA", {
    mode,
    token,
  });

  return new Response("Forbidden", { status: 403 });
}

/**
 * Recibir notificaciones de WhatsApp (POST)
 * Aquí llegan:
 *  - Estados de mensajes (sent, delivered, read, failed)
 *  - Mensajes entrantes de usuarios
 */
export async function POST(req: NextRequest) {
  // Log inmediato cuando llega la petición
  console.log("[WhatsApp Webhook][POST] 🔔 Petición recibida", {
    url: req.url,
    method: req.method,
    headers: {
      "content-type": req.headers.get("content-type"),
      "user-agent": req.headers.get("user-agent"),
      "x-forwarded-for": req.headers.get("x-forwarded-for"),
    },
  });

  try {
    // Intentar leer el body como texto primero para debug
    const textBody = await req.text();
    console.log("[WhatsApp Webhook][POST] Body recibido (primeros 500 chars):", 
      textBody.substring(0, 500));
    
    // Parsear como JSON
    let body;
    try {
      body = JSON.parse(textBody);
    } catch (parseError: any) {
      console.error("[WhatsApp Webhook][POST] ❌ Error parseando JSON", {
        error: parseError.message,
        bodyPreview: textBody.substring(0, 200),
      });
      return NextResponse.json({ 
        status: "error", 
        message: "Invalid JSON" 
      }, { status: 400 });
    }
    
    console.log("[WhatsApp Webhook][POST] ✅ JSON parseado correctamente", {
      object: body.object,
      hasEntry: Boolean(body.entry),
      entryCount: body.entry?.length,
      fullBody: JSON.stringify(body, null, 2).substring(0, 1000), // Primeros 1000 chars
    });

    // Procesar cada entrada
    if (body.object === "whatsapp_business_account" && body.entry) {
      for (const entry of body.entry) {
        const changes = entry.changes || [];
        
        for (const change of changes) {
          const value = change.value;
          
          // Procesar estados de mensajes
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log("[WhatsApp Webhook] 📨 Estado de mensaje", {
                messageId: status.id,
                status: status.status, // sent, delivered, read, failed
                timestamp: status.timestamp,
                recipientId: status.recipient_id,
                conversationType: status.conversation?.origin?.type,
                // Si hay error
                errorCode: status.errors?.[0]?.code,
                errorTitle: status.errors?.[0]?.title,
                errorMessage: status.errors?.[0]?.message,
                errorDetails: status.errors?.[0]?.error_data?.details,
              });

              // Log específico para errores
              if (status.status === "failed" && status.errors) {
                console.error("[WhatsApp Webhook] ❌ MENSAJE FALLIDO", {
                  messageId: status.id,
                  errors: status.errors,
                });
              }
            }
          }

          // Procesar mensajes entrantes (si quieres responder automáticamente)
          if (value.messages) {
            for (const message of value.messages) {
              console.log("[WhatsApp Webhook] 💬 Mensaje entrante", {
                from: message.from,
                type: message.type,
                timestamp: message.timestamp,
                text: message.text?.body,
              });
            }
          }
        }
      }
    }

    // Siempre responder 200 OK para que Meta no reintente
    console.log("[WhatsApp Webhook][POST] ✅ Procesado correctamente, respondiendo 200 OK");
    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[WhatsApp Webhook][POST] ❌ Error procesando webhook", {
      error: error.message,
      stack: error.stack,
    });
    // Aún así responder 200 para evitar reintentos
    return NextResponse.json({ status: "error", message: error.message });
  }
}


