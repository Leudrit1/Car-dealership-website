import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/car/CarCard";
import Benefits from "@/components/sections/Benefits";
import Services from "@/components/sections/Services";
import Features from "@/components/sections/Features";
import CallToAction from "@/components/sections/CallToAction";
import Contact from "@/components/sections/Contact";
import Testimonials from "@/components/sections/Testimonials";
import HistoryVision from "@/components/sections/HistoryVision";
import type { Car } from "@shared/schema";

const heroImage = "https://images.unsplash.com/photo-1601362840469-51e4d8d58785";

export default function Home() {
  const { data: cars, isLoading } = useQuery<Car[]>({ 
    queryKey: ["/api/cars"]
  });

  return (
    <div>
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container max-w-7xl mx-auto px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ihr Traumfahrzeug wartet
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Exklusive Premiumfahrzeuge in der Schweiz
            </p>
            <Link href="/cars">
              <Button size="lg" className="mr-4">
                Kollektion ansehen
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Kontakt
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative container max-w-7xl mx-auto px-8 py-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ausgewaehlte Fahrzeuge</h2>
          <p className="text-lg text-muted-foreground">
            Unsere exklusive Auswahl an Premiumfahrzeugen
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars?.slice(0, 3).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link href="/cars">
            <Button size="lg">Alle Fahrzeuge ansehen</Button>
          </Link>
        </div>
      </section>

      <Services />
      <Features />
      <Benefits />
      <Testimonials />
      <HistoryVision />
      <CallToAction />
      <Contact />
    </div>
  );
}