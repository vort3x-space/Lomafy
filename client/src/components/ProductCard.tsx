import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  {/* placeholder image if none exists */}
  const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary mb-4">
        <img
          src={product.imageUrl || fallbackImg}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 px-4">
          <Button 
            onClick={handleAddToCart}
            className="w-full rounded-full shadow-lg shadow-black/20 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground text-lg group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>
        <p className="font-semibold text-primary pl-4">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
