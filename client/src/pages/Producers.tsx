import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/store/language";

export default function Producers() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-display font-bold mb-8">{t('nav.producers')}</h1>
        <div className="bg-secondary/20 p-12 rounded-3xl text-center">
          <p className="text-lg text-muted-foreground">Üreticilerimiz yakında burada listelenecek.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
