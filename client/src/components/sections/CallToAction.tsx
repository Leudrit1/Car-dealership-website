import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Car, CircleDollarSign, ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buy a Car Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl bg-card p-8 flex flex-col items-center text-center"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex flex-col items-center"> {/* Added flex-col and items-center */}
              <Car className="h-12 w-12 text-white mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-center"> {/* Added text-center */}
                Suchen Sie<br />ein Fahrzeug?
              </h2>
              <p className="text-muted-foreground text-center"> {/* Added text-center */}
                Wir bieten Ihnen erstklassigen Service<br />
                und faire Beratung.
              </p>
            </div>
            <Link href="/cars">
              <Button className="group">
                Jetzt entdecken
                <ArrowRight className="ml-2 h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <Car className="h-48 w-48 text-white transform rotate-12" />
          </div>
        </motion.div>

        {/* Sell a Car Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-card p-8 flex flex-col items-center text-center"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex flex-col items-center">
              <CircleDollarSign className="h-12 w-12 text-white mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-center">
                Moechten Sie Ihr<br />Auto verkaufen?
              </h2>
              <p className="text-muted-foreground text-center">
                Wir bieten Ihnen erstklassigen Service<br />
                und faire Beratung.
              </p>
            </div>
            <Link href="/sell">
              <Button className="group">
                Jetzt anfragen
                <ArrowRight className="ml-2 h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <CircleDollarSign className="h-48 w-48 text-white transform -rotate-12" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}