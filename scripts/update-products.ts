import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_3fmuPxMKO6RJ@ep-steep-haze-aldtgu5h-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});
const db = drizzle(pool, { schema });

// Verified working Unsplash image URLs + saleType assignments
const PRODUCT_UPDATES: Array<{ id: number; imageUrl: string; saleType: 'retail' | 'wholesale' | 'both' }> = [
  { id: 1,  imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", saleType: "both" },     // Çay
  { id: 2,  imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&q=80", saleType: "wholesale" }, // Fındık
  { id: 3,  imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80", saleType: "both" },  // Pekmez
  { id: 4,  imageUrl: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=800&q=80", saleType: "retail" },  // Sabun
  { id: 5,  imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80", saleType: "retail" }, // Bornoz
  { id: 6,  imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80", saleType: "wholesale" }, // Kilim
  { id: 7,  imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80", saleType: "retail" }, // Çini Tabak
  { id: 8,  imageUrl: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&q=80", saleType: "retail" }, // Mumluk
  { id: 9,  imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=800&q=80", saleType: "both" },  // Ahşap
  { id: 10, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", saleType: "retail" },  // Cüzdan
  { id: 11, imageUrl: "https://images.unsplash.com/photo-1580974928064-f0aeef70895a?w=800&q=80", saleType: "retail" }, // Tepsi
  { id: 12, imageUrl: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80", saleType: "both" },  // Bal
  { id: 13, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", saleType: "retail" },  // Kılıf
  { id: 14, imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80", saleType: "retail" }, // Kupa
  { id: 15, imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&q=80", saleType: "retail" }, // Lavanta
  { id: 16, imageUrl: "https://images.unsplash.com/photo-1610395219791-21b0353b9b57?w=800&q=80", saleType: "wholesale" }, // Kesme Tahtası
  { id: 17, imageUrl: "https://images.unsplash.com/photo-1601924357840-3e50ad4dd6c4?w=800&q=80", saleType: "wholesale" }, // Önlük
  { id: 18, imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&q=80", saleType: "retail" }, // Maske
  { id: 19, imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80", saleType: "wholesale" }, // Zeytinyağı
  { id: 20, imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", saleType: "retail" }, // Vazo
  { id: 21, imageUrl: "https://images.unsplash.com/photo-1553531384-411a247ccd73?w=800&q=80", saleType: "retail" },  // Atkı
  { id: 22, imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80", saleType: "retail" },  // Oyuncak
  { id: 23, imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80", saleType: "retail" }, // Tuz Lambası
  { id: 24, imageUrl: "https://images.unsplash.com/photo-1536304993881-ff86e6780497?w=800&q=80", saleType: "wholesale" }, // Badem
  { id: 25, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", saleType: "retail" }, // Çanta
];

async function update() {
  console.log("🔄 Ürünler güncelleniyor...");
  for (const p of PRODUCT_UPDATES) {
    await db.update(products)
      .set({ imageUrl: p.imageUrl, saleType: p.saleType })
      .where(eq(products.id, p.id));
    console.log(`   ✅ Ürün #${p.id} → ${p.saleType}`);
  }
  console.log("\n✨ Tüm ürünler güncellendi!");
  await pool.end();
  process.exit(0);
}

update().catch(err => {
  console.error(err);
  process.exit(1);
});
