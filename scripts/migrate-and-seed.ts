import { db } from "../server/db";
import { users, categories, products } from "@shared/schema";
import bcrypt from "bcryptjs";

const PRODUCER_NAMES = [
  "Etkinsa Tekstil", "Çeksan Metal", "Ankara Seramik", "İzmir Örme", 
  "Bursa Dokuma", "Gaziantep Halı", "Adana Baskı", "Denizli Pamuk",
  "Düzce Mobilya", "Kayseri Şeker", "Konya Tarım", "Sinop Ahşap",
  "Rize Çay", "Giresun Fındık", "Muş Hayvancılık"
];

const PRODUCT_NAMES = [
  "Premium Cıvata Seti", "Otomotiv Conta", "Endüstriyel Geçiş", 
  "Yapı Malzemesi Profil", "Elektriksel Aksesuarlar", "Makine Parçası",
  "Çelik Yapılar", "Alüminyum Panel", "Plastik Enjeksiyon", 
  "Cam Fiber Ürünler", "Kauçuk Kaplamalar", "Metal Dökmeler",
  "Kaynak Malzemeleri", "Kalıp Parçaları", "Yedek Komponent",
  "Endüstriyel Hortum", "Flanş Bağlantıları", "Contalar ve Rondela",
  "Vida ve Somun", "Mühendislik Plastikleri", "Elastomer Ürünler",
  "Yapıştırıcı Solüsyonlar", "Yalıtım Malzemeleri", "Temiz Enerji Parçaları",
  "İleri Seramikler", "Tekstil Arayüzleri", "Otomotiv Kabin Bileşenleri",
  "Hassas Makine Parçaları", "Medya Filtreleri"
];

const DESCRIPTIONS = [
  "Yüksek kaliteli endüstriyel ürün, aracısız doğrudan üreticiden",
  "Sertifikalı ve test edilmiş ürün, uzun ömürlü performans",
  "Mühendislik standartlarına uygun, gümrük geçişli",
  "Toptan veya perakende satışa uygun, esnek koşullar",
  "Üreticinin doğrudan önerisi ile sunulan kaliteli ürün",
  "Stokta mevcut, hızlı kargo imkanı ile müsait"
];

async function migrateAndSeed() {
  try {
    console.log("🔄 Migration başlıyor...");

    // Admin hesabı oluştur
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await db.insert(users).values({
      email: "admin@lomafy.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
      isApproved: true
    }).returning().then(res => res[0]);
    console.log("✅ Admin hesabı oluşturuldu");

    // Kategoriler oluştur
    const cat1 = await db.insert(categories).values({
      name: "Endüstriyel Malzeme",
      slug: "endustriyel-malzeme"
    }).returning().then(res => res[0]);

    const cat2 = await db.insert(categories).values({
      name: "Makine Parçaları",
      slug: "makine-parcalari"
    }).returning().then(res => res[0]);

    const cat3 = await db.insert(categories).values({
      name: "Elektrik & Elektronik",
      slug: "elektrik-elektronik"
    }).returning().then(res => res[0]);

    console.log("✅ Kategoriler oluşturuldu");

    // Üretici hesapları oluştur (10-15 adet)
    const producerCount = Math.floor(Math.random() * 6) + 10; // 10-15 adet
    const createdProducers = [];

    for (let i = 0; i < producerCount; i++) {
      const producerPassword = await bcrypt.hash("producer123", 10);
      const producer = await db.insert(users).values({
        email: `uretici${i + 1}@lomafy.com`,
        password: producerPassword,
        name: PRODUCER_NAMES[i],
        role: "PRODUCER",
        brandName: PRODUCER_NAMES[i],
        isApproved: true
      }).returning().then(res => res[0]);
      createdProducers.push(producer);
    }
    console.log(`✅ ${producerCount} üretici hesabı oluşturuldu`);

    // Random ürünler oluştur (20-30 adet)
    const productCount = Math.floor(Math.random() * 11) + 20; // 20-30 adet
    const categories_arr = [cat1, cat2, cat3];

    for (let i = 0; i < productCount; i++) {
      const randomProducer = createdProducers[Math.floor(Math.random() * createdProducers.length)];
      const randomCategory = categories_arr[Math.floor(Math.random() * categories_arr.length)];
      
      const price = (Math.floor(Math.random() * 9000) + 1000).toString();
      const stock = Math.floor(Math.random() * 100) + 10;

      await db.insert(products).values({
        categoryId: randomCategory.id,
        producerId: randomProducer.id,
        name: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} v${i + 1}`,
        slug: `urun-${i + 1}-${Date.now()}`,
        description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
        price,
        stock,
        imageUrl: `https://images.unsplash.com/photo-${1546868871 + i}?auto=format&fit=crop&q=80&w=800`,
        isActive: true
      }).then(res => res[0]);
    }
    console.log(`✅ ${productCount} ürün oluşturuldu`);

    console.log("\n✨ Migration ve seeding başarıyla tamamlandı!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

migrateAndSeed();
