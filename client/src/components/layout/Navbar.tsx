import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, User as UserIcon, Menu, X, LogOut, LayoutDashboard, Store, Languages } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { data: user } = useUser();
  const logout = useLogout();
  const { t, language, setLanguage } = useLanguage();

  const navLinks = [
    { href: "/", label: t('nav.shop') },
    { href: "/producers", label: t('nav.producers') },
    { href: "/our-story", label: t('nav.our_story') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              LOMAFY
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Language toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="flex items-center gap-1"
              data-testid="button-language-toggle"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase text-xs font-bold">{language}</span>
            </Button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu (desktop) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
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
                      <Link href="/admin" className="cursor-pointer w-full flex items-center text-primary font-medium">
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
              <Link href="/auth" className="hidden sm:block">
                <Button variant="outline" size="sm" className="rounded-full px-6 font-medium" data-testid="button-login">
                  {t('nav.login')}
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              data-testid="button-mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary ${location === link.href ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                data-testid={`mobile-link-${link.href.replace('/', '') || 'home'}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-border">
              {user ? (
                <>
                  <div className="px-3 py-2 text-xs text-muted-foreground font-medium">{user.email}</div>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors">
                    <UserIcon className="w-4 h-4" />
                    {t('nav.profile')}
                  </Link>
                  {(user.role === 'ADMIN' || user.role === 'PRODUCER') && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      {user.role === 'ADMIN' ? t('nav.admin') : t('nav.producer_panel')}
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-lg" data-testid="mobile-button-login">
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
