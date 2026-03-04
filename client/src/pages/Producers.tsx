import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/store/language";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Loader2, Store } from "lucide-react";

export default function Producers() {
  const { t } = useLanguage();
  
  const { data: producers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/producers"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-display font-bold mb-8">{t('nav.producers')}</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>
        ) : producers && producers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {producers.map((producer) => (
              <div key={producer.id} className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{producer.brandName || producer.name}</h3>
                <p className="text-muted-foreground mb-4">{producer.name}</p>
                <div className="flex items-center text-sm text-primary font-medium">
                  <span>{t('nav.shop')} &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary/20 p-12 rounded-3xl text-center">
            <p className="text-lg text-muted-foreground">Henüz onaylanmış bir üretici bulunmuyor.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
