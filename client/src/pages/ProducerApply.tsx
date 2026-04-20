import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, User, Phone, Mail, MapPin, Factory, Hash, ChevronRight } from "lucide-react";

const SECTORS = [
  { value: "tekstil", label: "Tekstil" },
  { value: "ayakkabi", label: "Ayakkabı" },
  { value: "metal", label: "Metal & Sanayi" },
  { value: "elektronik", label: "Elektronik" },
  { value: "makine", label: "Makine & Ekipman" },
  { value: "diger", label: "Diğer" },
];

const CATEGORIES = [
  "Tekstil & Hazır Giyim",
  "Ayakkabı & Deri Ürünleri",
  "Metal & Demir Çelik",
  "Elektronik & Teknoloji",
  "Makine & Ekipman",
  "Gıda & Tarım",
  "Kimya & Plastik",
  "Ahşap & Mobilya",
  "İnşaat Malzemeleri",
  "Diğer",
];

export default function ProducerApply() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    taxId: "",
    sector: "",
    productionCapacity: "",
    contactName: "",
    phone: "",
    email: "",
    productionAddress: "",
    productCategory: "",
    password: "",
    passwordConfirm: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      toast({ title: "Şifreler eşleşmiyor", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Şifre en az 6 karakter olmalıdır", variant: "destructive" });
      return;
    }
    if (!form.sector) {
      toast({ title: "Lütfen sektör seçin", variant: "destructive" });
      return;
    }
    if (!form.productCategory) {
      toast({ title: "Lütfen ürün kategorisi seçin", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/producer-register", {
        companyName: form.companyName,
        taxId: form.taxId,
        sector: form.sector,
        productionCapacity: parseInt(form.productionCapacity),
        contactName: form.contactName,
        phone: form.phone,
        email: form.email,
        productionAddress: form.productionAddress,
        productCategory: form.productCategory,
        password: form.password,
      });
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Başvuru gönderilemedi",
        description: err.message || "Lütfen bilgilerinizi kontrol edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Başvurunuz Alındı!</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Üretici başvurunuz başarıyla alındı. Ekibimiz en kısa sürede inceleyerek size dönüş yapacaktır.
              Hesabınız onaylandıktan sonra giriş yapabilirsiniz.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setLocation("/")}>Ana Sayfaya Dön</Button>
              <Button onClick={() => setLocation("/auth")}>Giriş Yap</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
              <Factory className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Üretici Başvurusu</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Lomafy platformunda ürünlerinizi dünya genelindeki alıcı ağıyla buluşturun.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Firma Bilgileri */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Firma Bilgileri</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">Firma Adı *</Label>
                  <Input
                    id="companyName"
                    data-testid="input-companyName"
                    required
                    className="mt-1 h-11"
                    placeholder="Şirket / İşletme adı"
                    value={form.companyName}
                    onChange={set("companyName")}
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">Vergi Numarası / Mersis No *</Label>
                  <Input
                    id="taxId"
                    data-testid="input-taxId"
                    required
                    className="mt-1 h-11"
                    placeholder="Vergi No veya Mersis No"
                    value={form.taxId}
                    onChange={set("taxId")}
                  />
                </div>
                <div>
                  <Label htmlFor="productionCapacity">Üretim Kapasitesi (adet / ay) *</Label>
                  <Input
                    id="productionCapacity"
                    data-testid="input-productionCapacity"
                    required
                    type="number"
                    min="1"
                    className="mt-1 h-11"
                    placeholder="örn. 5000"
                    value={form.productionCapacity}
                    onChange={set("productionCapacity")}
                  />
                </div>
                <div>
                  <Label>Sektör *</Label>
                  <Select value={form.sector} onValueChange={(v) => setForm((p) => ({ ...p, sector: v }))}>
                    <SelectTrigger className="mt-1 h-11" data-testid="select-sector">
                      <SelectValue placeholder="Sektör seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ürün Kategorisi *</Label>
                  <Select value={form.productCategory} onValueChange={(v) => setForm((p) => ({ ...p, productCategory: v }))}>
                    <SelectTrigger className="mt-1 h-11" data-testid="select-productCategory">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">İletişim Bilgileri</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="contactName">Yetkili Kişi Adı Soyadı *</Label>
                  <Input
                    id="contactName"
                    data-testid="input-contactName"
                    required
                    className="mt-1 h-11"
                    placeholder="Ad Soyad"
                    value={form.contactName}
                    onChange={set("contactName")}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    data-testid="input-phone"
                    required
                    type="tel"
                    className="mt-1 h-11"
                    placeholder="+90 5xx xxx xx xx"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta *</Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    required
                    type="email"
                    className="mt-1 h-11"
                    placeholder="firma@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="productionAddress">Üretim Adresi *</Label>
                  <Input
                    id="productionAddress"
                    data-testid="input-productionAddress"
                    required
                    className="mt-1 h-11"
                    placeholder="Fabrika / Atölye adresi"
                    value={form.productionAddress}
                    onChange={set("productionAddress")}
                  />
                </div>
              </div>
            </div>

            {/* Hesap Bilgileri */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Hash className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Hesap Oluştur</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Giriş için şifre belirleyin. Hesabınız admin onayından sonra aktif hale gelir.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Şifre *</Label>
                  <Input
                    id="password"
                    data-testid="input-password"
                    required
                    type="password"
                    className="mt-1 h-11"
                    placeholder="En az 6 karakter"
                    value={form.password}
                    onChange={set("password")}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordConfirm">Şifre Tekrar *</Label>
                  <Input
                    id="passwordConfirm"
                    data-testid="input-passwordConfirm"
                    required
                    type="password"
                    className="mt-1 h-11"
                    placeholder="Şifreyi tekrar girin"
                    value={form.passwordConfirm}
                    onChange={set("passwordConfirm")}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              data-testid="button-submit-apply"
              disabled={isSubmitting}
              className="w-full h-13 text-lg rounded-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <button type="button" onClick={() => setLocation("/auth")} className="text-primary font-semibold hover:underline">
                Giriş yapın
              </button>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
