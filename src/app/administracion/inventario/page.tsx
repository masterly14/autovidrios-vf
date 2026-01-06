"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Plus,
  Search,
  Package,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  TrendingUp,
  AlertTriangle,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  getInventoryOverview,
  createInventoryItem,
  createMultipleInventoryItems,
  getVehicleMakes,
  getVehicleModels,
  getInventoryItemsByProduct,
  updateInventoryItem,
  deleteInventoryItem,
} from "@/actions/inventory";
import { getAvailableProducts, createOrFindProduct } from "@/actions/products";
import { GlassType, InventoryStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Esquema de validación para añadir un producto
const addProductSchema = z.object({
  makeId: z.string().min(1, "Debe seleccionar una marca"),
  modelName: z.string().min(1, "Debe ingresar el modelo del vehículo"),
  year: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear() + 1),
    "Debe ser un año válido"
  ),
  glassType: z.nativeEnum(GlassType, {
    required_error: "Debe seleccionar el tipo de vidrio",
  }),
  quantity: z.string().min(1, "La cantidad es requerida").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100,
    "Debe ser un número entre 1 y 100"
  ),
  location: z.string().optional(),
  description: z.string().optional(),
  listPrice: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
    "Debe ser un número válido"
  ),
});

type AddProductFormValues = z.infer<typeof addProductSchema>;

// Esquema para añadir un item individual
const addItemSchema = z.object({
  productId: z.string().min(1, "Debe seleccionar un producto"),
  serialNumber: z.string().optional(),
  lotNumber: z.string().optional(),
  location: z.string().optional(),
  cost: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
    "Debe ser un número válido"
  ),
});

type AddItemFormValues = z.infer<typeof addItemSchema>;

export default function InventarioPage() {
  const [open, setOpen] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [makeSearchOpen, setMakeSearchOpen] = useState(false);
  const [makeSearchValue, setMakeSearchValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGlassType, setFilterGlassType] = useState<string>("all");
  const [filterMake, setFilterMake] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addProductForm = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      makeId: "",
      modelName: "",
      year: "",
      glassType: GlassType.PARABRISAS,
      quantity: "1",
      location: "",
      description: "",
      listPrice: "",
    },
  });

  // Cargar modelos cuando se selecciona una marca
  useEffect(() => {
    if (selectedMake) {
      async function loadModels() {
        try {
          const modelsData = await getVehicleModels(Number(selectedMake));
          setModels(modelsData);
        } catch (error) {
          console.error("Error al cargar modelos:", error);
        }
      }
      loadModels();
    } else {
      setModels([]);
    }
  }, [selectedMake]);

  const addItemForm = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      productId: "",
      serialNumber: "",
      lotNumber: "",
      location: "",
      cost: "",
    },
  });

  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [inventoryData, makesData, productsData] = await Promise.all([
          getInventoryOverview(),
          getVehicleMakes(),
          getAvailableProducts(),
        ]);
        setInventory(inventoryData);
        setMakes(makesData || []);
        setProducts(productsData);
        
        // Log para debugging
        if (!makesData || makesData.length === 0) {
          console.warn("No se cargaron marcas. Reintentando...");
          // Reintentar una vez más
          const retryMakes = await getVehicleMakes();
          if (retryMakes && retryMakes.length > 0) {
            setMakes(retryMakes);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del inventario",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  // Cargar items de un producto específico
  useEffect(() => {
    if (selectedProduct) {
      async function loadProductItems() {
        try {
          const items = await getInventoryItemsByProduct(selectedProduct);
          setProductItems(items);
        } catch (error) {
          console.error("Error al cargar items del producto:", error);
        }
      }
      loadProductItems();
    }
  }, [selectedProduct]);

  // Filtrar inventario
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGlassType =
      filterGlassType === "all" || item.glassType === filterGlassType;

    const matchesMake =
      filterMake === "all" || item.makeId.toString() === filterMake;

    return matchesSearch && matchesGlassType && matchesMake;
  });

  const onSubmitAddProduct = async (data: AddProductFormValues, action: 'save' | 'saveAndAdd' = 'save') => {
    setIsSubmitting(true);
    try {
      // Primero crear o encontrar el producto
      const productResult = await createOrFindProduct({
        makeId: Number(data.makeId),
        modelName: data.modelName,
        year: data.year ? Number(data.year) : undefined,
        glassType: data.glassType,
        description: data.description || undefined,
        listPrice: data.listPrice ? Number(data.listPrice) : undefined,
      });

      if (!productResult.success) {
        toast({
          title: "Error",
          description: productResult.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Ahora crear los items de inventario
      const quantity = Number(data.quantity);

      const result = await createMultipleInventoryItems({
        productId: productResult.productId!,
        quantity,
        location: data.location || undefined,
      });

      if (result.success) {
        toast({
          title: "Éxito",
          description: `${productResult.isNew ? "Producto creado y " : ""}${result.message}`,
        });
        
        addProductForm.reset({
          makeId: action === 'saveAndAdd' ? data.makeId : "",
          modelName: "",
          year: "",
          glassType: GlassType.PARABRISAS,
          quantity: "1",
          location: action === 'saveAndAdd' ? data.location : "",
          description: "",
          listPrice: "",
        });
        
        if (action === 'save') {
            setSelectedMake("");
            setMakeSearchValue("");
            setModels([]);
            setOpen(false);
        } else {
            // Mantener marca seleccionada
            // No resetear selectedMake ni makeSearchValue
        }

        // Recargar inventario
        const updatedInventory = await getInventoryOverview();
        setInventory(updatedInventory);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al añadir productos:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir los productos",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitAddItem = async (data: AddItemFormValues) => {
    setIsSubmitting(true);
    try {
      const cost = data.cost ? Number(data.cost) : undefined;

      const result = await createInventoryItem({
        productId: Number(data.productId),
        serialNumber: data.serialNumber || undefined,
        lotNumber: data.lotNumber || undefined,
        location: data.location || undefined,
        cost,
      });

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        });
        addItemForm.reset();
        setOpenItem(false);

        // Recargar inventario
        const updatedInventory = await getInventoryOverview();
        setInventory(updatedInventory);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al añadir item:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir el item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewItems = async (productId: number) => {
    setSelectedProduct(productId);
  };

  const handleUpdateItemStatus = async (
    itemId: number,
    newStatus: InventoryStatus
  ) => {
    try {
      const result = await updateInventoryItem(itemId, { status: newStatus });
      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        });
        if (selectedProduct) {
          const items = await getInventoryItemsByProduct(selectedProduct);
          setProductItems(items);
        }
        const updatedInventory = await getInventoryOverview();
        setInventory(updatedInventory);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("¿Está seguro de eliminar este item?")) return;

    try {
      const result = await deleteInventoryItem(itemId);
      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        });
        if (selectedProduct) {
          const items = await getInventoryItemsByProduct(selectedProduct);
          setProductItems(items);
        }
        const updatedInventory = await getInventoryOverview();
        setInventory(updatedInventory);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  const getStatusBadge = (status: InventoryStatus) => {
    const statusConfig = {
      [InventoryStatus.IN_STOCK]: {
        label: "En Cantidad",
        variant: "default" as const,
        className: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      [InventoryStatus.RESERVED]: {
        label: "Reservado",
        variant: "secondary" as const,
        className: "bg-yellow-500 text-white hover:bg-yellow-600",
      },
      [InventoryStatus.SOLD]: {
        label: "Vendido",
        variant: "outline" as const,
        className: "bg-muted text-muted-foreground hover:bg-muted/80",
      },
      [InventoryStatus.DAMAGED]: {
        label: "Dañado",
        variant: "destructive" as const,
        className: "",
      },
      [InventoryStatus.RETURNED]: {
        label: "Devuelto",
        variant: "secondary" as const,
        className: "",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className} variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getStockBadge = (stock: number, total: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Sin Cantidad
        </Badge>
      );
    }
    if (stock < 5) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Bajo Cantidad ({stock})
        </Badge>
      );
    }
    return (
      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        En Cantidad ({stock})
      </Badge>
    );
  };

  return (
    <div className="space-y-6 bg-neutral-50 p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Inventario
          </h1>
          <p className="text-neutral-500">
            Gestiona tus productos y cantidad disponible
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openItem} onOpenChange={setOpenItem}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-neutral-200 hover:bg-neutral-50 text-neutral-700">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-neutral-200">
              <DialogHeader>
                <DialogTitle className="text-neutral-900 font-bold">
                  Añadir Item Individual
                </DialogTitle>
                <DialogDescription className="text-neutral-500">
                  Añade un item de inventario con número de serie
                </DialogDescription>
              </DialogHeader>
              <Form {...addItemForm}>
                <form
                  onSubmit={addItemForm.handleSubmit(onSubmitAddItem)}
                  className="space-y-4"
                >
                  <FormField
                    control={addItemForm.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">Producto</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-neutral-200 text-neutral-900">
                              <SelectValue placeholder="Seleccione un producto" className="text-neutral-900" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-neutral-200">
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id} className="text-neutral-900">
                                {product.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addItemForm.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">
                          Número de Serie (Opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SN-123456"
                            className="bg-white border-neutral-200"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-neutral-500">
                          Identificador único del vidrio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addItemForm.control}
                      name="lotNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-900 font-medium">
                            Número de Lote (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="LOTE-001"
                              className="bg-white border-neutral-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addItemForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-900 font-medium">
                            Ubicación (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Bodega A, Estante 3"
                              className="bg-white border-neutral-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={addItemForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-900 font-medium">
                          Costo (Opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="bg-white border-neutral-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        addItemForm.reset();
                        setOpenItem(false);
                      }}
                      disabled={isSubmitting}
                      className="border-neutral-200 hover:bg-neutral-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Añadiendo..." : "Añadir Item"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Productos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-neutral-200">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-neutral-900">
                  Añadir Productos al Inventario
                </DialogTitle>
                <DialogDescription className="text-neutral-500">
                  Registra nuevos productos y añade cantidad inicial de forma masiva
                </DialogDescription>
              </DialogHeader>
              <Form {...addProductForm}>
                <form
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna Izquierda: Información del Vehículo y Producto */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-neutral-900 border-b pb-2">Información del Vehículo</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Marca del vehículo con búsqueda */}
                            <FormField
                                control={addProductForm.control}
                                name="makeId"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-neutral-900 font-medium">
                                    Marca <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Popover open={makeSearchOpen} onOpenChange={setMakeSearchOpen} modal={true}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between bg-white border-neutral-200 text-neutral-900 focus:ring-red-500"
                                        >
                                            {field.value
                                            ? makes.find(
                                                (make) => make.id.toString() === field.value
                                                )?.name || "Seleccione la marca"
                                            : "Seleccione la marca"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border-neutral-200" align="start">
                                        <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Buscar marca..."
                                            value={makeSearchValue}
                                            onValueChange={setMakeSearchValue}
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                              {makes.length === 0 
                                                ? "Cargando marcas..." 
                                                : "No se encontró la marca."}
                                            </CommandEmpty>
                                            <CommandGroup>
                                            {makes.length > 0 ? makes
                                                .filter((make) =>
                                                make.name
                                                    .toLowerCase()
                                                    .includes(makeSearchValue.toLowerCase())
                                                )
                                                .map((make) => (
                                                <CommandItem
                                                    key={make.id}
                                                    value={make.name}
                                                    onSelect={() => {
                                                    field.onChange(make.id.toString());
                                                    setSelectedMake(make.id.toString());
                                                    addProductForm.setValue("modelName", "");
                                                    setMakeSearchOpen(false);
                                                    setMakeSearchValue("");
                                                    }}
                                                    className="hover:bg-neutral-50 cursor-pointer"
                                                >
                                                    {make.name}
                                                    <Check
                                                    className={`ml-auto h-4 w-4 ${
                                                        field.value === make.id.toString()
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    }`}
                                                    />
                                                </CommandItem>
                                                )) : null}
                                            </CommandGroup>
                                        </CommandList>
                                        </Command>
                                    </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                {/* Modelo del vehículo */}
                                <FormField
                                    control={addProductForm.control}
                                    name="modelName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-900 font-medium">
                                        Modelo <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                        <Input
                                            placeholder="Ej: Corolla"
                                            className="bg-white border-neutral-200"
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                {/* Año */}
                                <FormField
                                    control={addProductForm.control}
                                    name="year"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-900 font-medium">
                                        Año
                                        </FormLabel>
                                        <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="2024"
                                            className="bg-white border-neutral-200"
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <h4 className="font-semibold text-neutral-900 border-b pb-2 pt-2">Detalles del Vidrio</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={addProductForm.control}
                                name="glassType"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-900 font-medium">
                                    Tipo <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                    <FormControl>
                                        <SelectTrigger className="bg-white border-neutral-200 text-neutral-900">
                                        <SelectValue placeholder="Seleccione" className="text-neutral-900" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white border-neutral-200">
                                        <SelectItem value={GlassType.PARABRISAS} className="text-neutral-900">Parabrisas</SelectItem>
                                        <SelectItem value={GlassType.LUNETA} className="text-neutral-900">Luneta</SelectItem>
                                        <SelectItem value={GlassType.LATERAL} className="text-neutral-900">Lateral</SelectItem>
                                        <SelectItem value={GlassType.PANORAMICO} className="text-neutral-900">Panorámico</SelectItem>
                                        <SelectItem value={GlassType.CUSTODIO} className="text-neutral-900">Custodio</SelectItem>
                                        <SelectItem value={GlassType.OTRO} className="text-neutral-900">Otro</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={addProductForm.control}
                                name="description"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-900 font-medium">
                                    Descripción
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Detalles adicionales (sensor, térmico, etc.)"
                                        className="bg-white border-neutral-200"
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha: Inventario y Precios */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-neutral-900 border-b pb-2">Inventario y Precios</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={addProductForm.control}
                                    name="quantity"
                                    render={({ field }) => {
                                      const current = Number(field.value || "1");
                                      const displayValue = Number.isNaN(current) || current <= 0 ? 1 : current;

                                      return (
                                        <FormItem>
                                          <FormLabel className="text-neutral-900 font-medium">
                                            Cantidad <span className="text-red-500">*</span>
                                          </FormLabel>
                                          <FormControl>
                                            <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2 py-1">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700"
                                                onClick={() => {
                                                  const next = Math.max(1, displayValue - 1);
                                                  field.onChange(String(next));
                                                }}
                                              >
                                                -
                                              </Button>
                                              <span className="w-10 text-center text-sm font-semibold text-neutral-900">
                                                {displayValue}
                                              </span>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700"
                                                onClick={() => {
                                                  const next = Math.min(100, displayValue + 1);
                                                  field.onChange(String(next));
                                                }}
                                              >
                                                +
                                              </Button>
                                            </div>
                                          </FormControl>
                                          <FormDescription className="text-neutral-500 text-xs mt-1">
                                            Entre 1 y 100 unidades
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      );
                                    }}
                                />

                                <FormField
                                    control={addProductForm.control}
                                    name="location"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-900 font-medium">
                                        Ubicación
                                        </FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-neutral-200 text-neutral-900">
                                            <SelectValue placeholder="Seleccione" className="text-neutral-900" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border-neutral-200">
                                            <SelectItem value="Autovidrios" className="text-neutral-900">Autovidrios</SelectItem>
                                            <SelectItem value="World Class Glass" className="text-neutral-900">World Class Glass</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                                <FormField
                                    control={addProductForm.control}
                                    name="listPrice"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-900 font-medium">
                                        Precio venta sugerido
                                        </FormLabel>
                                        <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="bg-white border-neutral-200"
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormDescription className="text-xs">Precio de referencia para ventas</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        addProductForm.reset();
                        setOpen(false);
                      }}
                      disabled={isSubmitting}
                      className="border-neutral-200 hover:bg-neutral-50"
                    >
                      Cancelar
                    </Button>
                    <div className="flex gap-2">
                        <Button
                        type="button"
                        onClick={addProductForm.handleSubmit((data) => onSubmitAddProduct(data, 'saveAndAdd'))}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white"
                        disabled={isSubmitting}
                        >
                        {isSubmitting ? "Guardando..." : "Guardar y Agregar Otro"}
                        </Button>
                        <Button
                        type="button"
                        onClick={addProductForm.handleSubmit((data) => onSubmitAddProduct(data, 'save'))}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isSubmitting}
                        >
                        {isSubmitting ? "Guardando..." : "Guardar y Cerrar"}
                        </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border-2 border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-600">
              Total Productos
            </CardTitle>
            <div className="p-2 bg-neutral-50 rounded-lg">
                <Package className="h-4 w-4 text-neutral-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">
              {inventory.length}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Productos en catálogo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-600">
              En Cantidad
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.reduce(
                (sum, item) => sum + item.stock.inStock,
                0
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Unidades disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-600">
              Reservados
            </CardTitle>
            <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {inventory.reduce(
                (sum, item) => sum + item.stock.reserved,
                0
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Unidades reservadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-600">
              Bajo Cantidad
            </CardTitle>
            <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                inventory.filter((item) => item.stock.inStock < 5)
                  .length
              }
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Productos con menos de 5 unidades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Buscar por SKU, marca, modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-neutral-200 focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterGlassType} onValueChange={setFilterGlassType}>
            <SelectTrigger className="w-[180px] bg-white border-neutral-200 text-neutral-900">
              <SelectValue placeholder="Tipo de vidrio" className="text-neutral-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border-neutral-200">
              <SelectItem value="all" className="text-neutral-900">Todos los tipos</SelectItem>
              <SelectItem value={GlassType.PARABRISAS} className="text-neutral-900">Parabrisas</SelectItem>
              <SelectItem value={GlassType.LUNETA} className="text-neutral-900">Luneta</SelectItem>
              <SelectItem value={GlassType.LATERAL} className="text-neutral-900">Lateral</SelectItem>
              <SelectItem value={GlassType.PANORAMICO} className="text-neutral-900">Panorámico</SelectItem>
              <SelectItem value={GlassType.CUSTODIO} className="text-neutral-900">Custodio</SelectItem>
              <SelectItem value={GlassType.OTRO} className="text-neutral-900">Otro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterMake} onValueChange={setFilterMake}>
            <SelectTrigger className="w-[180px] bg-white border-neutral-200 text-neutral-900">
              <SelectValue placeholder="Marca" className="text-neutral-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border-neutral-200">
              <SelectItem value="all" className="text-neutral-900">Todas las marcas</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.id.toString()} className="text-neutral-900">
                  {make.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(filterGlassType !== "all" ||
            filterMake !== "all" ||
            searchTerm) && (
            <Button
              variant="outline"
              onClick={() => {
                setFilterGlassType("all");
                setFilterMake("all");
                setSearchTerm("");
              }}
              className="border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Vista de inventario */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-neutral-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">Vista General</TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">Items Detallados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-200">
                    <TableHead className="text-neutral-900 font-bold">
                      SKU
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold">
                      Tipo
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold">
                      Marca / Modelo
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold text-center">
                      Cantidad
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold text-center">
                      Reservado
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold text-center">
                      Vendido
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold text-right">
                      Precio
                    </TableHead>
                    <TableHead className="text-neutral-900 font-bold text-center">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-neutral-400"
                      >
                        Cargando inventario...
                      </TableCell>
                    </TableRow>
                  ) : filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-neutral-400"
                      >
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                        <TableCell className="font-medium text-neutral-900">
                          {item.sku}
                        </TableCell>
                        <TableCell className="text-neutral-600">
                          {item.glassType}
                        </TableCell>
                        <TableCell className="text-neutral-900">
                          <div>
                            <div className="font-medium">{item.make}</div>
                            <div className="text-sm text-neutral-500">
                              {item.model}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStockBadge(item.stock.inStock, item.stock.total)}
                        </TableCell>
                        <TableCell className="text-center text-neutral-600">
                          {item.stock.reserved}
                        </TableCell>
                        <TableCell className="text-center text-neutral-600">
                          {item.stock.sold}
                        </TableCell>
                        <TableCell className="text-right text-neutral-900 font-medium">
                          {item.listPrice
                            ? `$ ${item.listPrice.toLocaleString("es-CO")}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-neutral-100 hover:text-neutral-900"
                              onClick={() => handleViewItems(item.id)}
                            >
                              <Eye className="h-4 w-4 text-neutral-500" />
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
        </TabsContent>

        <TabsContent value="items" className="space-y-4 mt-4">
          {selectedProduct ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Items del Producto
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                  className="border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cerrar
                </Button>
              </div>
              <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-200">
                        <TableHead className="text-neutral-900 font-bold">
                          ID
                        </TableHead>
                        <TableHead className="text-neutral-900 font-bold">
                          Serial / Lote
                        </TableHead>
                        <TableHead className="text-neutral-900 font-bold">
                          Ubicación
                        </TableHead>
                        <TableHead className="text-neutral-900 font-bold">
                          Estado
                        </TableHead>
                        <TableHead className="text-neutral-900 font-bold">
                          Costo
                        </TableHead>
                        <TableHead className="text-neutral-900 font-bold">
                          Fecha Recepción
                        </TableHead>
                        <TableHead className="text-neutral-900 font-bold text-center">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-10 text-neutral-400"
                          >
                            No hay items para este producto
                          </TableCell>
                        </TableRow>
                      ) : (
                        productItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                            <TableCell className="font-medium text-neutral-900">
                              #{item.id}
                            </TableCell>
                            <TableCell className="text-neutral-600">
                              <div>
                                {item.serialNumber && (
                                  <div className="text-sm font-medium text-neutral-900">
                                    SN: {item.serialNumber}
                                  </div>
                                )}
                                {item.lotNumber && (
                                  <div className="text-sm text-neutral-500">
                                    Lote: {item.lotNumber}
                                  </div>
                                )}
                                {!item.serialNumber && !item.lotNumber && (
                                  <span className="text-neutral-400">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-neutral-600">
                              {item.location || "-"}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(item.status)}
                            </TableCell>
                            <TableCell className="text-neutral-600">
                              {item.cost
                                ? `$ ${item.cost.toLocaleString("es-CO")}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-neutral-600">
                              {item.receivedAt
                                ? new Date(item.receivedAt).toLocaleDateString(
                                    "es-CO"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Select
                                  value={item.status}
                                  onValueChange={(value) =>
                                    handleUpdateItemStatus(
                                      item.id,
                                      value as InventoryStatus
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[140px] h-8 text-xs bg-white border-neutral-200 text-neutral-900">
                                    <SelectValue className="text-neutral-900" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-neutral-200">
                                    <SelectItem value={InventoryStatus.IN_STOCK} className="text-neutral-900">
                                      En Cantidad
                                    </SelectItem>
                                    <SelectItem
                                      value={InventoryStatus.RESERVED}
                                      className="text-neutral-900"
                                    >
                                      Reservado
                                    </SelectItem>
                                    <SelectItem value={InventoryStatus.DAMAGED} className="text-neutral-900">
                                      Dañado
                                    </SelectItem>
                                    <SelectItem value={InventoryStatus.RETURNED} className="text-neutral-900">
                                      Devuelto
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {!item.sale && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-600" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <Card className="bg-neutral-50 border-2 border-dashed border-neutral-200 shadow-none">
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-1">No has seleccionado ningún producto</h3>
                <p className="text-neutral-500">
                  Selecciona un producto de la vista general para ver sus items
                  detallados
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Resumen */}
      <div className="flex justify-between items-center text-sm text-neutral-500">
        <span>
          Mostrando {filteredInventory.length} de {inventory.length} productos
        </span>
        <span className="font-medium">
          Total en cantidad:{" "}
          {filteredInventory
            .reduce((sum, item) => sum + item.stock.inStock, 0)
            .toLocaleString("es-CO")}
        </span>
      </div>
    </div>
  );
}

