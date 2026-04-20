import { useUser } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLocation, Link } from "wouter";
import { Loader2, Package, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useLanguage } from "@/store/language";

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Beklemede',
  PAID: 'Ödendi',
  SHIPPED: 'Kargoda',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'İptal Edildi',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function Profile() {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  if (isLoadingUser || isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-2">{t('profile.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('profile.welcome')}, {user.name}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Package className="mr-3 w-6 h-6 text-primary" />
          {t('profile.order_history')}
        </h2>

        {!orders || orders.length === 0 ? (
          <div className="bg-secondary/30 rounded-2xl p-12 text-center border border-border">
            <p className="text-muted-foreground text-lg mb-4">{t('profile.no_orders')}</p>
            <Link href="/" className="text-primary font-medium hover:underline">
              {t('profile.start_shopping')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} data-testid={`order-card-${order.id}`} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-border pb-4 mb-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      {t('profile.order_num')} #{order.id}
                    </p>
                    <div className="flex items-center text-sm text-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      {order.createdAt
                        ? format(new Date(order.createdAt), "d MMMM yyyy", { locale: language === 'tr' ? tr : undefined })
                        : "—"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">
                      {Number(order.totalAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
