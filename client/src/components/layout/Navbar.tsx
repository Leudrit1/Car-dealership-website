import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/lib/auth";
import { Menu, X } from "lucide-react";

const LOGO_SRC = "/img/DHMlogo.png";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [logoError, setLogoError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useQuery({ 
    queryKey: ["/api/me"],
    queryFn: getMe
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {!logoError ? (
              <img 
                src={LOGO_SRC} 
                alt="Logo" 
                className="h-9 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-xl font-bold">DHM</span>
            )}
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl">
            <nav className="flex items-center justify-center space-x-8">
              <Link href="/">
                <span className={`transition-colors hover:text-foreground/80 text-sm font-medium ${location === '/' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Startseite
                </span>
              </Link>
              <Link href="/cars">
                <span className={`transition-colors hover:text-foreground/80 text-sm font-medium ${location === '/cars' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Fahrzeuge
                </span>
              </Link>
              <Link href="/contact">
                <span className={`transition-colors hover:text-foreground/80 text-sm font-medium ${location === '/contact' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Kontakt
                </span>
              </Link>
              <Link href="/sell">
                <span className={`transition-colors hover:text-foreground/80 text-sm font-medium ${location === '/sell' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Auto verkaufen
                </span>
              </Link>
              {user?.isAdmin && (
                <Link href="/admin">
                  <span className={`transition-colors hover:text-foreground/80 text-sm font-medium ${location === '/admin' ? 'text-foreground' : 'text-foreground/60'}`}>
                    Admin
                  </span>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex">
              {user ? (
                <Button
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await fetch("/api/logout", { method: "POST" });
                    } catch {
                    } finally {
                      queryClient.setQueryData(["/api/me"], null);
                      navigate("/");
                    }
                  }}
                >
                  Abmelden
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="ghost">Anmelden</Button>
                </Link>
              )}
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Navigation oeffnen"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border pt-2 pb-3 space-y-1">
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <span className={`block px-2 py-2 text-sm font-medium ${location === '/' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Startseite
                </span>
              </Link>
              <Link href="/cars" onClick={() => setMobileOpen(false)}>
                <span className={`block px-2 py-2 text-sm font-medium ${location === '/cars' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Fahrzeuge
                </span>
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                <span className={`block px-2 py-2 text-sm font-medium ${location === '/contact' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Kontakt
                </span>
              </Link>
              <Link href="/sell" onClick={() => setMobileOpen(false)}>
                <span className={`block px-2 py-2 text-sm font-medium ${location === '/sell' ? 'text-foreground' : 'text-foreground/60'}`}>
                  Auto verkaufen
                </span>
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  <span className={`block px-2 py-2 text-sm font-medium ${location === '/admin' ? 'text-foreground' : 'text-foreground/60'}`}>
                    Admin
                  </span>
                </Link>
              )}
              <div className="mt-2 border-t border-border pt-2">
                {user ? (
                  <button
                    type="button"
                    className="w-full text-left px-2 py-2 text-sm font-medium text-foreground"
                    onClick={async () => {
                      try {
                        await fetch("/api/logout", { method: "POST" });
                      } catch {
                      } finally {
                        queryClient.setQueryData(["/api/me"], null);
                        setMobileOpen(false);
                        navigate("/");
                      }
                    }}
                  >
                    Abmelden
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <span className="block px-2 py-2 text-sm font-medium text-foreground">
                      Anmelden
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
}