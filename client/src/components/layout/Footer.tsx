import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black/40 backdrop-blur-sm py-12 mt-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <img src="/img/DHMlogo.png" alt="Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-muted-foreground">
              Ihr zuverlaessiger Partner fuer Ihr Traumfahrzeug.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <div className="space-y-2">
              <Link href="/cars">
                <span className="block text-muted-foreground hover:text-red-400 transition-colors">
                  Fahrzeuge
                </span>
              </Link>
              <Link href="/sell">
                <span className="block text-muted-foreground hover:text-red-400 transition-colors">
                  Auto verkaufen
                </span>
              </Link>
              <Link href="/contact">
                <span className="block text-muted-foreground hover:text-red-400 transition-colors">
                  Kontakt
                </span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>123 Queensberry Street</p>
              <p>North Melbourne VIC3051</p>
              <p>Australia</p>
              <p>+76 956 039 999</p>
              <p>ali@boxcars.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-red-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-red-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-red-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-red-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DHM. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}