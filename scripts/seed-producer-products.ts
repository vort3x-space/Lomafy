import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import { users, products, categories } from "../shared/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_3fmuPxMKO6RJ@ep-steep-haze-aldtgu5h-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});
const db = drizzle(pool, { schema });

// 2 products per producer, indexed by producer brand name
const PRODUCER_PRODUCTS: Record<string, Array<{
  name: string; desc: string; price: string; stock: number;
  imageUrl: string; saleType: 'retail' | 'wholesale' | 'both'; catSlug: string;
}>> = {
  "Etkinsa": [
    { name: "Organik Pamuk Tişört", desc: "GOTS sertifikalı %100 organik pamuk, unisex basic tişört", price: "185.00", stock: 80, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", saleType: "retail", catSlug: "tekstil-giyim" },
    { name: "Pamuk Havlu 50x90 (6'lı Set)", desc: "Otel tipi 500gr/m² pamuk havlu, toptan paket", price: "420.00", stock: 40, imageUrl: "https://images.unsplash.com/photo-1607006483224-d2e14f0c1d01?w=800&q=80", saleType: "wholesale", catSlug: "tekstil-giyim" },
  ],
  "Çeksan": [
    { name: "Paslanmaz Çelik Mutfak Bıçağı", desc: "440C çeliği, tam saplı profesyonel şef bıçağı 20cm", price: "340.00", stock: 55, imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80", saleType: "both", catSlug: "el-yapimi" },
    { name: "Metal Bahçe Aletleri Seti", desc: "Galvanizli çelik 5 parça bahçe seti, dayanıklı ahşap sap", price: "580.00", stock: 25, imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", saleType: "wholesale", catSlug: "el-yapimi" },
  ],
  "AnkaraSeramik": [
    { name: "El Boyaması Çini Kase", desc: "İznik çini geleneği, el yapımı dekoratif çorba kasesi", price: "195.00", stock: 35, imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
    { name: "Seramik Biberlik & Tuzluk Seti", desc: "Minyatür çini motifli, el boyaması masa üstü set", price: "125.00", stock: 60, imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
  ],
  "İzmir Örme": [
    { name: "Merino Yün Kazak", desc: "Mulesing-free merino yünü, el trikotajı klasik kazak", price: "620.00", stock: 30, imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80", saleType: "retail", catSlug: "tekstil-giyim" },
    { name: "Yün İplik Seti 500g (10 renk)", desc: "Toptan iplik paketi, el örgüsü için doğal yün karışımı", price: "380.00", stock: 50, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", saleType: "wholesale", catSlug: "tekstil-giyim" },
  ],
  "BursaDoku": [
    { name: "İpek Nevresim Takımı (Çift)", desc: "Bursa doğal ipekli, 22 momme kalite, çift kişilik", price: "1850.00", stock: 15, imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", saleType: "retail", catSlug: "tekstil-giyim" },
    { name: "Bürümcük İpek Kumaş (1m)", desc: "Saf ipek bürümcük kumaş, terzilik için toptan metre", price: "290.00", stock: 100, imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", saleType: "wholesale", catSlug: "tekstil-giyim" },
  ],
  "GaziantepHalı": [
    { name: "El Dokuması Halı 160x230", desc: "Türk düğümlü, yün iplik, geleneksel geometrik desen halı", price: "4200.00", stock: 8, imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
    { name: "Kilim Seccade", desc: "El dokuması pamuk seccade, 70x120 cm", price: "650.00", stock: 25, imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80", saleType: "both", catSlug: "el-yapimi" },
  ],
  "AdanaBaskı": [
    { name: "Organik Pamuk Bez Çanta (50 adet)", desc: "Serigrafi baskı, 38x42cm, toptan promosyon bez çanta", price: "750.00", stock: 200, imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80", saleType: "wholesale", catSlug: "dogal-yasam" },
    { name: "Keten Baskılı Mutfak Önlüğü", desc: "Keten kumaş, el baskısı desen, ayarlanabilir askı", price: "165.00", stock: 45, imageUrl: "https://images.unsplash.com/photo-1585541379137-e5e7c4878813?w=800&q=80", saleType: "retail", catSlug: "tekstil-giyim" },
  ],
  "DenizliPamuk": [
    { name: "Bambu Havlu (3'lü Set)", desc: "%70 bambu %30 pamuk, antibakteriyel yumuşak el havlusu", price: "220.00", stock: 70, imageUrl: "https://images.unsplash.com/photo-1607006483224-d2e14f0c1d01?w=800&q=80", saleType: "both", catSlug: "tekstil-giyim" },
    { name: "Pamuklu Plaj Havlusu Fouta", desc: "Düz dokuma, seyahat için ince, hızlı kuruyan plaj havlusu", price: "185.00", stock: 90, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80", saleType: "retail", catSlug: "tekstil-giyim" },
  ],
  "DüzceMob": [
    { name: "Masif Meşe Kahve Sehpası", desc: "Katı meşe ağacı, el yapımı İskandinav tarz sehpa", price: "2800.00", stock: 10, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
    { name: "Ahşap Dekoratif Duvar Rafı", desc: "Kayın ağacı, 60cm duvar rafı, Scandi minimalist tasarım", price: "380.00", stock: 30, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
  ],
  "KayseriGıda": [
    { name: "Pastırma (300g)", desc: "Geleneksel yöntemle kurutulmuş, çemenli Kayseri pastırması", price: "220.00", stock: 60, imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80", saleType: "both", catSlug: "gida-icecek" },
    { name: "Sucuk (500g)", desc: "Saf dana eti, baharatlı geleneksel Kayseri sucuğu", price: "175.00", stock: 80, imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80", saleType: "both", catSlug: "gida-icecek" },
  ],
  "KonyaTarım": [
    { name: "Kuru Kayısı 1kg", desc: "Malatya doğal kurutma, kükürt ve katkısız kuru kayısı", price: "145.00", stock: 120, imageUrl: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&q=80", saleType: "both", catSlug: "gida-icecek" },
    { name: "Doğal Üzüm Sirkesi 500ml", desc: "Geleneksel fıçı bekletme, doğal fermentasyon üzüm sirkesi", price: "85.00", stock: 95, imageUrl: "https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2?w=800&q=80", saleType: "retail", catSlug: "gida-icecek" },
  ],
  "SinopAhşap": [
    { name: "Gürgen Kaşık Seti (5'li)", desc: "El oyması gürgen ahşap, mutfak kaşıkları çeşit seti", price: "145.00", stock: 65, imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
    { name: "Masif Ahşap Mumluk 3'lü", desc: "Tik ağacı el tornası üçlü mumluk, farklı boy", price: "195.00", stock: 40, imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80", saleType: "retail", catSlug: "el-yapimi" },
  ],
  "RizeÇay": [
    { name: "Çay Bahçesi Taze Çay 250g", desc: "Rize'den taze hasat, kırıntısız birinci kalite siyah çay", price: "95.00", stock: 200, imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", saleType: "both", catSlug: "gida-icecek" },
    { name: "Yeşil Çay 100g", desc: "Rize yüksek yaylasından top tipi doğal yeşil çay", price: "75.00", stock: 150, imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", saleType: "retail", catSlug: "gida-icecek" },
  ],
};

async function seedProducerProducts() {
  console.log("🌱 Üretici ürünleri ekleniyor...\n");

  const allProducers = await db.select().from(users).where(eq(users.role, 'PRODUCER'));
  const allCategories = await db.select().from(categories);
  const catMap = Object.fromEntries(allCategories.map(c => [c.slug, c]));

  let total = 0;
  for (const producer of allProducers) {
    const brand = producer.brandName || "";
    const productList = PRODUCER_PRODUCTS[brand];
    if (!productList) {
      console.log(`   ⚠️  ${brand} için ürün tanımı yok, atlanıyor`);
      continue;
    }
    for (const p of productList) {
      const cat = catMap[p.catSlug];
      await db.insert(products).values({
        name: p.name,
        slug: `${brand.toLowerCase().replace(/\s+/g, '-')}-${total + 1}-${Date.now() + total}`,
        description: p.desc,
        price: p.price,
        stock: p.stock,
        imageUrl: p.imageUrl,
        saleType: p.saleType,
        categoryId: cat?.id,
        producerId: producer.id,
        isActive: true,
      });
      console.log(`   ✅ [${brand}] ${p.name} - ₺${p.price}`);
      total++;
    }
  }

  console.log(`\n✨ Toplam ${total} ürün eklendi!`);
  await pool.end();
  process.exit(0);
}

seedProducerProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
