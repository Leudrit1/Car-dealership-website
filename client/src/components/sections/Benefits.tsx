import { motion } from "framer-motion";
import { Wallet, Shield, Tags, Wrench } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: <Wallet className="w-12 h-12 text-white" />,
      title: "Finanzierung",
      description: "Flexible Finanzloesungen und unkomplizierte Genehmigung.",
    },
    {
      icon: <Shield className="w-12 h-12 text-white" />,
      title: "Serioeser Autohandel",
      description: "Jahrelange Erfahrung und zufriedene Kunden – Ihr zuverlaessiger Partner.",
    },
    {
      icon: <Tags className="w-12 h-12 text-white" />,
      title: "Transparente Preise",
      description: "Klare Preise ohne versteckte Gebuehren.",
    },
    {
      icon: <Wrench className="w-12 h-12 text-white" />,
      title: "Fachgerechter Service",
      description: "Professionelle Wartung und Reparatur fuer Ihr Fahrzeug.",
    },
  ];

  return (
    <section className="py-16 bg-black/5 rounded-xl">
      <div className="container max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 pl-4 section-red-line">
            Was Ihnen wichtig ist,
            <br />
            ist uns wichtig
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-lg text-center"
            >
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}