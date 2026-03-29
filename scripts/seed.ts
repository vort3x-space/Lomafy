import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import { users, categories, products } from "../shared/schema";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const NEON_URL = process.env.SEED_DATABASE_URL || process.env.DATABASE_URL;

if (!NEON_URL) {
  console.error("SEED_DATABASE_URL veya DATABASE_URL gerekli!");
  process.exit(1);
}

const pool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });
const db = drizzle(pool, { schema });

const PRODUCERS = [
  { name: "Etkinsa Tekstil", brand: "Etkinsa", email: "etkinsa@lomafy.com" },
  { name: "Çeksan Metal", brand: "Çeksan", email: "ceksan@lomafy.com" },
  { name: "Ankara Seramik", brand: "AnkaraSeramik", email: "ankaraseramik@lomafy.com" },
  { name: "İzmir Örme San.", brand: "İzmir Örme", email: "izmirorme@lomafy.com" },
  { name: "Bursa Dokuma A.Ş.", brand: "BursaDoku", email: "bursadokuma@lomafy.com" },
  { name: "Gaziantep Halı", brand: "GaziantepHalı", email: "gaziantephali@lomafy.com" },
  { name: "Adana Baskı Ltd.", brand: "AdanaBaskı", email: "adanabaskı@lomafy.com" },
  { name: "Denizli Pamuk", brand: "DenizliPamuk", email: "denizlipamuk@lomafy.com" },
  { name: "Düzce Mobilya", brand: "DüzceMob", email: "duzcemobilya@lomafy.com" },
  { name: "Kayseri Gıda", brand: "KayseriGıda", email: "kayserigida@lomafy.com" },
  { name: "Konya Tarım Ürün.", brand: "KonyaTarım", email: "konyatarim@lomafy.com" },
  { name: "Sinop Ahşap", brand: "SinopAhşap", email: "sinopahsap@lomafy.com" },
  { name: "Rize Çay İşl.", brand: "RizeÇay", email: "rizecay@lomafy.com" },
];

const PRODUCT_DATA = [
  { name: "Organik Siyah Çay 500g", desc: "Rize'nin eteklerinden toplanan birinci sınıf siyah çay", price: "189.90", stock: 150, cat: 0, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80" },
  { name: "Ham Fındık 1kg", desc: "Doğu Karadeniz'den taze hasat fındık, aracısız üreticiden", price: "320.00", stock: 80, cat: 0, img: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=800&q=80" },
  { name: "Doğal Pekmez 750ml", desc: "Geleneksel yöntemlerle üzümden elde edilmiş doğal pekmez", price: "95.50", stock: 200, cat: 0, img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80" },
  { name: "Zeytinyağı Sabunu 3'lü Set", desc: "El yapımı, katkısız saf zeytinyağı sabunu seti", price: "145.00", stock: 120, cat: 1, img: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=800&q=80" },
  { name: "Pamuklu Bornoz L", desc: "100% Egeli pamuk, yumuşak dokulu lüks bornoz", price: "450.00", stock: 60, cat: 1, img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80" },
  { name: "El Dokuması Kilim 120x180", desc: "Anadolu motifleri işlenmiş geleneksel el dokuması kilim", price: "2850.00", stock: 15, cat: 1, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { name: "Çini Tabak Seti 6'lı", desc: "İznik çini sanatı, el boyaması altı kişilik tabak seti", price: "780.00", stock: 30, cat: 2, img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80" },
  { name: "Mermer Mumluk", desc: "Doğal Afyon mermeri, el işçiliği mumluk dekor ürünü", price: "220.00", stock: 45, cat: 2, img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80" },
  { name: "Ahşap Yemek Takımı", desc: "Gürgen ağacı, el tornası yemek takımı (kaşık-çatal-spatula)", price: "165.00", stock: 90, cat: 2, img: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80" },
  { name: "Deri Cüzdan El Yapımı", desc: "Gerçek dana derisi, el dikişi erkek cüzdanı, özel üretim", price: "385.00", stock: 55, cat: 3, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" },
  { name: "Bakır Çarşı Tepsisi", desc: "Geleneksel el dövmesi bakır çarşı tepsisi, 40cm", price: "540.00", stock: 25, cat: 2, img: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&q=80" },
  { name: "Organik Bal 500g", desc: "Kekik çiçeği balı, sertifikalı organik, cam kavanoz", price: "275.00", stock: 100, cat: 0, img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80" },
  { name: "Keten Yastık Kılıfı 2'li", desc: "El dokuma keten, doğal boyalı yastık kılıfı seti", price: "210.00", stock: 70, cat: 1, img: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&q=80" },
  { name: "Seramik Kupa Seti 2'li", desc: "El yapımı seramik, çifti uyumlu espresso & çay kupası", price: "145.00", stock: 85, cat: 2, img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80" },
  { name: "Doğal Lavanta Yastığı", desc: "Isparta lavantası dolu, uyku yardımcı aromaterapi yastık", price: "125.00", stock: 110, cat: 1, img: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&q=80" },
  { name: "Masif Ahşap Kesme Tahtası", desc: "Kayın ağacı, sıvı geçirmez işlemli mutfak kesme tahtası", price: "195.00", stock: 65, cat: 2, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { name: "Pamuk Bahçe Önlüğü", desc: "Ağır hizmet tipi %100 pamuk, derin cepler, ayarlanabilir askı", price: "175.00", stock: 40, cat: 1, img: "https://images.unsplash.com/photo-1585541379137-e5e7c4878813?w=800&q=80" },
  { name: "Kil Güzellik Maskesi 200ml", desc: "Doğal kil & argan yağı içerikli derin temizleyici maske", price: "89.90", stock: 130, cat: 3, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
  { name: "Zeytinyağı 5L Teneke", desc: "Ege'den erken hasat, soğuk sıkım sızma zeytinyağı", price: "650.00", stock: 50, cat: 0, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80" },
  { name: "Çini Vazo El Boyaması", desc: "Osmanlı dönemi motifli, el boyaması büyük çini vazo", price: "1250.00", stock: 12, cat: 2, img: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&q=80" },
  { name: "Koza İpek Atkı", desc: "Bursa'dan doğal ipek, el boyaması %100 kozadan atkı", price: "420.00", stock: 35, cat: 1, img: "https://images.unsplash.com/photo-1601924357840-3e50ad4dd6c4?w=800&q=80" },
  { name: "Ahşap Oyuncak Seti", desc: "Doğal boya, ASTM güvenlik sertifikalı, 5-10 yaş ahşap oyuncak", price: "285.00", stock: 45, cat: 3, img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80" },
  { name: "Doğal Tuz Lambası 3-4kg", desc: "Himalaya pembesi tuz kristali, ahşap tabanlı iyonlaştırıcı lamba", price: "310.00", stock: 30, cat: 3, img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80" },
  { name: "Organik Badem Ezmesi 250g", desc: "Sade, şekersiz, katkısız öğütülmüş çiğ badem ezmesi", price: "165.00", stock: 75, cat: 0, img: "https://images.unsplash.com/photo-1536304993881-ff86e6780497?w=800&q=80" },
  { name: "Mantar Derisi Çanta", desc: "Sürdürülebilir mantar derisi, el dikişi tote çanta, vegan", price: "795.00", stock: 20, cat: 3, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" },
];

async function seed() {
  console.log("🌱 Neon veritabanı seeding başlıyor...\n");

  try {
    // Kategoriler
    console.log("📂 Kategoriler oluşturuluyor...");
    const [gida, tekstil, elyapimi, diger] = await Promise.all([
      db.insert(categories).values({ name: "Gıda & İçecek", slug: "gida-icecek" }).returning().then(r => r[0]),
      db.insert(categories).values({ name: "Tekstil & Giyim", slug: "tekstil-giyim" }).returning().then(r => r[0]),
      db.insert(categories).values({ name: "El Yapımı Ürünler", slug: "el-yapimi" }).returning().then(r => r[0]),
      db.insert(categories).values({ name: "Doğal Yaşam", slug: "dogal-yasam" }).returning().then(r => r[0]),
    ]);
    const cats = [gida, tekstil, elyapimi, diger];
    console.log(`   ✅ 4 kategori oluşturuldu`);

    // Admin
    console.log("\n👤 Admin hesabı oluşturuluyor...");
    const hashedAdmin = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      email: "admin@lomafy.com",
      password: hashedAdmin,
      name: "LOMAFY Admin",
      role: "ADMIN",
      isApproved: true,
    });
    console.log("   ✅ admin@lomafy.com / admin123");

    // Üreticiler
    console.log("\n🏭 Üreticiler oluşturuluyor...");
    const createdProducers = [];
    for (const p of PRODUCERS) {
      const hashed = await bcrypt.hash("uretici123", 10);
      const producer = await db.insert(users).values({
        email: p.email,
        password: hashed,
        name: p.name,
        role: "PRODUCER",
        brandName: p.brand,
        isApproved: true,
      }).returning().then(r => r[0]);
      createdProducers.push(producer);
      console.log(`   ✅ ${p.brand} (${p.email})`);
    }

    // Ürünler
    console.log("\n📦 Ürünler oluşturuluyor...");
    for (let i = 0; i < PRODUCT_DATA.length; i++) {
      const p = PRODUCT_DATA[i];
      const producer = createdProducers[i % createdProducers.length];
      const category = cats[p.cat];
      await db.insert(products).values({
        name: p.name,
        slug: `urun-${i + 1}-${Date.now() + i}`,
        description: p.desc,
        price: p.price,
        stock: p.stock,
        imageUrl: p.img,
        categoryId: category.id,
        producerId: producer.id,
        isActive: true,
      });
      console.log(`   ✅ ${p.name} - ₺${p.price}`);
    }

    console.log(`\n✨ Seeding tamamlandı!`);
    console.log(`   📂 4 kategori`);
    console.log(`   👤 1 admin`);
    console.log(`   🏭 ${PRODUCERS.length} üretici`);
    console.log(`   📦 ${PRODUCT_DATA.length} ürün`);
    console.log(`\n🔑 Giriş bilgileri:`);
    console.log(`   Admin: admin@lomafy.com / admin123`);
    console.log(`   Üretici: etkinsa@lomafy.com / uretici123`);

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Hata:", err);
    await pool.end();
    process.exit(1);
  }
}

seed();
