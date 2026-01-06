import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint de prueba para verificar que Ngrok está funcionando
 * GET /api/whatsapp/test
 */
export async function GET(req: NextRequest) {
  console.log("[WhatsApp Test] 🔍 Endpoint de prueba accedido", {
    url: req.url,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    status: "ok",
    message: "Webhook test endpoint funcionando",
    timestamp: new Date().toISOString(),
    url: req.url,
  });
}

/**
 * POST de prueba para simular una notificación de WhatsApp
 */
export async function POST(req: NextRequest) {
  console.log("[WhatsApp Test] 🔔 POST de prueba recibido");
  
  try {
    const body = await req.json();
    console.log("[WhatsApp Test] Body recibido:", body);
    
    return NextResponse.json({
      status: "ok",
      message: "POST recibido correctamente",
      received: body,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
    });
  }
}

