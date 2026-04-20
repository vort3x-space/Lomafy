import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useLanguage } from "@/store/language";
import { Loader2, LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft } from "lucide-react";
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
  const { t } = useLanguage();

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
          <div className="p-6 border-b border-border">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary">
              LOMAFY<span className="text-xs ml-2 text-muted-foreground font-sans bg-secondary px-2 py-1 rounded">
                {user.role === 'ADMIN' ? 'ADMIN' : 'ÜRETİCİ'}
              </span>
            </Link>
          </div>

          {/* Back to main site */}
          <div className="px-4 pt-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('admin.back_home')}
            </Link>
          </div>

          <SidebarContent className="mt-2">
            <SidebarGroup>
              <SidebarGroupLabel>{t('admin.management')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin">
                        <LayoutDashboard />
                        <span>{t('admin.dashboard')}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/products">
                        <Package />
                        <span>{t('admin.products')}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/orders">
                        <ShoppingCart />
                        <span>{t('admin.orders')}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {user.role === 'ADMIN' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin/users">
                          <Users />
                          <span>{t('admin.users')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto p-4 border-t border-border">
            <div className="mb-3 px-2 py-1">
              <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('admin.logout')}
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
