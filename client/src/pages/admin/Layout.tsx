import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Loader2, LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();
  const logout = useLogout();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'PRODUCER')) {
    setLocation('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const style = {
    "--sidebar-width": "16rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-secondary/20">
        <Sidebar className="border-r border-border bg-white">
          <div className="p-6">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary">
              LOMAFY<span className="text-xs ml-2 text-muted-foreground font-sans bg-secondary px-2 py-1 rounded">ADMIN</span>
            </Link>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/products">
                        <Package />
                        <span>Products</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/orders">
                        <ShoppingCart />
                        <span>Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {user.role === 'ADMIN' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin/users">
                          <Users />
                          <span>Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-border">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </button>
          </div>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
