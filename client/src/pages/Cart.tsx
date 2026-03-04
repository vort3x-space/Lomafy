import { Link, useLocation } from "wouter";
import { useCart } from "@/store/cart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [, setLocation] = useLocation();

  const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80";

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold mb-10">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-border p-8">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-2xl font-semibold mb-4">It's a bit empty here</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't added anything to your cart yet. Discover our curated collection of premium goods.
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-border group hover:shadow-md transition-shadow">
                  <div className="w-24 h-32 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                    <img 
                      src={product.imageUrl || fallbackImg} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-6 flex flex-col justify-between flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${product.id}`} className="font-semibold text-lg hover:text-primary transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-primary font-medium mt-1">${Number(product.price).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center border border-border rounded-full p-1 bg-secondary/50">
                        <button 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-border p-8 sticky top-24">
                <h3 className="font-semibold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6 border-b border-border pb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">${total().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground font-medium">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-lg font-bold mb-8">
                  <span>Total</span>
                  <span>${total().toFixed(2)}</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full rounded-2xl h-14 text-lg shadow-md group"
                  onClick={() => setLocation('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
