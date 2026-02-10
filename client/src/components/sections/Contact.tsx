import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const contactImage = "https://images.unsplash.com/photo-1580273916550-e323be2ae537";

export default function Contact() {
  return (
    <section className="relative py-16">
      <div className="absolute inset-0">
        <img 
          src={contactImage} 
          alt="Kontakt Hintergrund" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative container max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Noch Fragen?
            <br />
            Kontaktieren Sie uns
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            123 Musterstrasse
            <br />
            8000 Zuerich, Schweiz
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <motion.a
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="tel:+41441234567"
            className="flex items-center gap-3 text-lg hover:text-red-400 transition-colors"
          >
            <Phone className="w-6 h-6 text-white" />
            <span>+76 956 039 999</span>
          </motion.a>

          <motion.a
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            href="mailto:ali@boxcars.com"
            className="flex items-center gap-3 text-lg hover:text-red-400 transition-colors"
          >
            <Mail className="w-6 h-6 text-white" />
            <span>ali@boxcars.com</span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4"
          >
            <Link href="/contact">
              <Button className="group text-lg">
                Kontakt
                <ArrowRight className="ml-2 h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
