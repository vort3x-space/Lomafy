import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary mb-4 block">
              LOMAFY<span className="text-muted-foreground">.</span>
            </Link>
            <p className="text-muted-foreground max-w-xs mt-4">
              Direct from the producer to you. High-quality goods without the middleman markups.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Bestsellers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lomafy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
