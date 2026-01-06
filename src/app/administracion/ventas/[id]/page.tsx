"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Mail, FileText } from "lucide-react";
import { getSaleById } from "@/actions/sales";
import { getInvoiceBySaleId } from "@/actions/invoice-actions";
import { useToast } from "@/hooks/use-toast";

export default function SaleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const saleId = Number(params.id);
  
  const [sale, setSale] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSaleData() {
      try {
        setIsLoading(true);
        const [saleData, invoiceData] = await Promise.all([
          getSaleById(saleId),
          getInvoiceBySaleId(saleId).catch(() => null),
        ]);
        setSale(saleData);
        setInvoice(invoiceData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la venta",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (saleId) {
      loadSaleData();
    }
  }, [saleId, toast]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "COMPLETED":
      case "Completada":
        return <Badge className="bg-green-500 hover:bg-green-600">Completada</Badge>;
      case "DRAFT":
      case "Pendiente":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "CANCELLED":
      case "Cancelada":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      CASH: "Efectivo",
      CARD: "Tarjeta",
      TRANSFER: "Transferencia",
      OTHER: "Otro",
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-neutral-500">Cargando datos de la venta...</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Venta no encontrada</h1>
          <Button onClick={() => router.push("/administracion/ventas")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Ventas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-neutral-50 p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/administracion/ventas")}
            className="border-neutral-200 hover:bg-neutral-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Detalles de Venta
            </h1>
            <p className="text-neutral-500">Venta #{sale.saleNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice?.pdfUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(invoice.pdfUrl, "_blank")}
              className="border-neutral-200 hover:bg-neutral-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de la Venta */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Número de Venta</p>
                  <p className="font-medium text-neutral-900">{sale.saleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Fecha</p>
                  <p className="font-medium text-neutral-900">
                    {new Date(sale.soldAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Estado</p>
                  {getEstadoBadge(sale.status)}
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Total</p>
                  <p className="font-bold text-lg text-neutral-900">
                    $ {Number(sale.total).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Cliente */}
          {sale.customer && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-neutral-500">Nombre</p>
                  <p className="font-medium text-neutral-900">{sale.customer.fullName}</p>
                </div>
                {sale.customer.documentNumber && (
                  <div>
                    <p className="text-sm text-neutral-500">
                      {sale.customer.documentType === "CC"
                        ? "Cédula"
                        : sale.customer.documentType === "CE"
                        ? "Cédula Extranjería"
                        : sale.customer.documentType === "NIT"
                        ? "NIT"
                        : "Documento"}
                    </p>
                    <p className="font-medium text-neutral-900">
                      {sale.customer.documentNumber}
                    </p>
                  </div>
                )}
                {sale.customer.email && (
                  <div>
                    <p className="text-sm text-neutral-500">Email</p>
                    <p className="font-medium text-neutral-900">{sale.customer.email}</p>
                  </div>
                )}
                {sale.customer.phone && (
                  <div>
                    <p className="text-sm text-neutral-500">Teléfono</p>
                    <p className="font-medium text-neutral-900">{sale.customer.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sale.lines?.map((line: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-start pb-4 border-b border-neutral-200 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">
                        {line.inventoryItem?.product
                          ? `${line.inventoryItem.product.glassType} ${line.inventoryItem.product.make.name} ${line.inventoryItem.product.model?.name || ""}`.trim()
                          : "Producto no disponible"}
                      </p>
                      <p className="text-sm text-neutral-500">
                        Cantidad: {line.quantity} × ${" "}
                        {Number(line.unitPrice).toLocaleString("es-CO")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">
                        $ {Number(line.lineTotal).toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">
                  $ {Number(sale.subtotal).toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">IVA (19%)</span>
                <span className="font-medium text-neutral-900">
                  $ {Number(sale.tax).toLocaleString("es-CO")}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="font-bold text-lg text-neutral-900">
                  $ {Number(sale.total).toLocaleString("es-CO")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pago */}
          {sale.payments && sale.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-neutral-900">
                  {getPaymentMethodName(sale.payments[0].method)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Monto: $ {Number(sale.payments[0].amount).toLocaleString("es-CO")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Factura */}
          {invoice && (
            <Card>
              <CardHeader>
                <CardTitle>Factura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">Número de Factura</p>
                  <p className="font-medium text-neutral-900">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Estado</p>
                  <Badge
                    variant={
                      invoice.status === "SENT"
                        ? "default"
                        : invoice.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {invoice.status === "SENT"
                      ? "Enviada"
                      : invoice.status === "PENDING"
                      ? "Pendiente"
                      : invoice.status}
                  </Badge>
                </div>
                {invoice.pdfUrl && (
                  <div className="pt-2">
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => window.open(invoice.pdfUrl, "_blank")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver PDF de Factura
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Visor de PDF embebido */}
      {invoice?.pdfUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa de la Factura</CardTitle>
            <CardDescription>
              Visualización del PDF de la factura desde Cloudinary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full" style={{ height: "800px" }}>
              <iframe
                src={invoice.pdfUrl}
                className="w-full h-full border border-neutral-200 rounded-lg"
                title="Vista previa de factura"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

