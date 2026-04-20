import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/store/language";
import { CheckCircle2 } from "lucide-react";

export default function OurStory() {
  const { t } = useLanguage();

  const producerBenefits = [
    "Ürünlerini Türkiye ve global pazarda satışa çıkarma imkânı",
    "Hem toptan hem perakende satış yapabilme özgürlüğü",
    "Kendi mağaza ve ürün yönetim sistemini kendin kontrol etme",
    "Aracı maliyetleri olmadan daha fazla kazanç potansiyeli",
    "Kolay ve hızlı kullanım ile dijital mağaza yönetimi",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-border py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-display font-bold text-foreground mb-6">
              {t('nav.our_story')}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              LOMAFY, üreticiler ile alıcıları bir araya getiren dijital bir ticaret platformudur.
              Türkiye'de ve dünyada üreticilerin ürünlerini hem toptan hem de perakende olarak satışa sunmalarını sağlar.
            </p>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Amaç, üreticilerin aracı olmadan daha geniş bir pazara ulaşmasını kolaylaştırmaktır.
            </p>
          </div>
        </section>

        {/* Producer benefits */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-10 text-center">
              LOMAFY Üreticiye Ne Katar?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {producerBenefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-medium leading-snug">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration */}
        <section className="bg-primary/5 border-t border-border py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Kayıt Sistemi
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-2">
              LOMAFY'a kayıt tamamen <span className="font-semibold text-primary">ücretsizdir</span>.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Üreticiler sisteme kolayca dahil olup kendi mağazalarını oluşturabilir ve satışa hemen başlayabilir.
            </p>
            <a
              href="/producer-apply"
              className="inline-block bg-primary text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-primary/90 transition-colors shadow-md"
              data-testid="link-become-producer"
            >
              Üretici Ol →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
