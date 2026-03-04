import { Link, useLocation } from "wouter";
import { ShoppingBag, User as UserIcon, Menu, LogOut, LayoutDashboard, Store, Languages } from "lucide-react";
import { useCart } from "@/store/cart";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useLanguage } from "@/store/language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { data: user } = useUser();
  const logout = useLogout();
  const { t, language, setLanguage } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary">
              LOMAFY<span className="text-accent-foreground/50">.</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              {t('nav.shop')}
            </Link>
            <Link href="/producers" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/producers' ? 'text-primary' : 'text-muted-foreground'}`}>
              {t('nav.producers')}
            </Link>
            <Link href="/our-story" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/our-story' ? 'text-primary' : 'text-muted-foreground'}`}>
              {t('nav.our_story')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="flex items-center gap-2"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase text-xs font-bold">{language}</span>
            </Button>

            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer w-full flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('nav.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'PRODUCER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/products" className="cursor-pointer w-full flex items-center text-primary font-medium">
                        <Store className="mr-2 h-4 w-4" />
                        {t('nav.producer_panel')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-6 font-medium">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
