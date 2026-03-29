import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Store, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { User, Product } from "@shared/schema";

export default function ProducerDetail() {
  const params = useParams<{ id: string }>();
  const producerId = Number(params.id);

  const { data: producers } = useQuery<User[]>({
    queryKey: ["/api/producers"],
  });

  const producer = producers?.find(p => p.id === producerId);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { producerId }],
    queryFn: async () => {
      const res = await fetch(`/api/products?producerId=${producerId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!producerId,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/producers">
            <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Üreticilere Geri Dön
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">
                {producer?.brandName || producer?.name || "Üretici"}
              </h1>
              {producer?.brandName && (
                <p className="text-white/70 text-sm mt-0.5">{producer.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {products.length} ürün listeleniyor
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white border border-border p-12 rounded-xl text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Bu üreticiye ait ürün bulunmuyor.</p>
              <Link href="/producers">
                <Button variant="outline" className="mt-4">Üreticilere Dön</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
