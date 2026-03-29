import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-accent text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-white mb-4 block flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              LOMAFY
            </Link>
            <p className="text-white/80 max-w-xs mt-4">
              Sadece üreticiler. Sadece kalite. Sadece doğrudan.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Ürünler</Link></li>
              <li><Link href="/producers" className="text-white/80 hover:text-white transition-colors">Üreticiler</Link></li>
              <li><Link href="/our-story" className="text-white/80 hover:text-white transition-colors">Hikayemiz</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Destek</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">SSS</Link></li>
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Kargo & İadeler</Link></li>
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Lomafy. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Gizlilik Politikası</span>
            <span className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Hizmet Şartları</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
