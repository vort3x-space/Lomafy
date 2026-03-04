import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  
  const { data: products, isLoading: isLoadingProducts } = useProducts({ 
    categoryId: activeCategory 
  });
  
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* beautiful minimalist interior shot */}
            <img 
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=2000&q=80" 
              alt="Minimalist desk setup" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              Crafted with intention.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              Discover goods directly from independent makers. No markups, just pure quality and honest design.
            </p>
            <Button size="lg" className="rounded-full px-8 text-lg h-14 bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform duration-300">
              Shop the Collection
            </Button>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <h2 className="font-display text-3xl font-bold">Latest Arrivals</h2>
            
            <div className="flex overflow-x-auto pb-4 md:pb-0 mt-6 md:mt-0 space-x-2 hide-scrollbar">
              <Button 
                variant={!activeCategory ? "default" : "outline"} 
                className="rounded-full"
                onClick={() => setActiveCategory(undefined)}
              >
                All
              </Button>
              {categories?.map((cat) => (
                <Button 
                  key={cat.id}
                  variant={activeCategory === cat.id.toString() ? "default" : "outline"} 
                  className="rounded-full"
                  onClick={() => setActiveCategory(cat.id.toString())}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {products?.length === 0 && !isLoadingProducts && (
            <div className="text-center py-20 bg-secondary/50 rounded-2xl">
              <p className="text-lg text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
