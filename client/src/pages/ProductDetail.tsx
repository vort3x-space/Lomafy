import { useParams } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/store/cart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(Number(id));
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{t('product.not_found')}</h2>
        <Button onClick={() => window.history.back()}>{t('product.back')}</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: t('common.added_to_cart') || "Added to cart",
      description: `${quantity}x ${product.name} ${t('common.added_to_cart_desc') || 'added'}.`,
    });
  };

  const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          {t('product.back')}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-secondary border border-border/50 shadow-sm relative">
            <img 
              src={product.imageUrl || fallbackImg} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center py-6">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-primary mb-8">
              ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </p>
            
            <div className="prose text-muted-foreground mb-10">
              <p className="leading-relaxed text-lg">{product.description}</p>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-sm text-foreground uppercase tracking-widest">{t('product.quantity')}</span>
                <div className="flex items-center border border-border rounded-full p-1 bg-white shadow-sm">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full rounded-2xl h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={handleAddToCart}
                disabled={!product.isActive || product.stock === 0}
              >
                {!product.isActive ? t('product.unavailable') : product.stock === 0 ? t('product.out_of_stock') : t('common.add_to_cart')}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
              <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <span>{t('product.shipping')}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <span>{t('product.warranty')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
