import { useState } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/store/language";
import heroImagePath from "@assets/Login_1776680748796.jpeg";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [productType, setProductType] = useState<'all' | 'wholesale' | 'retail'>('all');
  const [, setLocation] = useLocation();

  const { data: products, isLoading: isLoadingProducts } = useProducts({ 
    categoryId: activeCategory,
    saleType: productType,
  });
  
  const { data: categories } = useCategories();
  const { t } = useLanguage();

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section — resmin doğal oranını korur, masaüstünde 680px ile sınırlar */}
        <section
          className="relative w-full overflow-hidden"
          style={{ paddingTop: 'min(66.5%, 680px)' }}
        >
          <img
            src={heroImagePath}
            alt="LOMAFY - Üreticinin Gücü Dünyaya Açılıyor"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Butonlar — resmin subtitle sonrasına (%45) sabitlendi */}
          <div className="absolute inset-x-0" style={{ top: '45%' }}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 px-4">
              <Button
                size="lg"
                data-testid="button-alisverise-basla"
                className="rounded-full px-8 h-12 text-base font-bold bg-[#c97632] hover:bg-[#b8692a] text-white shadow-xl border-0 min-w-[180px]"
                onClick={scrollToProducts}
              >
                Alışverişe Başla
              </Button>
              <Button
                size="lg"
                data-testid="button-uretici-ol"
                onClick={() => setLocation('/producer-apply')}
                className="rounded-full px-8 h-12 text-base font-bold bg-white text-[#c97632] border-2 border-white hover:bg-white/90 shadow-xl min-w-[180px]"
              >
                Üretici Ol
              </Button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-display text-3xl font-bold mb-8">{t('home.latest_arrivals') || "Latest Arrivals"}</h2>
          
          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 hide-scrollbar">
            {categories?.map((cat) => (
              <Button 
                key={cat.id}
                data-testid={`button-category-${cat.id}`}
                variant={activeCategory === cat.id.toString() ? "default" : "outline"} 
                className="rounded-full"
                onClick={() => setActiveCategory(cat.id.toString())}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Product Type Filter */}
          <div className="flex gap-3 mb-12">
            <Button 
              data-testid="button-filter-all"
              variant={productType === 'all' ? "default" : "outline"} 
              className="rounded-full"
              onClick={() => setProductType('all')}
            >
              {t('home.all_types') || "Tüm Ürünler"}
            </Button>
            <Button 
              data-testid="button-filter-retail"
              variant={productType === 'retail' ? "default" : "outline"} 
              className="rounded-full"
              onClick={() => setProductType('retail')}
            >
              {t('home.retail') || "Perakende"}
            </Button>
            <Button 
              data-testid="button-filter-wholesale"
              variant={productType === 'wholesale' ? "default" : "outline"} 
              className="rounded-full"
              onClick={() => setProductType('wholesale')}
            >
              {t('home.wholesale') || "Toptan"}
            </Button>
          </div>

          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {!isLoadingProducts && products?.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-xl">{t('home.no_products') || "No products found."}</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
