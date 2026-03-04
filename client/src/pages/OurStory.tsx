import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/store/language";

export default function OurStory() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-display font-bold mb-8">{t('nav.our_story')}</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p>LOMAFY, üreticiden dünyaya aracısız ticaret vizyonuyla kuruldu.</p>
          <p>Amacımız yerel üreticileri güçlendirmek ve tüketicilere en doğal, en kaliteli ürünleri doğrudan ulaştırmaktır.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
