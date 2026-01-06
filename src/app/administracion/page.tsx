import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  BarChart3,
} from "lucide-react";
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
  getDashboardStats,
  getRecentSales,
  getLowStockProducts,
  getRecentMessages,
} from "@/actions/dashboard";

export default async function DashboardPage() {
  // Cargar datos dinámicos desde las acciones de servidor
  const [stats, recentSales, lowStockProducts, recentMessages] = await Promise.all([
    getDashboardStats(),
    getRecentSales(5),
    getLowStockProducts(10),
    getRecentMessages(3),
  ]);

  // Preparar datos para las tarjetas de estadísticas
  const statsCards = [
    {
      title: "Ventas Totales",
      value: `$ ${stats.totalSales.toLocaleString("es-CO")}`,
      description: `${parseFloat(stats.salesChange) >= 0 ? "+" : ""}${stats.salesChange}% desde el mes pasado`,
      icon: DollarSign,
      trend: parseFloat(stats.salesChange) >= 0 ? "up" : "down",
    },
    {
      title: "Pedidos",
      value: stats.orders.toString(),
      description: `${parseFloat(stats.ordersChange) >= 0 ? "+" : ""}${stats.ordersChange}% desde el mes pasado`,
      icon: ShoppingCart,
      trend: parseFloat(stats.ordersChange) >= 0 ? "up" : "down",
    },
    {
      title: "Productos en Cantidad",
      value: stats.productsInStock.toLocaleString("es-CO"),
      description: `${parseFloat(stats.productsChange) >= 0 ? "+" : ""}${stats.productsChange}% desde el mes pasado`,
      icon: Package,
      trend: parseFloat(stats.productsChange) >= 0 ? "up" : "down",
    },
    {
      title: "Clientes Activos",
      value: stats.activeCustomers.toString(),
      description: `${parseFloat(stats.customersChange) >= 0 ? "+" : ""}${stats.customersChange}% desde el mes pasado`,
      icon: Users,
      trend: parseFloat(stats.customersChange) >= 0 ? "up" : "down",
    },
  ];
  return (
    <div className="space-y-6 bg-neutral-50 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          const isPositive = stat.trend === "up";
          
          return (
            <Card key={stat.title} className="bg-white border-2 border-neutral-100 shadow-sm hover:border-red-100 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-neutral-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${isPositive ? 'bg-neutral-50' : 'bg-red-50'}`}>
                    <Icon className={`h-4 w-4 ${isPositive ? 'text-neutral-500' : 'text-red-500'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sección de contenido principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Ventas recientes */}
        <Card className="col-span-4 bg-white border-2 border-neutral-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-neutral-900">Ventas Recientes</CardTitle>
                <CardDescription className="text-neutral-500">
                  Últimas 5 ventas registradas
                </CardDescription>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-neutral-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-100">
                  <TableHead className="text-neutral-600 font-semibold">ID Venta</TableHead>
                  <TableHead className="text-neutral-600 font-semibold">Cliente</TableHead>
                  <TableHead className="text-neutral-600 font-semibold">Producto</TableHead>
                  <TableHead className="text-right text-neutral-600 font-semibold">Total</TableHead>
                  <TableHead className="text-neutral-600 font-semibold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-neutral-400">
                      No hay ventas recientes
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-neutral-50 border-b border-neutral-100">
                      <TableCell className="font-medium text-neutral-900">{sale.id}</TableCell>
                      <TableCell className="text-neutral-700">{sale.cliente}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-neutral-700">
                        {sale.producto}
                      </TableCell>
                      <TableCell className="text-right text-neutral-900 font-medium">
                        $ {sale.total.toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            sale.estado === "Completada"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-100"
                          } border-0 font-medium`}
                        >
                          {sale.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Productos con bajo cantidad y mensajes */}
          <div className="col-span-3 space-y-4">
          {/* Productos con bajo cantidad */}
          <Card className="bg-white border-2 border-neutral-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-neutral-900">Bajo Cantidad</CardTitle>
                  <CardDescription className="text-neutral-500">
                    Productos que requieren atención
                  </CardDescription>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                    <Package className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-4">
                    No hay productos con bajo cantidad
                  </p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-neutral-900">{product.nombre}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Cantidad: <span className="font-medium text-red-600">{product.stock}</span> / Mínimo: {product.minimo}
                        </p>
                      </div>
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Bajo</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mensajes recientes */}
          <Card className="bg-white border-2 border-neutral-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-neutral-900">Mensajes Recientes</CardTitle>
                  <CardDescription className="text-neutral-500">
                    Últimos contactos recibidos
                  </CardDescription>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-neutral-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-4">
                    No hay mensajes recientes
                  </p>
                ) : (
                  recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        !message.leido 
                            ? "bg-red-50 border-red-100" 
                            : "bg-white border-neutral-100"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-neutral-900">{message.nombre}</p>
                            {!message.leido && (
                                <span className="h-2 w-2 rounded-full bg-red-500 block" />
                            )}
                        </div>
                        <p className="text-xs text-neutral-600 mt-1">
                          {message.servicio}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {message.fecha}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

