"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Panel",
    icon: LayoutDashboard,
    href: "/administracion",
  },
  {
    title: "Ventas",
    icon: ShoppingCart,
    href: "/administracion/ventas",
  },
  {
    title: "Inventario",
    icon: Package,
    href: "/administracion/inventario",
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/administracion/clientes",
  },
];

export default function AdministracionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="bg-white border-r-2 border-neutral-200">
        <SidebarHeader className="bg-white border-b-2 border-neutral-200">
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-900">Autovidrios V&F</span>
              <span className="text-xs text-neutral-500">Administración</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel className="text-neutral-500 font-medium">Menú Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={`text-neutral-600 hover:text-red-600 hover:bg-red-50 data-[active=true]:bg-red-600 data-[active=true]:text-white transition-all duration-200 font-medium ${
                          isActive ? "shadow-md" : ""
                        }`}
                      >
                        <Link href={item.href} className="flex items-center gap-2">
                          <Icon className={isActive ? "text-white" : "text-neutral-500 group-hover:text-red-600"} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white border-t-2 border-neutral-200">
          <div className="px-4 py-2 text-xs text-neutral-400">
            Versión 1.0.0
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-neutral-50">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-neutral-200 bg-white px-4 shadow-sm">
          <SidebarTrigger className="-ml-1 text-neutral-600 hover:text-red-600" />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-neutral-900">Panel de Administración</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 bg-neutral-50 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

