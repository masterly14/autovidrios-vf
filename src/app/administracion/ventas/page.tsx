"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Eye, Edit, Trash2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import { sendInvoiceEmail } from "@/actions/invoice";
import { createInvoice } from "@/actions/invoice-actions";
import { sendInvoiceWhatsApp } from "@/actions/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { getSales, createSale } from "@/actions/sales";
import { getAvailableProducts } from "@/actions/products";
import { PaymentMethod, SaleStatus } from "@prisma/client";

// Esquema de validación para el formulario
const saleFormSchema = z.object({
  producto: z.string().min(1, "Debe seleccionar un producto"),
  valorVenta: z.string().min(1, "El valor es requerido").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Debe ser un número válido mayor a 0"
  ),
  nombreCliente: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  emailCliente: z.string().email("Email inválido").optional().or(z.literal("")),
  telefonoCliente: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  documentoCliente: z.string().optional(),
  tipoDocumento: z.string().optional(),
  metodoPago: z.string().min(1, "Debe seleccionar un método de pago"),
  enviarFactura: z.boolean().default(false),
}).refine((data) => {
  // Si se marca enviar factura, el email es requerido
  if (data.enviarFactura && (!data.emailCliente || data.emailCliente === "")) {
    return false;
  }
  return true;
}, {
  message: "El email es requerido para enviar la factura",
  path: ["emailCliente"],
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

export default function VentasPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [salesData, productsData] = await Promise.all([
          getSales(),
          getAvailableProducts(),
        ]);
        setSales(salesData);
        setProductos(productsData.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
        })));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      producto: "",
      valorVenta: "",
      nombreCliente: "",
      emailCliente: "",
      telefonoCliente: "",
      documentoCliente: "",
      tipoDocumento: "CC",
      metodoPago: "Efectivo",
      enviarFactura: false,
    },
  });

  const enviarFactura = form.watch("enviarFactura");
  const getPdfViewerUrl = (pdfUrl: string) => {
    const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      pdfUrl
    )}`;
    console.log("[PDF Viewer] Generando URL del visor", {
      originalUrl: pdfUrl,
      viewerUrl: viewerUrl.substring(0, 150) + "...",
      urlLength: pdfUrl.length,
    });
    return viewerUrl;
  };

  const onSubmit = async (data: SaleFormValues) => {
    setIsSending(true);
    
    try {
      const productoSeleccionado = productos.find((p) => p.id === data.producto);
      
      if (!productoSeleccionado) {
        toast({
          title: "Error",
          description: "Producto no encontrado",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      // Obtener el primer item de inventario disponible para este producto
      // El ID del producto en el formulario es el ID del GlassProduct
      const productId = Number(data.producto);
      const { getProductInventoryItems } = await import("@/actions/products");
      const inventoryItems = await getProductInventoryItems(productId);
      
      if (inventoryItems.length === 0) {
        toast({
          title: "Error",
          description: "No hay cantidad disponible para este producto",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      const inventoryItemId = inventoryItems[0].id;
      const valorVenta = Number(data.valorVenta);

      // Mapear método de pago
      const paymentMethodMap: Record<string, PaymentMethod> = {
        "Efectivo": PaymentMethod.CASH,
        "Tarjeta": PaymentMethod.CARD,
        "Transferencia": PaymentMethod.TRANSFER,
        "Otro": PaymentMethod.OTHER,
      };

      const selectedPaymentMethod = paymentMethodMap[data.metodoPago] || PaymentMethod.CASH;

      // Crear la venta usando la acción de servidor
      const saleResult = await createSale({
        customerData: {
          fullName: data.nombreCliente,
          email: data.emailCliente || undefined,
          phone: data.telefonoCliente,
          documentType: data.tipoDocumento,
          documentNumber: data.documentoCliente,
        },
        inventoryItemId,
        quantity: 1,
        unitPrice: valorVenta,
        paymentMethod: selectedPaymentMethod,
        status: SaleStatus.COMPLETED,
      });

      if (!saleResult.success) {
        toast({
          title: "Error",
          description: saleResult.message,
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      // Generar/guardar factura + PDF (Cloudinary) SIEMPRE al crear la venta (para poder visualizarla y enviarla por WhatsApp)
      const fechaVenta = new Date().toISOString().split("T")[0];
      const invoiceNumber = `FAC-${saleResult.saleNumber || saleResult.saleId}`;
      const subtotal = valorVenta;
      const tax = Math.round(valorVenta * 0.19);
      const total = subtotal + tax;

      const invoiceData = {
        invoiceNumber,
        saleNumber: saleResult.saleNumber || "",
        fecha: fechaVenta,
        cliente: {
          nombre: data.nombreCliente,
          documento: data.documentoCliente,
          tipoDocumento: data.tipoDocumento,
          email: data.emailCliente,
          telefono: data.telefonoCliente,
        },
        items: [
          {
            producto: productoSeleccionado.nombre,
            cantidad: 1,
            valorUnitario: valorVenta,
            total: valorVenta,
          },
        ],
        subtotal,
        tax,
        total,
        metodoPago: data.metodoPago,
      };

      let createdPdfUrl: string | undefined;
      try {
        if (saleResult.saleId) {
          const created = await createInvoice(Number(saleResult.saleId), invoiceData);
          if (created.success && created.pdfUrl) {
            createdPdfUrl = created.pdfUrl;
          } else {
            console.error("[Factura] No se obtuvo pdfUrl al crear factura", created);
            toast({
              title: "Factura no generada",
              description:
                created.message ||
                "No se pudo generar/subir la factura a Cloudinary. WhatsApp no se enviará.",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error("No se pudo crear/subir la factura a Cloudinary:", err);
        toast({
          title: "Factura no generada",
          description:
            "No se pudo generar/subir la factura a Cloudinary. Revisa las credenciales de Cloudinary.",
          variant: "destructive",
        });
      }

      // Enviar plantilla por WhatsApp (si hay PDF y teléfono)
      try {
        if (createdPdfUrl && data.telefonoCliente) {
          const totalFormatted = total.toLocaleString("es-CO");
          const waResult = await sendInvoiceWhatsApp({
            toPhone: data.telefonoCliente,
            pdfUrl: createdPdfUrl,
            invoiceNumber,
            productDescription: productoSeleccionado.nombre,
            totalFormatted,
          });

          if (!waResult.success) {
            toast({
              title: "WhatsApp no enviado",
              description: waResult.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "WhatsApp enviado",
              description: "Se envió la factura al número del cliente",
            });
          }
        } else if (!createdPdfUrl) {
          console.warn("[WhatsApp] No se intentó enviar: falta pdfUrl (Cloudinary)");
        } else if (!data.telefonoCliente) {
          console.warn("[WhatsApp] No se intentó enviar: falta teléfono del cliente");
        }
      } catch (err) {
        console.error("Error enviando WhatsApp:", err);
      }

      // Si se marcó enviar factura, enviar el email
      if (data.enviarFactura && data.emailCliente) {
        const result = await sendInvoiceEmail({
          to: data.emailCliente,
          invoiceData,
        });

        if (result.success) {
          toast({
            title: "Factura enviada",
            description: result.message,
          });
        } else {
          toast({
            title: "Error al enviar factura",
            description: result.message,
            variant: "destructive",
          });
        }
      }

      // Recargar las ventas
      const updatedSales = await getSales();
      setSales(updatedSales);

      form.reset();
      setOpen(false);
      
      toast({
        title: "Venta registrada",
        description: "La venta se ha registrado exitosamente",
      });
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la venta",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Filtrar ventas según búsqueda
  const filteredSales = sales.filter(
    (venta) =>
      venta.numeroVenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completada":
        return <Badge className="bg-green-500 hover:bg-green-600">Completada</Badge>;
      case "Pendiente":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "Cancelada":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6 bg-neutral-50 p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Ventas</h1>
          <p className="text-neutral-500">Gestión de todas las ventas realizadas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-neutral-200">
            <DialogHeader>
              <DialogTitle className="text-neutral-900 font-bold">Registrar Nueva Venta</DialogTitle>
              <DialogDescription className="text-neutral-500">
                Complete los datos del producto y del cliente para registrar la venta
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Selección de Producto */}
                <FormField
                  control={form.control}
                  name="producto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-900 font-medium">Producto</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const producto = productos.find((p) => p.id === value);
                          if (producto) {
                            form.setValue("valorVenta", producto.precio.toString());
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-neutral-200 text-neutral-900">
                            <SelectValue placeholder="Seleccione un producto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-neutral-200">
                          {productos.length === 0 ? (
                            <SelectItem value="no-products" disabled>
                              No hay productos disponibles
                            </SelectItem>
                          ) : (
                            productos.map((producto) => (
                              <SelectItem
                                key={producto.id}
                                value={producto.id}
                                className="text-neutral-900"
                              >
                                {producto.nombre} - ${" "}
                                {producto.precio.toLocaleString("es-CO")}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-neutral-500">
                        Seleccione el producto vendido
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Valor de Venta y Método de Pago */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valorVenta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">Valor de Venta</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription className="text-neutral-500">
                          Valor en pesos colombianos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">Forma de Pago</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-neutral-200 text-neutral-900">
                              <SelectValue placeholder="Seleccione método de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-neutral-200">
                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                            <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                            <SelectItem value="Transferencia">Transferencia</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-neutral-500">
                          Medio de pago utilizado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Datos del Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">Tipo de Documento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-neutral-200 text-neutral-900">
                              <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-neutral-200">
                            <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                            <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                            <SelectItem value="NIT">NIT</SelectItem>
                            <SelectItem value="PAS">Pasaporte</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentoCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">Número de Documento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234567890"
                            className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="nombreCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-900 font-medium">Nombre Completo del Cliente</FormLabel>
                      <FormControl>
                          <Input
                            placeholder="Juan Pérez"
                            className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400"
                            {...field}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emailCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">
                          Email {enviarFactura && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="cliente@example.com"
                            className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400"
                            {...field}
                            disabled={isSending}
                          />
                        </FormControl>
                        <FormDescription className="text-neutral-500">
                          {enviarFactura 
                            ? "Requerido para enviar la factura" 
                            : "Opcional"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefonoCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="3001234567"
                            className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400"
                            {...field}
                            disabled={isSending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Opción para enviar factura */}
                <FormField
                  control={form.control}
                  name="enviarFactura"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 p-4 bg-neutral-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-neutral-900 font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Enviar factura por correo electrónico
                        </FormLabel>
                        <FormDescription className="text-neutral-500">
                          Se enviará un PDF de la factura al email del cliente
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSending}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setOpen(false);
                    }}
                    disabled={isSending}
                    className="border-neutral-200 hover:bg-neutral-50"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={isSending}
                  >
                    {isSending ? "Procesando..." : "Registrar Venta"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Buscar por número, cliente o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <Button variant="outline" className="bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Tabla de ventas */}
      <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-200">
                <TableHead className="text-neutral-900 font-bold">Número Venta</TableHead>
                <TableHead className="text-neutral-900 font-bold">Fecha</TableHead>
                <TableHead className="text-neutral-900 font-bold">Cliente</TableHead>
                <TableHead className="text-neutral-900 font-bold">Producto</TableHead>
                <TableHead className="text-neutral-900 font-bold text-center">Cantidad</TableHead>
                <TableHead className="text-neutral-900 font-bold text-right">Valor Unitario</TableHead>
                <TableHead className="text-neutral-900 font-bold text-right">Total</TableHead>
                <TableHead className="text-neutral-900 font-bold">Método Pago</TableHead>
                <TableHead className="text-neutral-900 font-bold text-center">Estado</TableHead>
                <TableHead className="text-neutral-900 font-bold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10 text-neutral-400">
                    Cargando ventas...
                  </TableCell>
                </TableRow>
              ) : filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10 text-neutral-400">
                    No se encontraron ventas
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((venta) => (
                  <TableRow key={venta.id} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                    <TableCell className="font-medium text-neutral-900">{venta.numeroVenta}</TableCell>
                    <TableCell className="text-neutral-600">
                      {new Date(venta.fecha).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-neutral-900 font-medium">{venta.cliente}</TableCell>
                    <TableCell className="text-neutral-600 max-w-[200px] truncate">
                      {venta.producto}
                    </TableCell>
                    <TableCell className="text-center text-neutral-600">{venta.cantidad}</TableCell>
                    <TableCell className="text-right text-neutral-600">
                      $ {venta.valorUnitario.toLocaleString("es-CO")}
                    </TableCell>
                    <TableCell className="text-right font-bold text-neutral-900">
                      $ {venta.total.toLocaleString("es-CO")}
                    </TableCell>
                    <TableCell className="text-neutral-600">{venta.metodoPago}</TableCell>
                    <TableCell className="text-center">{getEstadoBadge(venta.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-neutral-100 hover:text-neutral-900"
                          onClick={() => {
                            console.log("[Ventas] Click en botón ver PDF", {
                              ventaId: venta.id,
                              hasPdfUrl: Boolean(venta.invoicePdfUrl),
                              pdfUrl: venta.invoicePdfUrl,
                            });
                            if (venta.invoicePdfUrl) {
                              setSelectedPdfUrl(venta.invoicePdfUrl);
                              setPdfModalOpen(true);
                            } else {
                              console.warn("[Ventas] Venta sin PDF", { ventaId: venta.id });
                              toast({
                                title: "Sin factura",
                                description: "Esta venta no tiene una factura asociada aún",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Eye className="h-4 w-4 text-neutral-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-neutral-100 hover:text-neutral-900">
                          <Edit className="h-4 w-4 text-neutral-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Resumen */}
      <div className="flex justify-between items-center text-sm text-neutral-500">
        <span>
          Mostrando {filteredSales.length} de {sales.length} ventas
        </span>
        <span className="font-medium">
          Total: ${" "}
          {filteredSales
            .reduce((sum, venta) => sum + venta.total, 0)
            .toLocaleString("es-CO")}
        </span>
      </div>

      {/* Modal para visualizar PDF */}
      <Dialog open={pdfModalOpen} onOpenChange={setPdfModalOpen}>
        <DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-hidden bg-white border-2 border-neutral-200 p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-200 flex-shrink-0">
            <DialogTitle className="text-neutral-900 font-bold">Vista Previa de Factura</DialogTitle>
            <DialogDescription className="text-neutral-500">
              Visualización del PDF de la factura desde Cloudinary
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-6">
            {selectedPdfUrl ? (
              <div className="w-full h-full border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <iframe
                  // Cloudinary a veces sirve PDFs con headers que no se dejan embeber.
                  // Google Viewer es más tolerante y permite previsualizar.
                  src={getPdfViewerUrl(selectedPdfUrl)}
                  className="w-full h-full"
                  style={{ minHeight: "70vh", height: "100%" }}
                  title="Vista previa de factura PDF"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-neutral-500">No hay PDF disponible</p>
              </div>
            )}
          </div>
          <DialogFooter className="px-6 pb-6 pt-4 border-t border-neutral-200 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setPdfModalOpen(false)}
              className="border-neutral-200 hover:bg-neutral-50"
            >
              Cerrar
            </Button>
            {selectedPdfUrl && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log("[PDF Modal] Descargando PDF", { url: selectedPdfUrl });
                    const link = document.createElement("a");
                    link.href = selectedPdfUrl;
                    link.download = `Factura-${new Date().getTime()}.pdf`;
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="border-neutral-200 hover:bg-neutral-50"
                >
                  Descargar PDF
                </Button>
                <Button
                  onClick={() => {
                    console.log("[PDF Modal] Abriendo PDF en nueva pestaña", { url: selectedPdfUrl });
                    window.open(selectedPdfUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Abrir en nueva pestaña
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

