import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube un PDF a Cloudinary usando Data URI (base64)
 * Este método es más confiable para archivos raw en cuentas con restricciones
 * @param pdfBuffer Buffer del PDF a subir
 * @param fileName Nombre del archivo (sin extensión)
 * @returns URL pública del PDF subido
 */
export async function uploadPDFToCloudinary(
  pdfBuffer: Uint8Array | Buffer,
  fileName: string
): Promise<string> {
  // Convertir a Buffer si es necesario
  const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  
  // Convertir a base64 Data URI
  const base64 = buffer.toString("base64");
  const dataUri = `data:application/pdf;base64,${base64}`;
  
  console.log("[Cloudinary] Iniciando upload de PDF", {
    fileName,
    bufferSize: buffer.length,
    base64Length: base64.length,
  });

  try {
    // Usar upload directo con Data URI (más confiable que stream para raw files)
    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      folder: "invoices",
      public_id: fileName,
      overwrite: true,
      invalidate: true, // Invalida CDN cache
      // NO usar format: "pdf" ya que causa problemas con raw
    });

    console.log("[Cloudinary] PDF subido exitosamente", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      type: result.type,
      access_mode: result.access_mode,
    });

    // Esperar 1 segundo para que Cloudinary propague el archivo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verificar acceso con timestamp para evitar cache
    const urlWithTimestamp = `${result.secure_url}?t=${Date.now()}`;
    const checkRes = await fetch(urlWithTimestamp, { 
      method: "HEAD",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    
    console.log("[Cloudinary] Verificación de acceso", {
      url: result.secure_url,
      status: checkRes.status,
      accessible: checkRes.ok,
      contentType: checkRes.headers.get("content-type"),
    });

    if (!checkRes.ok) {
      console.error("[Cloudinary] ⚠️ PDF subido pero NO accesible públicamente", {
        status: checkRes.status,
        suggestion: "Revisar Settings → Security en el dashboard de Cloudinary",
      });
    } else {
      console.log("[Cloudinary] ✅ PDF accesible públicamente");
    }

    return result.secure_url;
  } catch (error: any) {
    console.error("[Cloudinary] Error al subir PDF", {
      error: error.message,
      http_code: error.http_code,
      name: error.name,
    });
    throw error;
  }
}

/**
 * Elimina un PDF de Cloudinary
 * @param publicId ID público del archivo en Cloudinary
 */
export async function deletePDFFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
  } catch (error) {
    console.error("Error al eliminar PDF de Cloudinary:", error);
    throw error;
  }
}

