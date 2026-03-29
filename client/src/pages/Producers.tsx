import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/store/language";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { User } from "@shared/schema";
import { Loader2, Store, Package } from "lucide-react";

export default function Producers() {
  const { t } = useLanguage();

  const { data: producers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/producers"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Compact page header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-1">{t('nav.producers') || "Üreticiler"}</h1>
          <p className="text-white/80 text-sm">
            LOMAFY platformundaki onaylı üreticiler ile doğrudan alışveriş yapın
          </p>
        </div>
      </div>

      <main className="flex-grow bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
          ) : producers && producers.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {producers.length} onaylı üretici
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {producers.map((producer) => (
                  <Link key={producer.id} href={`/producers/${producer.id}`}>
                    <div className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group cursor-pointer">
                      {/* Mini gradient bar */}
                      <div className="h-16 bg-gradient-to-br from-primary/80 to-accent flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="p-3 text-center">
                        <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
                          {producer.brandName || producer.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {producer.brandName ? producer.name : ""}
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <Package className="w-3 h-3" />
                          <span>Ürünleri Gör</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white border border-border p-12 rounded-xl text-center">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Henüz onaylanmış bir üretici bulunmuyor.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
