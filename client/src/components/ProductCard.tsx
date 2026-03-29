import { Link } from "wouter";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/store/language";
import type { Product } from "@shared/schema";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: t('common.added_to_cart') || "Sepete Eklendi",
      description: `${product.name} sepetinize eklenmiştir.`,
    });
  };

  const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border h-full flex flex-col hover:shadow-lg transition-all duration-300">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.imageUrl || fallbackImg}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Stok Tükendi</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.stock > 0 ? 'Stokta' : 'Tükendi'}
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 px-3 pb-3">
            <Button 
              onClick={handleAddToCart}
              className="w-full rounded-lg shadow-lg font-semibold"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('common.add_to_cart') || 'Sepete Ekle'}
            </Button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-1">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <p className="font-bold text-lg text-primary">
              ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </p>
            <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
              {product.stock} adet
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
